/**
 * Конвертировать массив байт в строкове 16-ричное представление.
 * @param buffer массив байт.
 * @returns строка в 16-ричном представлении.
 */
export function bufferToHex(buffer: ArrayBuffer): string | null {
  if (!buffer) {
    return null;
  }

  let result = '';
  const int8Buffer = new Uint8Array(buffer);

  for (let i = 0; i < int8Buffer.length; i++) {
    const str = int8Buffer[i].toString(16).toUpperCase();

    result += (str.length === 1 ? '0' : '') + str;
  }

  return result.trim();
}
