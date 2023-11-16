import { CryptoError } from './errors';
import { outputError } from './utils';
import { CRYPTO_PROVIDERS } from './constants';
import type { ICryptoProvider } from './types';

/**
 * Настройки плагина.
 */
class PluginConfig {
  /**
   * Список подписчиков возникающих ошибок в системе.
   */
  private errorListeners: ((error: CryptoError) => void)[] = [];

  /**
   * Функция для проверки (переопределения проверки) версии криптопровайдера.
   * Если вернуть null, считаем что версия прошла проверку.
   */
  checkCspVersionFunc:
    | ((cryptoProvider: ICryptoProvider) => string | null)
    | null = null;

  /**
   * Выводить дебаг-информацию.
   */
  Debug: boolean = false;

  /**
   * Выводить дебаг информацию по криптопро плагину.
   */
  DebugCryptoProBrowserPlugin: boolean = false;

  /**
   * Проверять систему при инициализации.
   */
  CheckSystemSetup: boolean = true;

  /**
   * Список криптопровайдеров для проверки и работы.
   */
  CheckCryptoProviders: ICryptoProvider[] = CRYPTO_PROVIDERS;

  /**
   * Зарегистрировать подписчика ошибок.
   * @param cb Функция обратного вызова.
   * @remarks Подписчики ошибок будут вызваны в обратном порядке.
   */
  public addErrorListener(cb: (error: CryptoError) => void) {
    this.errorListeners.unshift(cb);
  }

  /**
   * Уведомить подписчиков об ошибке.
   * @param error Ошибка.
   */
  public notifyError(error: CryptoError) {
    this.errorListeners.forEach((cb) => cb(error));
  }
}

const pluginConfig = new PluginConfig();

/**
 * Функция логирования всех возникающих ошибок.
 * @param error Ошибка.
 */
const logErrorWhenInDebug = (error: CryptoError): void => {
  if (pluginConfig.Debug && error) {
    const errors = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let err: any = error;

    while (err != null) {
      errors.push(err);

      if (err instanceof CryptoError || err instanceof Error) {
        err = err.cause;
      } else {
        err = null;
      }
    }

    if (errors?.length) {
      outputError('Ошибка >>', errors);
    }
  }
};

pluginConfig.addErrorListener(logErrorWhenInDebug);

export { pluginConfig };

export default pluginConfig;
