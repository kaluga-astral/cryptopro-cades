/**
 * Информация о CSP и плагине.
 */
export interface ISystemInfo {
  /**
   * Версия КриптоПро ЭЦП Browser plug-in.
   */
  cadesVersion: string;

  /**
   * Версия криптопровайдера.
   */
  cspVersion: string | null;

  /**
   * Установлен ли криптопровайдер КриптоПРО?
   */
  cryptoProInstalled: boolean;

  /**
   * Установлен ли криптопровайдер VipNet?
   */
  vipNetInstalled: boolean;

  /**
   * Наименование криптопровайдера.
   */
  cryptoProviderName: string | null;
}
