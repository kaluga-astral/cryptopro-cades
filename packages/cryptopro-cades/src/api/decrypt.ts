import { Buffer } from 'buffer';

import { CryptoError } from '../errors';
import { CADESCOM_BASE64_TO_BINARY, CRYPTO_OBJECTS } from '../constants';
import type { CPEnvelopedData } from '../types';
import { outputDebug } from '../utils';

import { createObject } from './createObject';
import { afterPluginLoaded } from './internal/afterPluginLoaded';
import { setCryptoProperty } from './internal/setCryptoProperty';
import { unwrap } from './internal/unwrap';

/**
 * Расшифровать данные.
 * @param {string} encryptedData - данные для расшифрования. Массив байт либо массив байт в формате Base64 строки.
 * @throws {CryptoError} в случае ошибки.
 * @returns {Promise<string>} .Расшифрованная строка в кодировке Base64.
 */
export function decrypt(encryptedData: ArrayBuffer | string): Promise<string> {
  return afterPluginLoaded(async () => {
    const logData = [];

    logData.push({ encryptedData });

    try {
      if (!encryptedData) {
        const errorMessage = 'Не указаны данные для расшифровки.';

        throw CryptoError.create('CBP-7', errorMessage, null, errorMessage);
      }

      const base64String =
        encryptedData instanceof ArrayBuffer
          ? Buffer.from(encryptedData).toString('base64')
          : encryptedData;

      logData.push({ base64String });

      const envelopedData: CPEnvelopedData = await createObject(
        CRYPTO_OBJECTS.envelopedData,
      );

      try {
        // в криптопро браузер плагине не поддерживается подпись/расшифровка бинарных данных,
        // поэтому подписываем предварительно конвертированный в Base64
        await setCryptoProperty(
          envelopedData,
          'ContentEncoding',
          CADESCOM_BASE64_TO_BINARY,
        );
      } catch (err) {
        throw CryptoError.createCadesError(
          err,
          'Ошибка при заполнении параметров расшифровки.',
        );
      }

      try {
        // в криптопро браузер плагине не поддерживается подпись/расшифровка бинарных данных,
        // поэтому расшифровываем предварительно конвертированный в Base64
        await unwrap(envelopedData.Decrypt(base64String));

        const decryptedData = await unwrap(envelopedData.Content);

        logData.push({ decryptedData });

        return decryptedData;
      } catch (err) {
        throw CryptoError.createCadesError(
          err,
          'Ошибка при расшифровке данных.',
        );
      }
    } catch (error) {
      logData.push({ error });
      throw error;
    } finally {
      outputDebug('decrypt >>', logData);
    }
  })();
}
