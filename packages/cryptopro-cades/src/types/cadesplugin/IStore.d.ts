import {
  CAPICOM_MY_STORE,
  CAPICOM_STORE_OPEN_MODE,
  STORE_LOCATION,
} from './../../constants';
import { ICertificates } from './ICertificates';

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
    storeLocation: STORE_LOCATION = STORE_LOCATION.CADESCOM_CURRENT_USER_STORE,
    storeName?: string = CAPICOM_MY_STORE,
    openMode: CAPICOM_STORE_OPEN_MODE = CAPICOM_STORE_OPEN_MODE.CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED
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
