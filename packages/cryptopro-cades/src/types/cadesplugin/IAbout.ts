import type { CADESCOM_MEDIA_TYPE } from '../../constants';
import type { WithOptionalPromise } from '../WithOptionalPromise';

import type { IVersion } from './IVersion';

/**
 * Описывает текущую версию библиотеки CAdESCOM Plugin.
 * И предоставляет дополнительную функциональность по работе с Медианосителями.
 * @see https://docs.cryptopro.ru/cades/reference/cadescom/cadescom_class/about
 */
export interface IAbout {
  /**
   * Возвращает объект IVersion c версией плагина.
   */
  PluginVersion: WithOptionalPromise<IVersion>;

  /**
   * Возвращает строковое представление версии.
   */
  Version: WithOptionalPromise<string>;

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
   * Устанавливает разрешенные виды медиа (PP_MEDIA_TYPE).
   * @method MediaFilter
   * @param MediaType - Флаг,
   *       указывающий разрешенные виды медиа.
   *       Может принимать значение
   *       @see http://cpdn.cryptopro.ru/content/cades/plugin-methods.html Список методов и свойств обьекта cadesplugin
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  MediaFilter(MediaType: CADESCOM_MEDIA_TYPE): WithOptionalPromise<any>;

  /**
   * Устанавливает разрешенные виды носителей и разрешенные операции для
   *  запрещенных носителей (PP_CARRIER_TYPES).
   * @method ReaderFilter
   * @param {LONG} EnabledTypes - [in] Флаг, указывающий разрешенные виды носителей.
   *       Может принимать значение ENABLE_CARRIER_TYPE_CSP, ENABLE_CARRIER_TYPE_FKC_NO_SM, ENABLE_CARRIER_TYPE_FKC_SM,
   *       ENABLE_ANY_CARRIER_TYPE
   *       @see http://cpdn.cryptopro.ru/content/cades/plugin-methods.html Список методов и свойств обьекта cadesplugin
   * @param {LONG} EnabledOperations - [in] Флаг, указывающий разрешенные операции для запрещенных носителей.
   *       Может принимать значение DISABLE_EVERY_CARRIER_OPERATION, ENABLE_CARRIER_OPEN_ENUM, ENABLE_CARRIER_CREATE,
   *       ENABLE_ANY_OPERATION
   *       @see http://cpdn.cryptopro.ru/content/cades/plugin-methods.html Список методов и свойств обьекта cadesplugin
   * @param {BSTR} [strFilterRegexp] - [in, optional] Регулярное выражение для фильтрования разрешенных носителей.
   *       Все носители, не подходящие под данное выражение, будут недоступны.
   */
  ReaderFilter(
    EnabledTypes: number,
    EnabledOperations: number,
    strFilterRegexp: string,
  ): WithOptionalPromise<void>;

  /**
   * Возвращает объект IVersion c версией криптопровайдера (CSP) производства компании Крипто-Про.
   */
  CSPVersion(
    providerName?: string,
    providerType?: number,
  ): WithOptionalPromise<IVersion>;

  /**
   * Возвращает наименование криптопровайдера (CSP).
   */
  CSPName(): WithOptionalPromise<string>;
}
