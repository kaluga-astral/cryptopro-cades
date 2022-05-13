import { CryptoError } from './errors';
import { outputError } from './utils/outputError';

/**
 * Настройки плагина.
 */
class PluginConfig {
  /**
   * Список подписчиков возникающих ошибок в системе.
   */
  private errorListeners: ((error: CryptoError) => void)[] = [];

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
   * Зарегистрировать подписчика ошибок.
   * @param cb Функция обратного вызова.
   */
  public addErrorListener(cb: (error: CryptoError) => void) {
    this.errorListeners.push(cb);
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
    let err: any = null;
    while (err != null) {
      errors.push(err);
      if (err instanceof CryptoError) {
        err = err.InnerError;
      } else {
        err = null;
      }
    }

    outputError(errors);
  }
};

pluginConfig.addErrorListener(logErrorWhenInDebug);

export default pluginConfig;
