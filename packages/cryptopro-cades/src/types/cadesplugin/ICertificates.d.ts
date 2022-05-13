import { CAPICOM_CERTIFICATE_FIND_TYPE } from '../../constants';
import { ICertificate } from './ICertificate';

/**
 * Коллекция сертификатов.
 * @see https://docs.microsoft.com/en-us/windows/win32/seccrypto/certificates
 */
export interface ICertificates {
  objid: number;

  /**
   * Returns a Certificates object that contains all certificates that match the specified search criteria.
   * @see https://docs.microsoft.com/en-us/windows/win32/seccrypto/certificates-find
   * @param findType Тип поиска, по какому полю.
   * @param searchCriteria Критерий поиска сертификатов. Тип данных должен совпадать с типом поиска, см по ссылке выше.
   * @param findValidOnly
   */
  Find(
    findType: CAPICOM_CERTIFICATE_FIND_TYPE,
    searchCriteria?: any,
    findValidOnly?: boolean
  ): WithPromise<ICertificates>;

  /**
   * Retrieves the number of Certificate objects in the collection.
   */
  Count: WithPromise<number>;

  /**
   * Retrieves a Certificate object that represents the indexed certificate of the collection. This is the default property.
   * @param index
   */
  Item(index: number): WithPromise<ICertificate>;
}
