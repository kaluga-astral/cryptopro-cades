import {
  CADESCOM_InstallResponseRestrictionFlags,
  CRYPTO_OBJECTS,
  X509CertificateEnrollmentContext,
  XCN_CRYPT_STRING_BASE64_ANY,
} from '../constants';
import { outputDebug } from '../utils';

import { createObject } from './createObject';
import { afterPluginLoaded } from './internal/afterPluginLoaded';

/**
 * Устанавливает цепочку сертификатов в хранилище
 * @param {string} certificate ответ УЦ в DER кодировке
 * @param {string | undefined} pin ПИН-код от контейнера. Если не указан, отобразится нативное окно ввода криптопровайдера.
 * @returns {Promise<void>}
 */
export const installCertificate = (
  certificate: string,
  pin?: string,
): Promise<void> => {
  return afterPluginLoaded(async () => {
    const logData = [];

    try {
      const enroll = await createObject(CRYPTO_OBJECTS.enrollment);

      await enroll.Initialize(X509CertificateEnrollmentContext.ContextUser);

      await enroll.InstallResponse(
        CADESCOM_InstallResponseRestrictionFlags.CADESCOM_AllowUntrustedRoot |
          CADESCOM_InstallResponseRestrictionFlags.CADESCOM_UseContainerStore,
        certificate,
        XCN_CRYPT_STRING_BASE64_ANY,
        pin ?? '',
      );

      logData.push('Сертификат установлен');

      return;
    } catch (error) {
      logData.push({ error });

      throw error;
    } finally {
      outputDebug('installCertificate >>', logData);
    }
  })();
};
