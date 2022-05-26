/**
 * Проверка доступности асинхронной функциональности.
 * @returns {boolean} true, если нужно выполнять асинхронно.
 */
export function canAsync(): boolean {
  // !!window.Promise || !!Iterator
  return !!window.cadesplugin?.CreateObjectAsync;
}
