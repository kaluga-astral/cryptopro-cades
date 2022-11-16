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
    console.log(...prepareArgs(args));
  }
};

/**
 * Логировать ошибку.
 * @param args параметры.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const outputError = (...args: (string | any)[]): void => {
  const data = prepareArgs(args);

  // первый элемент- контекст, второй и далее - объекты ошибки
  const err = data.length === 2 ? data[1] : data.slice(1, data.length);

  console.error({ err }, ...data); // логируем текст ошибки и прикрепляем саму ошибку.
};
