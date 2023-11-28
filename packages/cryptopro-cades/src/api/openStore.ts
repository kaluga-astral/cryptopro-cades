import { CryptoError } from '../errors';
import type { IStore } from '../types';
import {
  CAPICOM_MY_STORE,
  CAPICOM_STORE_OPEN_MODE,
  CRYPTO_OBJECTS,
  STORE_LOCATION,
} from '../constants';

import { createObject } from './createObject';
import { afterPluginLoaded } from './internal/afterPluginLoaded';
import { unwrap } from './internal/unwrap';

/**
 * Открывает хранилище с сертификатами.
 * @returns {IStore} store хранилище с сертификатами.
 * @param {STORE_LOCATION} storeLocation - расположение хранилища.
 * @param {string} storeName - (!)будет проигнорирован если storeLocation = CAPICOM_SMART_CARD_USER_STORE.
 * @param {CAPICOM_STORE_OPEN_MODE} openMode - режим открытия хранилища.
 * @throws {CryptoError} в случае ошибки.
 * @returns {Promise<IStore>} .
 */
export function openStore(
  storeLocation: STORE_LOCATION = STORE_LOCATION.CAPICOM_CURRENT_USER_STORE,
  storeName: string = CAPICOM_MY_STORE,
  openMode: CAPICOM_STORE_OPEN_MODE = CAPICOM_STORE_OPEN_MODE.CAPICOM_STORE_OPEN_EXISTING_ONLY,
): Promise<IStore> {
  return afterPluginLoaded(async () => {
    let store: IStore = await createObject(CRYPTO_OBJECTS.store);

    try {
      await unwrap(store.Open(storeLocation, storeName, openMode));

      return store;
    } catch (err) {
      await unwrap(store?.Close());
      throw CryptoError.createCadesError(
        err,
        'Ошибка открытия хранилища сертификатов.',
      );
    }
  })();
}
