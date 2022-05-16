import { CryptoError } from '../errors';
import { CRYPTO_OBJECTS, CRYPTO_PROVIDERS } from '../constants';
import { IAbout } from '../types';
import { ICryptoProvider } from '../types/ICryptoProvider';
import { IVersion } from '../types/cadesplugin/IVersion';

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
  return afterPluginLoaded(async () => {
    if (cryptoProvidersCache && !resetCache) {
      return cryptoProvidersCache;
    }

    const availableCryptoProviders: ICryptoProvider[] = [];

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
        // ошибка не критичная, достаточно просто создать (и залогировать)
        CryptoError.createCadesError(
          error,
          `Ошибка получения информации о криптопровайдере с типом ${ProviderType}`
        );
      }
    }

    return (cryptoProvidersCache = availableCryptoProviders);
  })();
}
