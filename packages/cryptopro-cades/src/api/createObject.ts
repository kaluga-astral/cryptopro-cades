import { CryptoError } from '../errors';

import { afterPluginLoaded } from './internal/afterPluginLoaded';
import { canAsync } from './internal/canAsync';
import { unwrap } from './internal/unwrap';

/**
 * Создание криптографического объекта.
 * @see https://docs.cryptopro.ru/cades/plugin/plugin-activation
 * @param {string} objectIdentifier. наименование создаваемого объекта. Объекты указываются в @see CRYPTO_OBJECTS.
 * @throws {CryptoError} в случае ошибки.
 * @returns {Promise<object|null|undefined>} Созданный объект.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createObject(objectIdentifier: string): Promise<any | never> {
  return afterPluginLoaded(async () => {
    if (!objectIdentifier) {
      throw CryptoError.create(
        'CBP-7',
        'Не указан идентификатор объекта',
        null,
      );
    }

    try {
      const object = canAsync()
        ? window.cadesplugin.CreateObjectAsync(objectIdentifier)
        : window.cadesplugin.CreateObject(objectIdentifier);

      return await unwrap(object);
    } catch (error) {
      throw CryptoError.createCadesError(
        error,
        `Ошибка при создании объекта ${objectIdentifier}`,
      );
    }
  })();
}
