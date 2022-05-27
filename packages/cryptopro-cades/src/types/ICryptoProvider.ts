/**
 * Информация о криптопровайдере.
 */
export interface ICryptoProvider {
  /**
   * Наименование криптопровайдера.
   */
  readonly ProviderName: string;

  /**
   * Тип криптопровайдера.
   */
  readonly ProviderType: number;

  /**
   * Мажорная версия криптопровайдера.
   */
  readonly MajorVersion?: number;

  /**
   * Минорная версия криптопровайдера.
   */
  readonly MinorVersion?: number;

  /**
   * Версия сборки.
   */
  readonly BuildVersion?: number;
}
