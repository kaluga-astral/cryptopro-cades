/**
 * Информация о CSP и плагине.
 */
export class SystemInfo {
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

  /**
   * Отдает строковое представление объекта.
   * @returns строковое представление объекта.
   */
  toString(): string {
    return `CADES: ${this.cadesVersion}, CSP: ${this.cryptoProviderName} ${this.cspVersion}. CryptoPro Installed: ${this.cryptoProInstalled}, VipNet Installed: ${this.vipNetInstalled}.`;
  }
}
