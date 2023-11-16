import type { WithOptionalPromise } from '../WithOptionalPromise';

/**
 * Описывает версию.
 * @see https://docs.cryptopro.ru/cades/reference/cadescom/cadescom_interface/iversion
 */
export interface IVersion {
  /**
   * Возвращает старший компонент версии.
   */
  MajorVersion: WithOptionalPromise<number>;

  /**
   * Возвращает младший компонент версии.
   */
  MinorVersion: WithOptionalPromise<number>;

  /**
   * Возвращает номер сборки.
   */
  BuildVersion: WithOptionalPromise<number>;

  /**
   * Возвращает строковое представление версии.
   */
  toString(): WithOptionalPromise<string>;
}
