import { CAPICOM_ENCODING_TYPE } from '../../constants';

import { IRecipients } from './IRecipients';

/**
 * EnvelopedData - зашифрованное сообщение.
 * @see https://docs.cryptopro.ru/cades/reference/cadescom/cadescom_class/cpenvelopeddata
 * Создается через CAdESCOM.CPEnvelopedData
 */
export declare type CPEnvelopedData = {
  /**
   * Выполняет операцию расшифрования.
   * @param envelopedMessage зашифрованное сообщение в Base64.
   */
  Decrypt(envelopedMessage: string): WithPromise<void>;

  /**
   * Выполняет операцию шифрования.
   * @param encodingType Тип кодировки. Поддерживается только CAPICOM_ENCODING_TYPE.CAPICOM_ENCODE_BASE64
   */
  Encrypt(
    encodingType: CAPICOM_ENCODING_TYPE = CAPICOM_ENCODING_TYPE.CAPICOM_ENCODE_BASE64
  ): WithPromise<string>;

  /**
   * Данные которые надо установить (для шифрования) или результат после расшифровки.
   */
  Content: WithPromise<string>;

  /**
   * Алгоритм шифрования.
   */
  Algorithm: WithPromise<number>;

  /**
   * Коллекция сертификатов (получателей), для которых выполняется шифрование.
   */
  Recipients: WithPromise<IRecipients>;
};
