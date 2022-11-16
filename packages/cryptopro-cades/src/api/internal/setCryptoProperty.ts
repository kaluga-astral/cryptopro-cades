import { CryptoError } from '../../errors';

import { canAsync } from './canAsync';

/**
 * описываем структуру параметр OBJ функции ниже.
 * интерфейс ради интерфейса >_<
 */
interface ICryptoObject {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

/**
 * Устанавливаем значение в указанное свойство переданного объекта.
 * @param {object} obj - объект-цель.
 * @param {string} key - имя свойства.
 * @param {*} value - значение для свойства.
 * @returns {void} .
 */
export async function setCryptoProperty(
  obj: ICryptoObject,
  key: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any,
): Promise<void> {
  try {
    if (canAsync()) {
      const res = obj[`propset_${key}`](value);

      if (res instanceof Promise) {
        await res;
      }
    } else {
      // eslint-disable-next-line no-param-reassign
      obj[key] = value;
    }
  } catch (err) {
    throw CryptoError.createCadesError(
      err,
      `Не удалось установить значение в поле ${key}`,
    );
  }
}
