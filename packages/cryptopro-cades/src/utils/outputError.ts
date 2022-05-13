/**
 * Залогировать ошибку.
 * @param args параметры.
 */
export const outputError = (...args: (string | any)[]): void => {
  console.error(...args);
};
