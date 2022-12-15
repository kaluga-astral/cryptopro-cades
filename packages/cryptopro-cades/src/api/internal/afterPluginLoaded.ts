import { checkIsValidSystemSetup } from '../checkIsValidSystemSetup';
import { checkPlugin } from '../checkPlugin';

import { unwrap } from './unwrap';
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
  cb: Function,
  checkSystem: boolean = false,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): (...args: any) => Promise<any> {
  return async (...args) => {
    if (!isPluginReady) {
      await checkPlugin();
      isPluginReady = true;
    }

    if (PluginConfig.DebugCryptoProBrowserPlugin) {
      window.cadesplugin.set_log_level(window.cadesplugin.LOG_LEVEL_DEBUG);
    }

    // для исключения зацикливания, проверку валидности системы делаем единожды.
    if (checkSystem && PluginConfig.CheckSystemSetup && !isPluginReady) {
      await checkIsValidSystemSetup();
    }

    const callbackResult = await unwrap(cb.apply(null, args));

    return callbackResult;
  };
}
