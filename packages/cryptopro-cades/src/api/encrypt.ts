import { Buffer } from 'buffer';

import { CryptoError } from '../errors';
import { CADESCOM_BASE64_TO_BINARY, CRYPTO_OBJECTS } from '../constants';
import { CPEnvelopedData } from '../types/cadesplugin/CPEnvelopedData';
import { ICertificate, IRecipients } from '../types';

import { createObject } from './createObject';
import { afterPluginLoaded } from './internal/afterPluginLoaded';
import { setCryptoProperty } from './internal/setCryptoProperty';

/**
 * Зашировать данные на указанные сертификаты.
 * @param {string} data -входные данные для расшифровки в формате Base64 или ArrayBuffer.
 * @param {ICertificate[]} recipientCertificates -список сертификатов получателей шифрованного сообщения.
 * @returns {Promise<string>} .Зашифрованная строка в кодировке Base64.
 */
export function encrypt(
  data: ArrayBuffer | string,
  recipientCertificates: ICertificate[]
): Promise<string> {
  return afterPluginLoaded(async () => {
    if (!data) {
      const errorMessage = 'Не указаны данные для шифрования.';
      throw CryptoError.create('CBP-7', errorMessage, null, errorMessage);
    }

    if (!recipientCertificates || recipientCertificates?.length === 0) {
      const errorMessage =
        'Не указаны сертификаты получателей шифрованного сообщения.';
      throw CryptoError.create('CBP-7', errorMessage, null, errorMessage);
    }

    const base64String =
      data instanceof ArrayBuffer ? Buffer.from(data).toString('base64') : data;

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
      setCryptoProperty(envelopedData, 'Content', base64String);
    } catch (err) {
      throw CryptoError.createCadesError(
        err,
        'Ошибка при заполнении параметров шифрования.'
      );
    }

    try {
      const recipients: IRecipients = await envelopedData.Recipients;

      for (const recipientCertificate of recipientCertificates) {
        await recipients.Add(recipientCertificate);
      }
    } catch (error) {
      throw CryptoError.createCadesError(
        error,
        'Ошибка при установке сертификатов получателей шифрованного сообщения.'
      );
    }

    try {
      // в криптопро браузер плагине не поддерживается подпись/расшифровка бинарных данных,
      // поэтому расшифровываем предварительно конвертированный в Base64
      return await envelopedData.Encrypt();
    } catch (error) {
      throw CryptoError.createCadesError(
        error,
        'Ошибка при шифровании данных.'
      );
    }
  })();
}
