import { Buffer } from 'buffer';

import { CryptoError } from '../errors';
import {
  CADESCOM_BASE64_TO_BINARY,
  CADESCOM_CADES_TYPE,
  CAPICOM_CERTIFICATE_INCLUDE_OPTION,
  CRYPTO_OBJECTS,
} from '../constants';
import type { CPSigner, CadesSignedData, ICertificate } from '../types';
import { Certificate } from '../Certificate';
import { outputDebug } from '../utils';

import { afterPluginLoaded } from './internal/afterPluginLoaded';
import { createObject } from './createObject';
import { setCryptoProperty } from './internal/setCryptoProperty';
import { validateCertificate } from './validateCertificate';
import { unwrap } from './internal/unwrap';

/**
 * Подписать входные данные указанным сертификатом в формате CMS.
 * @param {ICertificate | Certificate} certificate -сертификат пользователя.
 * @param {ArrayBuffer | string} data - данные для подписания. Массив байт либо массив байт в формате Base64 строки.
 * @param {boolean} [detach=true] присоединять подпись к данным или отдельно?
 * @param {boolean} [includeCertChain=true] - включать в результат всю цепочку сертификатов.
 * @param {boolean} [doNotValidate=false] - не проводить валидацию сертификатов.
 * @throws {CryptoError} в случае ошибки.
 * @returns файл подписи в кодировке Base64.
 */
export function sign(
  certificate: ICertificate | Certificate,
  data: ArrayBuffer | string,
  detach: boolean = true,
  includeCertChain: boolean = true,
  doNotValidate: boolean = false,
): Promise<string> {
  return afterPluginLoaded(async () => {
    const logData = [];

    logData.push({
      certificate,
      data,
      detach,
      includeCertChain,
      doNotValidate,
    });

    try {
      if (!data) {
        const errorMessage = 'Не указаны данные для подписания.';

        throw CryptoError.create('CBP-7', errorMessage, null, errorMessage);
      }

      if (!certificate) {
        const errorMessage =
          'Не указан сертификат для вычисления электронной подписи.';

        throw CryptoError.create('CBP-7', errorMessage, null, errorMessage);
      }

      const base64String =
        data instanceof ArrayBuffer
          ? Buffer.from(data).toString('base64')
          : data;

      logData.push({ base64String });

      let cert: ICertificate | null = null;

      if (certificate instanceof Certificate) {
        cert = certificate?.certificateBin;
      } else {
        cert = certificate;
      }

      if (!doNotValidate && !!cert) {
        const errorMessage = await validateCertificate(cert);

        if (errorMessage) {
          throw CryptoError.create(
            'CBP-6',
            'Сертификат не прошел проверку при подписи.',
            null,
            errorMessage,
          );
        }
      }

      const signer: CPSigner = await createObject(CRYPTO_OBJECTS.signer);
      const signedData: CadesSignedData = await createObject(
        CRYPTO_OBJECTS.signedData,
      );

      // заполнение параметров для подписи
      try {
        await setCryptoProperty(signer, 'Certificate', cert);

        if (includeCertChain) {
          await setCryptoProperty(
            signer,
            'Options',
            CAPICOM_CERTIFICATE_INCLUDE_OPTION.CAPICOM_CERTIFICATE_INCLUDE_WHOLE_CHAIN,
          );
        }

        await setCryptoProperty(
          signedData,
          'ContentEncoding',
          CADESCOM_BASE64_TO_BINARY,
        );

        // в криптопро браузер плагине не поддерживается подпись/расшифровка бинарных данных,
        // поэтому подписываем предварительно конвертированный в Base64
        await setCryptoProperty(signedData, 'Content', base64String);
      } catch (error) {
        throw CryptoError.createCadesError(
          error,
          'Ошибка при заполнении параметров подписания.',
        );
      }

      try {
        const signResult = await unwrap(
          signedData.SignCades(
            signer,
            CADESCOM_CADES_TYPE.CADESCOM_CADES_BES,
            detach,
          ),
        );

        logData.push({ signResult });

        return signResult;
      } catch (error) {
        throw CryptoError.createCadesError(
          error,
          'Ошибка при вычислении электронной подписи.',
        );
      }
    } catch (error) {
      logData.push({ error });
      throw error;
    } finally {
      outputDebug('sign >>', logData);
    }
  })();
}
