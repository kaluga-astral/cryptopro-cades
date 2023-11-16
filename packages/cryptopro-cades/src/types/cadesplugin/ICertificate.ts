import type {
  CAPICOM_CERT_INFO_TYPE,
  CAPICOM_ENCODING_TYPE,
} from '../../constants';
import type { WithOptionalPromise } from '../WithOptionalPromise';

/**
 * Описывает сертификат открытого ключа.
 * @see https://docs.microsoft.com/en-us/windows/win32/seccrypto/certificate
 * @see https://docs.cryptopro.ru/cades/reference/cadescom/cadescom_class/cpcertificate
 */
export interface ICertificate {
  /**
   * Издатель сертификата.
   */
  readonly IssuerName: WithOptionalPromise<string>;

  /**
   * Имя субъекта.
   */
  readonly SubjectName: WithOptionalPromise<string>;

  /**
   * Версия сертификата.
   */
  readonly Version: WithOptionalPromise<string>;

  /**
   * Серийный номер.
   */
  readonly SerialNumber: WithOptionalPromise<string>;

  /**
   * Отпечаток.
   */
  readonly Thumbprint: WithOptionalPromise<string>;

  /**
   * Дата, с которой сертификат действителен.
   */
  readonly ValidFromDate: WithOptionalPromise<Date>;

  /**
   * Дата, до которой сертификат действителен.
   */
  readonly ValidToDate: WithOptionalPromise<Date>;

  /**
   * Закрытый ключ.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly PrivateKey: WithOptionalPromise<any>;

  /**
   * Возвращает информацию из сертификата.
   * @param InfoType Enumeration type defines what information is to be queried from a certificate.
   * @returns {WithOptionalPromise<string>} Запрошенная информация в виде строки.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  GetInfo(InfoType: CAPICOM_CERT_INFO_TYPE): WithOptionalPromise<any>;

  /**
   * Экспортирует открытую часть сертификата в виде Base64 строки.
   * @remarks возвращает без BEGIN и END CERTIFICATE. А перенос строки каждые 64 символа и зависит от ОС: \r\n или \n
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Export(EncodingType: CAPICOM_ENCODING_TYPE): WithOptionalPromise<any>;

  /**
   * Импотирует открытую часть сертификата в виде Base64 строки.
   */
  Import(base64Certificate: string): WithOptionalPromise<void>;

  /**
   * Имеется ли закрытый ключ для сертификата.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  HasPrivateKey(): WithOptionalPromise<any>;

  /**
   * Является ли сертификат валидным.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  IsValid(): WithOptionalPromise<any>;
}
