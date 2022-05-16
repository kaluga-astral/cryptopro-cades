import PluginConfig from '../PluginConfig';

/**
 * Логировать информацию (если включен Debug)
 * @param args
 */
export const outputDebug = (...args: (string | any)[]): void => {
  if (PluginConfig.Debug) {
    console.info(...args);
  }
};
