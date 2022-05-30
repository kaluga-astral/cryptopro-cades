import { CryptoError } from '../errors';

import { afterPluginLoaded } from './internal/afterPluginLoaded';
import { canAsync } from './internal/canAsync';

/**
 * Создание криптографического объекта.
 * @see https://docs.cryptopro.ru/cades/plugin/plugin-activation
 * @param {string} objectIdentifier. наименование создаваемого объекта. Объекты указываются в @see CRYPTO_OBJECTS.
 * @throws {CryptoError} в случае ошибки.
 * @returns {Promise<object|null|undefined>} Созданный объект.
 */
export function createObject(objectIdentifier: string): Promise<any | never> {
  return afterPluginLoaded(async () => {
    if (!objectIdentifier) {
      throw CryptoError.create(
        'CBP-7',
        'Не указан идентификатор объекта',
        null
      );
    }
    try {
      const object = canAsync()
        ? window.cadesplugin.CreateObjectAsync(objectIdentifier)
        : window.cadesplugin.CreateObject(objectIdentifier);

      return object instanceof Promise ? await object : object;
    } catch (error) {
      throw CryptoError.createCadesError(
        error,
        `Ошибка при создании объекта ${objectIdentifier}`
      );
    }
  })();
}
