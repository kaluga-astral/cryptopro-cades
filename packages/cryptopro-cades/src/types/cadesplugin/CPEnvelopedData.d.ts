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
  Decrypt(envelopedMessage: string): WithOptionalPromise<void>;

  /**
   * Выполняет операцию шифрования.
   * @param encodingType Тип кодировки. Поддерживается только CAPICOM_ENCODING_TYPE.CAPICOM_ENCODE_BASE64
   */
  Encrypt(
    encodingType: CAPICOM_ENCODING_TYPE = CAPICOM_ENCODING_TYPE.CAPICOM_ENCODE_BASE64
  ): WithOptionalPromise<string>;

  /**
   * Данные которые надо установить (для шифрования) или результат после расшифровки.
   */
  Content: WithOptionalPromise<string>;

  /**
   * Алгоритм шифрования.
   */
  Algorithm: WithOptionalPromise<number>;

  /**
   * Коллекция сертификатов (получателей), для которых выполняется шифрование.
   */
  Recipients: WithOptionalPromise<IRecipients>;
};
