import { ICertificate } from './ICertificate';
/**
 * Описывает коллекцию сертификатов для шифрования.
 * @see https://docs.cryptopro.ru/cades/reference/cadescom/cadescom_class/recipients
 */
export interface IRecipients {
  /**
   * Добавить сертификат в список получателей зашифрованного сообщения.
   * @param certificate Сертификат получателя.
   */
  Add(certificate: ICertificate): WithPromise<void>;
  /**
   * Очистить список сертификатов.
   */
  Clear(): WithPromise<void>;
  /**
   * Удалить сертификат из списка получателей по индексу.
   * @param index Индекс.
   */
  Remove(index: number): WithPromise<void>;
}
