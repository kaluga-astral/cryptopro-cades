import { CRYPTO_OBJECTS, DEFAULT_CRYPTO_PROVIDER } from '../constants';
import { CryptoError } from '../errors';
import {
  type CCspInformation,
  type CReaderModes,
  type IReaderMode,
} from '../types';
import { outputDebug } from '../utils';

import { createObject } from './createObject';
import { getSystemInfo } from './getSystemInfo';
import { afterPluginLoaded } from './internal/afterPluginLoaded';
import { unwrap } from './internal/unwrap';

/**
 * Кэш из доступных считывателей.
 */
let readersCache: IReaderMode[] | null;

/**
 * Получить список доступных считывателей (в т.ч. вставленных токенов) с помощью CryptoPro CSP.
 * @throws {CryptoError} в случае ошибки.
 * @returns {Promise<IReaderMode[]>} Информация о доступных считывателях.
 */
export function getReaders(
  resetCache: boolean = false,
): Promise<IReaderMode[]> {
  if (readersCache && !resetCache) {
    return Promise.resolve(readersCache);
  }

  return afterPluginLoaded(async () => {
    if (readersCache && !resetCache) {
      return Promise.resolve(readersCache);
    }

    // Получить список считывателей можно только с помощью КриптоПро CSP
    const systemInfo = await getSystemInfo();

    if (!systemInfo.cryptoProInstalled) {
      throw CryptoError.create(
        'CBP-12',
        'Ошибка при получении списка доступных считывателей.',
        null,
      );
    }

    const logData = [];
    const readers: IReaderMode[] = [];

    try {
      const cspInformation: CCspInformation = await createObject(
        CRYPTO_OBJECTS.cspInformation,
      );

      await cspInformation.InitializeFromName(
        DEFAULT_CRYPTO_PROVIDER.Default.ProviderName,
      );

      const readerModes: CReaderModes = await unwrap(
        cspInformation.GetReaderModes(),
      );
      const readersCount = await unwrap(readerModes.Count);

      for (let i = 0; i < readersCount; i++) {
        const reader = await unwrap(readerModes.ItemByIndex(i));

        readers.push({
          Name: await unwrap(reader.Name),
          NickName: await unwrap(reader.NickName),
          CarrierFlags: await unwrap(reader.CarrierFlags),
          Media: await unwrap(reader.Media),
        });
      }

      return (readersCache = readers);
    } catch (error) {
      logData.push({ error });
      throw CryptoError.createCadesError(
        error,
        'Ошибка при получении списка доступных считывателей.',
      );
    } finally {
      logData.push({ readers });
      outputDebug('getReaders >>', logData);
    }
  })();
}
