/**
 * Проверка доступности асинхронной функциональности.
 * @returns {boolean} .
 */
export function canAsync(): boolean {
  // !!window.Promise || !!Iterator
  return !!window.cadesplugin?.CreateObjectAsync;
}
