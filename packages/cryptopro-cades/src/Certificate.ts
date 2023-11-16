import { unwrap } from './api/internal/unwrap';
import { CAPICOM_ENCODING_TYPE } from './constants';
import { CryptoError } from './errors';
import type { ICertificate } from './types';
import { parseCertificate } from './utils/certificateParser';

/**
 * Класс объекта Сертификата для удобной работы.
 * !!! НЕ является имплементацией @see ICertificate (к-ый является интерфейсом Крипто системы ОС).
 * @class Certificate
 */
export class Certificate {
  /**
   * Данные о владельце сертификата.
   * @remarks названия полей должны совпадать с @attributeOids в oids-dictionary.ts
   */
  subject: {
    commonName: string | null;
    surname: string | null;
    name: string | null;
    country: string | null;
    region: string | null;
    locality: string | null;
    street: string | null;
    organization: string | null;
    department: string | null;
    post: string | null;
    ogrnip: string | null;
    ogrn: string | null;
    snils: string | null;
    innLe: string | null;
    inn: string | null;
    email: string | null;
  } = {
    commonName: null,
    surname: null,
    name: null,
    country: null,
    region: null,
    locality: null,
    street: null,
    organization: null,
    department: null,
    post: null,
    ogrnip: null,
    ogrn: null,
    snils: null,
    innLe: null,
    inn: null,
    email: null,
  };

  /**
   * Данные об издателе сертификата.
   * @remarks названия полей должны совпадать с @attributeOids в oids-dictionary.ts
   */
  issuer: {
    commonName: string | null;
    inn: string | null;
    innLe: string | null;
  } = {
    commonName: null,
    inn: null,
    innLe: null,
  };

  /**
   *  Отпечаток сертификата (хэш SHA-1).
   * @property {string|null}
   */
  thumbprint: string | null = null;

  /**
   *  Дата-время с которого сертификат вступает в силу.
   * @property {Date|null}
   */
  notBefore: Date | null = null;

  /**
   * Дата-время до которого сертификат действует.
   * @property {Date|null}
   */
  notAfter: Date | null = null;

  /**
   * Имя владельца сертификата.
   * @property {string|null}
   */
  subjectName: string | null = null;

  /**
   *  Идентификатор субъекта сертификата.
   * @property {string|null}
   */
  subjectKeyId: string | null = null;

  /**
   * Base64 строка открытой части сертификата.
   * @property {string|null}
   */
  certificateBase64Data: string | null = null;

  /**
   * Исходный сертификат из плагина.
   * @property {ICertificate|null}
   */
  certificateBin: ICertificate | null = null;

  /**
   * Имя криптопровайдера.
   * @property {string|null}
   */
  providerName: string | null = null;

  /**
   * Тип криптопровайдера.
   * @property {number|null}
   */
  providerType: number | null = null;

  /**
   * Есть ли закрытый ключ.
   * @property {boolean}
   */
  hasPrivateKey: boolean = false;

  /**
   * Гостовский ключ или нет.
   */
  isGost: boolean = false;

  /**
   * OID алгоритма ключа.
   */
  algorithm: string | null = null;

  /**
   * Приватный конструктор.
   * @param cfg сертификат из @see IStore.
   */
  private constructor(cfg: ICertificate) {
    this.certificateBin = cfg;
  }

  /**
   * Распарсить сертификат из исходного объекта.
   * @param {ICertificate} cert исходный сертификат.
   * @throws {CryptoError} в случае ошибки.
   * @returns {Promise<Certificate>} распрасенный сертификат.
   */
  public static async CreateFrom(cert: ICertificate): Promise<Certificate> {
    if (!cert) {
      const errorMessage = 'Не указаны данные исходного сертификата.';

      throw CryptoError.create('CBP-7', errorMessage, null, errorMessage);
    }

    if (cert instanceof Certificate) {
      return cert;
    }

    const certificate = new Certificate(cert);

    certificate.subjectName = await unwrap(cert.SubjectName);
    certificate.thumbprint = await unwrap(cert.Thumbprint);
    certificate.notAfter = await unwrap(cert.ValidToDate);
    certificate.notBefore = await unwrap(cert.ValidFromDate);

    certificate.certificateBase64Data = await unwrap(
      cert.Export(CAPICOM_ENCODING_TYPE.CAPICOM_ENCODE_BASE64),
    );

    try {
      certificate.hasPrivateKey = await unwrap(cert.HasPrivateKey());

      const oPrivateKey = await unwrap(cert.PrivateKey);

      certificate.providerName = await unwrap(oPrivateKey.ProviderName);
      certificate.providerType = await unwrap(oPrivateKey.ProviderType);
    } catch (error) {
      // ошибка не критична, просто создаем ошибку (в дебаге оно залогируется само)
      CryptoError.createCadesError(
        error,
        `Ошибка получения информации о приватном ключе сертификата ${certificate.thumbprint}.`,
      );

      certificate.hasPrivateKey = false;
    }

    parseCertificate(certificate);

    return certificate;
  }
}
