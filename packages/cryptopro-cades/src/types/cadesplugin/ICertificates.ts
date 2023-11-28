import type { CAPICOM_CERTIFICATE_FIND_TYPE } from '../../constants';
import type { WithOptionalPromise } from '../WithOptionalPromise';

import type { ICertificate } from './ICertificate';

/**
 * Коллекция сертификатов.
 * @see https://docs.microsoft.com/en-us/windows/win32/seccrypto/certificates
 */
export interface ICertificates {
  /**
   * Returns a Certificates object that contains all certificates that match the specified search criteria.
   * @see https://docs.microsoft.com/en-us/windows/win32/seccrypto/certificates-find
   * @param findType Тип поиска, по какому полю.
   * @param searchCriteria Критерий поиска сертификатов. Тип данных должен совпадать с типом поиска, см по ссылке выше.
   * @param findValidOnly
   */
  Find(
    findType: CAPICOM_CERTIFICATE_FIND_TYPE,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    searchCriteria?: any,
    findValidOnly?: boolean,
  ): WithOptionalPromise<ICertificates>;

  /**
   * Retrieves the number of Certificate objects in the collection.
   */
  Count: WithOptionalPromise<number>;

  /**
   * Retrieves a Certificate object that represents the indexed certificate of the collection. This is the default property.
   * @param index
   */
  Item(index: number): WithOptionalPromise<ICertificate>;
}
