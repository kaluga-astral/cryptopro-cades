import {
  CRYPTO_PRO_CRYPTO_PROVIDER_TYPES,
  VIP_NET_CRYPTO_PROVIDER_TYPES,
} from '../../constants';
import { getCryptoProviders } from '../getCryptoProviders';
import { pluginConfig } from '../../PluginConfig';
import { CryptoError } from '../../errors';
import { getSystemInfo } from '../getSystemInfo';

const oldestSupportedCryptoProCSPVersion = 4;
const oldestSupportedVipnetCSPVersion = 4.4;

/**
 * В данный момент имеется версия не меньше указанной версия Крипто-Провайдера.
 * @throws {CryptoError} в случае ошибки.
 * @returns {boolean} true, если поддерживается.
 */
export const checkIsSupportedCSPVersion = async (): Promise<void> => {
  const systemInfo = await getSystemInfo();
  const cryptoProviders = await getCryptoProviders();

  let haveValidCryptoProCSPVersion = false;
  let haveValidVipNetCSPVersion = false;

  if (pluginConfig.checkCspVersionFunc) {
    for (const cryptoProvider of cryptoProviders) {
      if (
        pluginConfig.CheckCryptoProviders.find(
          (cp) =>
            cp.ProviderType === cryptoProvider.ProviderType &&
            cp.ProviderName === cryptoProvider.ProviderName,
        )
      ) {
        const errorMessage = pluginConfig.checkCspVersionFunc(cryptoProvider);

        if (errorMessage) {
          throw CryptoError.create(
            'CBP-4',
            'Не поддерживаемая версия CSP',
            null,
            errorMessage,
          );
        }
      }
    }
  } else {
    if (systemInfo.cryptoProInstalled) {
      const cryptoProCSP = cryptoProviders.find((cp) =>
        CRYPTO_PRO_CRYPTO_PROVIDER_TYPES.includes(cp.ProviderType),
      );

      if (
        cryptoProCSP?.MajorVersion &&
        cryptoProCSP?.MajorVersion >= oldestSupportedCryptoProCSPVersion
      ) {
        haveValidCryptoProCSPVersion = true;
      }
    }

    if (systemInfo.vipNetInstalled) {
      const vipNetCSP = cryptoProviders.find((cp) =>
        VIP_NET_CRYPTO_PROVIDER_TYPES.includes(cp.ProviderType),
      );

      if (vipNetCSP?.MajorVersion) {
        const version = parseFloat(
          vipNetCSP?.MajorVersion + '.' + vipNetCSP?.MinorVersion,
        );

        haveValidVipNetCSPVersion = version >= oldestSupportedVipnetCSPVersion;
      }
    }

    if (!(haveValidVipNetCSPVersion || haveValidCryptoProCSPVersion)) {
      throw CryptoError.create('CBP-4', 'Не поддерживаемая версия CSP', null);
    }
  }
};
