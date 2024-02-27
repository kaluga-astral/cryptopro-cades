import type { WithOptionalPromise } from '../WithOptionalPromise';

/**
 * Объект, содержащий информацию о режимах работы доступного считывателя.
 * @see https://docs.cryptopro.ru/cades/reference/cadescom/cadescom_class/creadermode
 */
export type CReaderMode = {
  /**
   * Возвращает имя для данного режима работы считывателя, с порядковым номером
   * @example HDIMAGE
   * @example Aktiv Rutoken lite
   * @example Aktiv Rutoken lite 01 – если вставлен еще один токен
   */
  Name: WithOptionalPromise<string>;

  /**
   * Возвращает никнейм для данного режима работы считывателя, не уникальное значение
   * @example HDD key storage
   * @example Rutoken lite
   * @example Rutoken ECP
   */
  NickName: WithOptionalPromise<string>;

  /**
   * Возвращает медиа для данного режима работы считывателя, уникальное значение для токенов
   * @example NO_UNIQUE, NO_MEDIA – для диска или облака
   * @example pkcs11_rutoken_ecp_435461fa
   * @example rutoken_lt_40a6544f
   */
  Media: WithOptionalPromise<string>;

  /**
   * Возвращает результат побитового сложения флагов для данного режима работы считывателя
   */
  CarrierFlags: WithOptionalPromise<number>;
};
