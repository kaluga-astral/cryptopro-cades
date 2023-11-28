import type { CAPICOM_STORE_OPEN_MODE, STORE_LOCATION } from '../../constants';
import type { WithOptionalPromise } from '../WithOptionalPromise';

import type { ICertificates } from './ICertificates';

/**
 * Описывает хранилище сертификатов.
 * @see https://docs.cryptopro.ru/cades/reference/cadescom/cadescom_class/store
 */
export interface IStore {
  /**
   * Открывает хранилище сертификатов.
   * @param storeLocation расположение хранилища сертификатов.
   * @param storeName наименование хранилища сертификатов.
   * @param openMode режим открытия хранилища.
   */
  Open(
    storeLocation: STORE_LOCATION,
    storeName: string,
    openMode: CAPICOM_STORE_OPEN_MODE,
  ): WithOptionalPromise<void>;

  /**
   * Закрывает хранилище сертификатов.
   */
  Close(): WithOptionalPromise<void>;

  /**
   * Возвращает коллекцию сертификатов в хранилище.
   */
  Certificates: WithOptionalPromise<ICertificates>;
}
