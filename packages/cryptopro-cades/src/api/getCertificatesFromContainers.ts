import { CRYPTO_OBJECTS, DEFAULT_CRYPTO_PROVIDER } from '../constants';
import { Certificate } from '../Certificate';
import type { CCspInformation, CPContainers, ICertificate } from '../types';
import { outputDebug } from '../utils';
import { CryptoError } from '../errors';

import { afterPluginLoaded } from './internal/afterPluginLoaded';
import { unwrap } from './internal/unwrap';
import { getSystemInfo } from './getSystemInfo';
import { createObject } from './createObject';

/**
 * Кэш из запрошенных сертификатов.
 */
const certificates2Cache = {};

/**
 * Возвращает список валидных доступных для работы сертификатов по контейнерам.
 *
 * @param {resetCache} resetCache перезапросить данные, игнорируя закэшированные данные.
 * @throws {CryptoError} в случае ошибки.
 * @returns {Promise<Certificate[]>} .сертификаты.
 */
export function getCertificatesFromContainers(
  resetCache: boolean = false,
): Promise<Certificate[]> {
  if (certificates2Cache[0] && !resetCache) {
    return Promise.resolve(certificates2Cache[0]);
  }

  return afterPluginLoaded(async () => {
    if (certificates2Cache[0] && !resetCache) {
      return Promise.resolve(certificates2Cache[0]);
    }

    // Получить список контейнеров можно только с помощью КриптоПро CSP
    const systemInfo = await getSystemInfo();

    if (!systemInfo.cryptoProInstalled) {
      throw CryptoError.create(
        'CBP-13',
        'Ошибка при получении списка доступных контейнеров.',
        null,
      );
    }

    const logData = [];
    let result: Certificate[] = [];

    try {
      const cspInformation: CCspInformation = await createObject(
        CRYPTO_OBJECTS.cspInformation,
      );

      await cspInformation.InitializeFromName(
        DEFAULT_CRYPTO_PROVIDER.Default.ProviderName,
      );

      const containers: CPContainers = await unwrap(
        cspInformation.EnumContainers(),
      );
      const containersCount = await unwrap(containers.Count);

      for (let i = 0; i < containersCount; i++) {
        const container = await unwrap(containers.ItemByIndex(i));

        const containerKeys = await unwrap(container.Keys);
        const containerKeysCount = await unwrap(containerKeys.Count);

        for (let k = 0; k < containerKeysCount; k++) {
          const containerKey = await unwrap(containerKeys.ItemByIndex(k));

          const hasCertificate = await unwrap(containerKey.HasCertificate);

          if (hasCertificate) {
            const certBin: ICertificate = await unwrap(
              containerKey.Certificate,
            );

            const cert: Certificate = await Certificate.CreateFrom(
              certBin,
              false,
            );

            // работаем только с гостовскими сертами
            if (cert.isGost) {
              result.push(cert);
            }
          }
        }
      }

      return (certificates2Cache[0] = result);
    } catch (error) {
      logData.push({ error });
      throw CryptoError.createCadesError(
        error,
        'Ошибка при получении списка доступных контейнеров.',
      );
    } finally {
      logData.push({ result });
      outputDebug('enumContainers >>', logData);
    }
  })();
}
