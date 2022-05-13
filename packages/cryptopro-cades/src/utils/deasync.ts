import { canAsync } from '../api/internal/canAsync';
import { CryptoError } from '../errors';

/**
 * обертка для вывода из асинхронки.
 * @param {Promise<*>} fn - функция или иное свойство от Promise.
 * @returns {*|Promise<*>} .
 * @private
 */
export function deasync(fn: Promise<any>): any {
  let result = fn;
  if (canAsync()) {
    (async () => {
      try {
        result = await fn;
      } catch (err) {
        throw CryptoError.create('CBP-0', 'deasync', err);
      }
    })();
  }
  return result;
}
