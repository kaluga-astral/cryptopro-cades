import { CRYPTO_OBJECTS, CRYPTO_PROVIDERS } from '../constants';
import { IAbout } from '../types';
import { ICryptoProvider } from '../types/ICryptoProvider';
import { IVersion } from '../types/cadesplugin/IVersion';
import { outputDebug } from '../utils';

import { afterPluginLoaded } from './internal/afterPluginLoaded';
import { createObject } from './createObject';

/**
 * Кэш из запрошенных сертификатов.
 */
let cryptoProvidersCache: ICryptoProvider[] | null;

/**
 * Получить список криптопровайдеров.
 * @returns {Promise<ICryptoProvider[]>} информация о типе, наименовании и версии криптопровайдеров
 */
export function getCryptoProviders(
  resetCache: boolean = false
): Promise<ICryptoProvider[]> {
  if (cryptoProvidersCache && !resetCache) {
    return Promise.resolve(cryptoProvidersCache);
  }

  return afterPluginLoaded(async () => {
    if (cryptoProvidersCache && !resetCache) {
      return Promise.resolve(cryptoProvidersCache);
    }
    const availableCryptoProviders: ICryptoProvider[] = [];
    const logData = [];
    try {
      for (const { ProviderType, ProviderName } of CRYPTO_PROVIDERS) {
        try {
          const cadesAbout: IAbout = await createObject(CRYPTO_OBJECTS.about);
          const cspVersion: IVersion = await cadesAbout.CSPVersion(
            ProviderName,
            ProviderType
          );
          availableCryptoProviders.push({
            ProviderName: ProviderName,
            ProviderType: ProviderType,
            BuildVersion: await cspVersion.BuildVersion,
            MajorVersion: await cspVersion.MajorVersion,
            MinorVersion: await cspVersion.MinorVersion,
          });
        } catch (error) {
          logData.push({
            errorMessage: `Ошибка получения информации о криптопровайдере ${ProviderName} с типом ${ProviderType}.`,
            error,
          });
        }
      }
      return (cryptoProvidersCache = availableCryptoProviders);
    } catch (error) {
      logData.push({ error });
      throw error;
    } finally {
      logData.push({ availableCryptoProviders });
      outputDebug('getCryptoProviders >>', logData);
    }
  })();
}
