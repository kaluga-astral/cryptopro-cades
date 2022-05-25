import { CryptoError } from '../errors';
import { IStore } from '../types';
import {
  CAPICOM_MY_STORE,
  CAPICOM_STORE_OPEN_MODE,
  CRYPTO_OBJECTS,
  STORE_LOCATION,
} from '../constants';

import { createObject } from './createObject';
import { afterPluginLoaded } from './internal/afterPluginLoaded';

/**
 * Открывает хранилище с сертификатами.
 * @returns {IStore} store хранилище с сертификатами.
 * @param {STORE_LOCATION} storeLocation - расположение хранилища.
 * @param {string} storeName - (!)будет проигнорирован если storeLocation = CAPICOM_SMART_CARD_USER_STORE.
 * @param {CAPICOM_STORE_OPEN_MODE} openMode - режим открытия хранилища.
 * @returns {Promise<IStore>} .
 */
export function openStore(
  storeLocation: STORE_LOCATION = STORE_LOCATION.CAPICOM_CURRENT_USER_STORE,
  storeName: string = CAPICOM_MY_STORE,
  openMode: CAPICOM_STORE_OPEN_MODE = CAPICOM_STORE_OPEN_MODE.CAPICOM_STORE_OPEN_EXISTING_ONLY
): Promise<IStore> {
  return afterPluginLoaded(async () => {
    const store: IStore = await createObject(CRYPTO_OBJECTS.store);

    try {
      const res = store.Open(storeLocation, storeName, openMode);

      await res;
    } catch (err) {
      throw CryptoError.createCadesError(
        err,
        'Ошибка открытия хранилища сертификатов.'
      );
    }

    return store;
  })();
}