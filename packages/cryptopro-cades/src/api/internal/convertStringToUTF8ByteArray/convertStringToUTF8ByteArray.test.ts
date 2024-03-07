import { convertStringToUTF8ByteArray } from './convertStringToUTF8ByteArray';

describe('convertStringToUTF8ByteArray', () => {
  it('Конвертирует название СКЗИ Крипто Про как Тулбокс', () => {
    const stringToConvert = '"КриптоПро CSP" (версия 4.0)';
    const resultFromToolbox = [
      34, 208, 154, 209, 128, 208, 184, 208, 191, 209, 130, 208, 190, 208, 159,
      209, 128, 208, 190, 32, 67, 83, 80, 34, 32, 40, 208, 178, 208, 181, 209,
      128, 209, 129, 208, 184, 209, 143, 32, 52, 46, 48, 41,
    ];

    const result = convertStringToUTF8ByteArray(stringToConvert);

    expect(result).toEqual(resultFromToolbox);
  });
});
