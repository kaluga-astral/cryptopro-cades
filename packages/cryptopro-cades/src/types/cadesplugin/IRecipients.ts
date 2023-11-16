import type { WithOptionalPromise } from '../WithOptionalPromise';

import type { ICertificate } from './ICertificate';

/**
 * Описывает коллекцию сертификатов для шифрования.
 * @see https://docs.cryptopro.ru/cades/reference/cadescom/cadescom_class/recipients
 */
export interface IRecipients {
  /**
   * Добавить сертификат в список получателей зашифрованного сообщения.
   * @param certificate Сертификат получателя.
   */
  Add(certificate: ICertificate): WithOptionalPromise<void>;
  /**
   * Очистить список сертификатов.
   */
  Clear(): WithOptionalPromise<void>;
  /**
   * Удалить сертификат из списка получателей по индексу.
   * @param index Индекс.
   */
  Remove(index: number): WithOptionalPromise<void>;
}
