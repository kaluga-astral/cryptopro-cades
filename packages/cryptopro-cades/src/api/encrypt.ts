import { Buffer } from 'buffer';

import { CryptoError } from '../errors';
import {
  CADESCOM_BASE64_TO_BINARY,
  CAPICOM_ENCODING_TYPE,
  CRYPTO_OBJECTS,
} from '../constants';
import type { CPEnvelopedData, ICertificate, IRecipients } from '../types';
import { outputDebug } from '../utils';

import { createObject } from './createObject';
import { afterPluginLoaded } from './internal/afterPluginLoaded';
import { setCryptoProperty } from './internal/setCryptoProperty';
import { unwrap } from './internal/unwrap';

/**
 * Зашировать данные на указанные сертификаты.
 * @param {string} data - данные для шифрования. Массив байт либо массив байт в формате Base64 строки.
 * @param {ICertificate[]} recipientCertificates -список сертификатов получателей шифрованного сообщения.
 * @throws {CryptoError} в случае ошибки.
 * @returns {Promise<string>} .Зашифрованная строка в кодировке Base64.
 */
export function encrypt(
  data: ArrayBuffer | string,
  recipientCertificates: ICertificate[],
): Promise<string> {
  return afterPluginLoaded(async () => {
    const logData = [];

    logData.push({ data, recipientCertificates });

    try {
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
        data instanceof ArrayBuffer
          ? Buffer.from(data).toString('base64')
          : data;

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

        await setCryptoProperty(envelopedData, 'Content', base64String);
      } catch (err) {
        throw CryptoError.createCadesError(
          err,
          'Ошибка при заполнении параметров шифрования.',
        );
      }

      try {
        const recipients: IRecipients = await unwrap(envelopedData.Recipients);

        for (const recipientCertificate of recipientCertificates) {
          await unwrap(recipients.Add(recipientCertificate));
        }
      } catch (error) {
        throw CryptoError.createCadesError(
          error,
          'Ошибка при установке сертификатов получателей шифрованного сообщения.',
        );
      }

      try {
        // в криптопро браузер плагине не поддерживается подпись/расшифровка бинарных данных,
        // поэтому расшифровываем предварительно конвертированный в Base64

        const encryptResult = await unwrap(
          envelopedData.Encrypt(CAPICOM_ENCODING_TYPE.CAPICOM_ENCODE_BASE64),
        );

        logData.push({ encryptResult });

        return encryptResult;
      } catch (error) {
        throw CryptoError.createCadesError(
          error,
          'Ошибка при шифровании данных.',
        );
      }
    } catch (error) {
      logData.push({ error });
      throw error;
    } finally {
      outputDebug('encrypt >>', logData);
    }
  })();
}
