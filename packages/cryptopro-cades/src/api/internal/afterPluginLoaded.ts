import { isValidSystemSetup } from '../isValidSystemSetup';

import { CryptoError } from './../../errors';
import PluginConfig from './../../PluginConfig';

/**
 * Сохранение статуса во избежание повторных инициализаций.
 */
let isPluginReady: boolean = false;

/**
 * Обёртка для подготовки плагина перед вызовом функциональности.
 * @param {Function|Promise} cb - функция обратного вызова.
 * @returns {Promise} .функция ожидания.
 */
export function afterPluginLoaded(
  cb: Function
): (...args: any) => Promise<any> {
  return async (...args) => {
    if (!isPluginReady) {
      try {
        // eslint-disable-next-line import/extensions
        require('./vendor/cadesplugin_api.js');
      } catch (err) {
        throw CryptoError.create(
          'CBP-2',
          'Ошибка загрузки библиотеки cadesplugin.js',
          err
        );
      }

      isPluginReady = true;
    }

    if (!window.cadesplugin) {
      throw CryptoError.create(
        'CBP-1',
        'Не инициализирован модуль для работы с cadesplugin',
        null
      );
    }

    try {
      if (window.cadesplugin instanceof Promise) {
        await window.cadesplugin;
      }
    } catch (err) {
      throw CryptoError.create(
        'CBP-1',
        'Ошибка при инициализации модуля для работы с cadesplugin',
        err
      );
    }

    if (PluginConfig.DebugCryptoProBrowserPlugin) {
      window.cadesplugin.set_log_level(window.cadesplugin.LOG_LEVEL_DEBUG);
    }

    if (PluginConfig.CheckSystemSetup) {
      await isValidSystemSetup();
    }

    const callbackResult = cb.apply(null, args);

    if (callbackResult instanceof Promise) {
      await callbackResult;
    }

    return callbackResult;
  };
}
