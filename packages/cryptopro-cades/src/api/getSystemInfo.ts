import { CryptoError } from '../errors';
import {
  CRYPTO_OBJECTS,
  CRYPTO_PRO_CRYPTO_PROVIDER_TYPES,
  DEFAULT_CRYPTO_PROVIDER,
  VIP_NET_CRYPTO_PROVIDER_TYPES,
} from '../constants';
import { outputDebug } from '../utils';
import type { IAbout, ISystemInfo } from '../types';

import { afterPluginLoaded } from './internal/afterPluginLoaded';
import { createObject } from './createObject';
import { getCryptoProviders } from './getCryptoProviders';
import { unwrap } from './internal/unwrap';

/**
 * Кэш информации о системе.
 */
let systemInfoCache: ISystemInfo | null = null;

/**
 * Предоставляет информацию о системе.
 *
 * @returns информацию о CSP и плагине.
 */
export const getSystemInfo = (): Promise<ISystemInfo> => {
  if (systemInfoCache) {
    return Promise.resolve(systemInfoCache);
  }

  return afterPluginLoaded(async () => {
    if (systemInfoCache) {
      return Promise.resolve(systemInfoCache);
    }

    const sysInfo: ISystemInfo = {
      cadesVersion: '',
      cspVersion: null,
      cryptoProInstalled: false,
      vipNetInstalled: false,
      cryptoProviderName: null,
    };
    const logData = [];

    try {
      const cadesAbout: IAbout = await createObject(CRYPTO_OBJECTS.about);

      for (const cryptoProvider of await getCryptoProviders()) {
        if (
          VIP_NET_CRYPTO_PROVIDER_TYPES.includes(cryptoProvider.ProviderType)
        ) {
          sysInfo.vipNetInstalled = true;

          sysInfo.cryptoProviderName =
            DEFAULT_CRYPTO_PROVIDER.Fallback.ProviderName;

          sysInfo.cspVersion =
            cryptoProvider.MajorVersion + '.' + cryptoProvider.MinorVersion;
        }

        if (
          CRYPTO_PRO_CRYPTO_PROVIDER_TYPES.includes(cryptoProvider.ProviderType)
        ) {
          sysInfo.cryptoProInstalled = true;

          sysInfo.cryptoProviderName =
            DEFAULT_CRYPTO_PROVIDER.Default.ProviderName;

          sysInfo.cspVersion =
            cryptoProvider.MajorVersion +
            '.' +
            cryptoProvider.MinorVersion +
            '.' +
            cryptoProvider.BuildVersion;
        }
      }

      try {
        const pluginVersion = await unwrap(cadesAbout.PluginVersion);

        if (pluginVersion) {
          sysInfo.cadesVersion = await unwrap(pluginVersion.toString());
        }

        if (!sysInfo.cadesVersion) {
          sysInfo.cadesVersion = await unwrap(cadesAbout.Version);
        }
      } catch (error) {
        throw CryptoError.createCadesError(
          error,
          'Ошибка при получении информации о системе',
        );
      }

      return (systemInfoCache = sysInfo);
    } catch (error) {
      logData.push({ error });
      throw error;
    } finally {
      logData.push({ sysInfo });
      outputDebug('getSystemInfo >>', logData);
    }
  })();
};
