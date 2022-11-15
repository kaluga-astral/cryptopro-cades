/**
 * В данный момент имеется версия не меньше указанной версия CAdESCOM Плагина.
 * @param {string} version полная версия Плагина для сверки.
 * @returns {boolean} .
 */
export function isSupportedCadesVersion(version: string): boolean {
  const match = version.match(/(\d+)\.(\d+)\.(\d+)/);

  if (!match) {
    return false;
  }

  let [, major, minor, patch] = match;

  // @ts-ignore
  major = parseInt(major);
  // @ts-ignore
  minor = parseInt(minor);
  // @ts-ignore
  patch = parseInt(patch);

  return (
    // @ts-ignore
    major > 2 ||
    !(parseInt(major) === 2 && parseInt(minor) === 0 && parseInt(patch) < 13292)
  );
}
