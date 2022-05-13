import { CAPICOM_CERT_INFO_TYPE } from '../../constants';
import { CAPICOM_ENCODING_TYPE } from '../../constants';

/**
 * Описывает сертификат открытого ключа.
 * @see https://docs.microsoft.com/en-us/windows/win32/seccrypto/certificate
 * @see https://docs.cryptopro.ru/cades/reference/cadescom/cadescom_class/cpcertificate
 */
export interface ICertificate {
  /**
   * Издатель сертификата.
   */
  readonly IssuerName: WithPromise<string>;

  /**
   * Имя субъекта.
   */
  readonly SubjectName: WithPromise<string>;

  /**
   * Версия сертификата.
   */
  readonly Version: WithPromise<string>;

  /**
   * Серийный номер.
   */
  readonly SerialNumber: WithPromise<string>;

  /**
   * Отпечаток.
   */
  readonly Thumbprint: WithPromise<string>;

  /**
   * Дата, с которой сертификат действителен.
   */
  readonly ValidFromDate: WithPromise<Date>;

  /**
   * Дата, до которой сертификат действителен.
   */
  readonly ValidToDate: WithPromise<Date>;

  /**
   * Закрытый ключ.
   */
  readonly PrivateKey: WithPromise<any>;

  /**
   * Возвращает информацию из сертификата.
   * @param InfoType Enumeration type defines what information is to be queried from a certificate.
   * @returns {WithPromise<string>} Запрошенная информация в виде строки.
   */
  GetInfo(InfoType: CAPICOM_CERT_INFO_TYPE): WithPromise<any>;

  /**
   * Экспортирует открытую часть сертификата в виде Base64 строки.
   * @remarks возвращает без BEGIN и END CERTIFICATE. А перенос строки каждые 64 символа и зависит от ОС: \r\n или \n
   */
  Export(EncodingType: CAPICOM_ENCODING_TYPE): WithPromise<any>;

  /**
   * Имеется ли закрытый ключ для сертификата.
   */
  HasPrivateKey(): WithPromise<any>;

  /**
   * Является ли сертификат валидным.
   */
  IsValid(): WithPromise<any>;
}
