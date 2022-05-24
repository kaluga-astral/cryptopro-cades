import { CAPICOM_CERT_INFO_TYPE, CAPICOM_ENCODING_TYPE } from './constants';
import { CryptoError } from './errors';
import { ICertificate } from './types/cadesplugin/ICertificate';
import { parseCertificate } from './utils/certificateParser';

/**
 * Класс объекта Сертификата для удобной работы.
 * !!! НЕ является имплементацией @see ICertificate (к-ый является интерфейсом Крипто системы ОС).
 * @class Certificate
 */
export class Certificate {
  /**
   *
   * @property {string|null}
   */
  name: string | null = null;

  /**
   * Наименование издателя сертификата.
   * @property {string|null}
   */
  issuerName: string | null = null;

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
   * Данные о владельце сертификата.
   */
  subject = {
    SN: null, // SN=МИРОНЧУК
    G: null, // G=ВИКТОР АРКАДИЕВИЧ
    T: null, // T=ДИРЕКТОР
    CN: null, // CN="ЧУ ДПО УЧЕБНЫЙ ЦЕНТР ""ФОРМУЛА"""
    O: null, // O="ЧУ ДПО УЧЕБНЫЙ ЦЕНТР ""ФОРМУЛА"""
    STREET: null, // STREET="УЛИЦА ЛЕНИНА, 77, -, -"
    L: null, // L=КАЛУГА
    S: null, // S=40 Калужская область
    C: null, // C=RU
    SNILS: null, // SNILS=00638140318
    OGRN: null, // OGRN=1044004603070
    OGRNIP: null,
    INN: null, // INN=402701356218
    INNLE: null, // INNLE=4028031214
    OU: null,
    E: null,
  };

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

    if (cert.SubjectName instanceof Promise) {
      certificate.name = await cert.GetInfo(
        CAPICOM_CERT_INFO_TYPE.CAPICOM_CERT_INFO_SUBJECT_SIMPLE_NAME
      );
      certificate.issuerName = await cert.GetInfo(
        CAPICOM_CERT_INFO_TYPE.CAPICOM_CERT_INFO_ISSUER_SIMPLE_NAME
      );
      certificate.subjectName = await cert.SubjectName;
      certificate.thumbprint = await cert.Thumbprint;
      certificate.notAfter = await cert.ValidToDate;
      certificate.notBefore = await cert.ValidFromDate;
      certificate.certificateBase64Data = await cert.Export(
        CAPICOM_ENCODING_TYPE.CAPICOM_ENCODE_BASE64
      );
      try {
        certificate.hasPrivateKey = await cert.HasPrivateKey();
        const oPrivateKey = await cert.PrivateKey;
        certificate.providerName = await oPrivateKey.ProviderName;
        certificate.providerType = await oPrivateKey.ProviderType;
      } catch (error) {
        console.warn(
          CryptoError.createCadesError(
            error,
            `Ошибка получения информации о приватном ключе сертификата ${certificate.thumbprint}.`
          )
        );
        certificate.hasPrivateKey = false;
      }
    } else {
      certificate.name = cert.GetInfo(
        CAPICOM_CERT_INFO_TYPE.CAPICOM_CERT_INFO_SUBJECT_SIMPLE_NAME
      );
      certificate.issuerName = cert.GetInfo(
        CAPICOM_CERT_INFO_TYPE.CAPICOM_CERT_INFO_ISSUER_SIMPLE_NAME
      );
      certificate.subjectName = cert.SubjectName;
      certificate.thumbprint = cert.Thumbprint as string;
      certificate.notAfter = cert.ValidToDate as Date;
      certificate.notBefore = cert.ValidFromDate as Date;
      certificate.certificateBase64Data = cert.Export(
        CAPICOM_ENCODING_TYPE.CAPICOM_ENCODE_BASE64
      );

      try {
        certificate.hasPrivateKey = cert.HasPrivateKey();
        const oPrivateKey = cert.PrivateKey;
        certificate.providerName = oPrivateKey.ProviderName;
        certificate.providerType = oPrivateKey.ProviderType;
      } catch (error) {
        console.warn(
          CryptoError.createCadesError(
            error,
            `Ошибка получения информации о приватном ключе сертификата ${certificate.thumbprint}.`
          )
        );
        certificate.hasPrivateKey = false;
      }
    }

    Object.keys(certificate.subject).forEach((key) => {
      certificate.subject[key] = certificate.extractFromTitle(
        certificate.subjectName!,
        [key]
      );
    });
    parseCertificate(certificate);

    return certificate;
  }

  /**
   * Получение строки для тайтла сертификата и сабтайтла
   *
   * @example
   *
   * const subjectName = "CN=_тест_ВипНет_в_КриптоПро1, O=_тест_ВипНет_в_КриптоПро1, L=г Калуга" --> "
   * extractFromTitle(subjectName, [ "CN" ]) // "_тест_ВипНет_в_КриптоПро1"
   *
   * @param {string} name имя владеьльца или УЦ (@see #subjectName|@see #issuerName).
   * @param {string[]} partsOfName ключи для извлечения из названия.
   * @returns {string} .данные указанного свойства.
   */
  extractFromTitle(name: string, partsOfName: string[]): string {
    const certificateTitles: string[] = [];

    partsOfName.forEach((item) => {
      const regExp = new RegExp(`${item}=(.*?),`);
      certificateTitles.push(name.match(regExp)?.[1] ?? '');
    });

    return certificateTitles.join(' ');
  }
}
