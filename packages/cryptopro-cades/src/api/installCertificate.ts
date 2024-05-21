import {
  CADESCOM_InstallResponseRestrictionFlags,
  CRYPTO_OBJECTS,
  X509CertificateEnrollmentContext,
  XCN_CRYPT_STRING_BASE64_ANY,
} from '../constants';
import { CryptoError } from '../errors';
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

      await enroll
        .InstallResponse(
          CADESCOM_InstallResponseRestrictionFlags.CADESCOM_AllowUntrustedRoot,
          certificate,
          XCN_CRYPT_STRING_BASE64_ANY,
          pin ?? '',
        )
        .catch(async () => {
          // Попробовать установить сертификат еще раз, только с флагом CADESCOM_UseContainerStore.
          // Он необходим, чтобы плагин не выбрасывал странную ошибку при повторной установке сертификата через КриптоПро CSP.
          // VipNet CSP не может установить сертификат, если используется этот флаг.

          await enroll.InstallResponse(
            CADESCOM_InstallResponseRestrictionFlags.CADESCOM_AllowUntrustedRoot |
              CADESCOM_InstallResponseRestrictionFlags.CADESCOM_UseContainerStore,
            certificate,
            XCN_CRYPT_STRING_BASE64_ANY,
            pin ?? '',
          );
        });

      logData.push('Сертификат установлен');

      return;
    } catch (error) {
      logData.push({ error });

      throw CryptoError.createCadesError(
        error,
        'Ошибка при установке сертификата.',
      );
    } finally {
      outputDebug('installCertificate >>', logData);
    }
  })();
};
