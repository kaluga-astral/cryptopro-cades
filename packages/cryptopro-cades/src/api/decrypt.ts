import { Buffer } from 'buffer';

import { CryptoError } from '../errors';
import { CADESCOM_BASE64_TO_BINARY, CRYPTO_OBJECTS } from '../constants';
import { CPEnvelopedData } from '../types/cadesplugin/CPEnvelopedData';

import { createObject } from './createObject';
import { afterPluginLoaded } from './internal/afterPluginLoaded';
import { setCryptoProperty } from './internal/setCryptoProperty';

/**
 * Расшифровать данные.
 * @param {string} encryptedData -входные данные для расшифровки в формате Base64 или ArrayBuffer.
 * @returns {Promise<string>} .Расшифрованная строка в кодировке Base64.
 */
export function decrypt(encryptedData: ArrayBuffer | string): Promise<string> {
  return afterPluginLoaded(async () => {
    if (!encryptedData) {
      const errorMessage = 'Не указаны данные для расшифровки.';
      throw CryptoError.create('CBP-7', errorMessage, null, errorMessage);
    }

    const base64String =
      encryptedData instanceof ArrayBuffer
        ? Buffer.from(encryptedData).toString('base64')
        : encryptedData;

    const envelopedData: CPEnvelopedData = await createObject(
      CRYPTO_OBJECTS.envelopedData
    );
    try {
      // в криптопро браузер плагине не поддерживается подпись/расшифровка бинарных данных,
      // поэтому подписываем предварительно конвертированный в Base64
      setCryptoProperty(
        envelopedData,
        'ContentEncoding',
        CADESCOM_BASE64_TO_BINARY
      );
    } catch (err) {
      throw CryptoError.createCadesError(
        err,
        'Ошибка при заполнении параметров расшифровки.'
      );
    }

    try {
      // в криптопро браузер плагине не поддерживается подпись/расшифровка бинарных данных,
      // поэтому расшифровываем предварительно конвертированный в Base64
      await envelopedData.Decrypt(base64String);
      return await envelopedData.Content;
    } catch (err) {
      throw CryptoError.createCadesError(err, 'Ошибка при расшифровке данных.');
    }
  })();
}
