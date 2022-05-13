import PluginConfig from '../PluginConfig';

/**
 * вывод информации в какой-то поток
 * @param args
 */
export const outputDebug = (...args: (string | any)[]): void => {
  if (PluginConfig.Debug) {
    console.info(...args);
  }
};
