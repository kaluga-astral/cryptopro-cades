/**
 * Описывает версию.
 * @see https://docs.cryptopro.ru/cades/reference/cadescom/cadescom_interface/iversion
 */
export interface IVersion {
  /**
   * Возвращает старший компонент версии.
   */
  MajorVersion: WithPromise<number>;

  /**
   * Возвращает младший компонент версии.
   */
  MinorVersion: WithPromise<number>;

  /**
   * Возвращает номер сборки.
   */
  BuildVersion: WithPromise<number>;

  /**
   * Возвращает строковое представление версии.
   */
  toString(): WithPromise<string>;
}
