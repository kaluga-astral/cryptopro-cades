import { CRYPTO_OBJECTS } from '../constants';
import type { IAbout, ICryptoProvider, IVersion } from '../types';
import { outputDebug } from '../utils';
import pluginConfig from '../PluginConfig';

import { afterPluginLoaded } from './internal/afterPluginLoaded';
import { createObject } from './createObject';
import { unwrap } from './internal/unwrap';

/**
 * Кэш из запрошенных сертификатов.
 */
let cryptoProvidersCache: ICryptoProvider[] | null;

/**
 * Получить список криптопровайдеров.
 * @throws {CryptoError} в случае ошибки.
 * @returns {Promise<ICryptoProvider[]>} Bнформация о типе, наименовании и версии криптопровайдеров.
 */
export function getCryptoProviders(
  resetCache: boolean = false,
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
      for (const {
        ProviderType,
        ProviderName,
      } of pluginConfig.CheckCryptoProviders) {
        try {
          const cadesAbout: IAbout = await createObject(CRYPTO_OBJECTS.about);
          const cspVersion: IVersion = await unwrap(
            cadesAbout.CSPVersion(ProviderName, ProviderType),
          );

          availableCryptoProviders.push({
            ProviderName: ProviderName,
            ProviderType: ProviderType,
            BuildVersion: await unwrap(cspVersion.BuildVersion),
            MajorVersion: await unwrap(cspVersion.MajorVersion),
            MinorVersion: await unwrap(cspVersion.MinorVersion),
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
