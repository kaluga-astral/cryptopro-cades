import PluginConfig from '../PluginConfig';

/**
 * Подготовить данные для логирования.
 * @param args данные.
 * @returns Объект готовый для логирования.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prepareArgs = (args: (string | any)[]): any[] => {
  const context = '[cryptopro-cades]: ';

  if (typeof args[0] == 'string') {
    args[0] = context + args[0];
  } else {
    args.unshift(context);
  }

  return args;
};

/**
 * Логировать информацию (если включен Debug)
 * @param args
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const outputDebug = (...args: (string | any)[]): void => {
  if (PluginConfig.Debug) {
    const data = prepareArgs(args);

    if (typeof data[0] == 'string') {
      console.log(data[0], data.slice(1, data.length));
    } else {
      console.log(data);
    }
  }
};

/**
 * Логировать ошибку.
 * @param args параметры.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const outputError = (...args: (string | any)[]): void => {
  const data = prepareArgs(args);

  if (typeof data[0] == 'string') {
    console.error(data[0], data.slice(1, data.length));
  } else {
    console.error(data);
  }
};
