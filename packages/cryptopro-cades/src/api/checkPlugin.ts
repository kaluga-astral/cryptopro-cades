import { unwrap } from './internal/unwrap';
import { CryptoError } from './../errors';

/**
 * Выполнить инициализацию и проверку работопособности КриптоПРО Браузер плагин.
 * @returns функция ожидания.
 */
export async function checkPlugin(): Promise<void> {
  try {
    // eslint-disable-next-line import/extensions
    require('./../vendor/cadesplugin_api.js');
  } catch (err) {
    throw CryptoError.create(
      'CBP-2',
      'Ошибка загрузки библиотеки cadesplugin.js',
      err,
    );
  }

  if (!window.cadesplugin) {
    throw CryptoError.create(
      'CBP-1',
      'Не инициализирован модуль для работы с cadesplugin',
      null,
    );
  }

  try {
    await unwrap(window.cadesplugin);
  } catch (err) {
    throw CryptoError.create(
      'CBP-1',
      'Ошибка при инициализации модуля для работы с cadesplugin',
      err,
    );
  }
}
