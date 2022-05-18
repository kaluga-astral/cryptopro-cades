import { useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import './App.css';
import {
  pluginConfig,
  getSystemInfo,
  getCertificates,
  getCryptoProviders,
  Certificate,
  STORE_TYPE,
  outputError,
  sign,
  decrypt,
  encrypt,
  findCertificateBySkid,
} from '@astral/cryptopro-cades';

import { SystemInfo, ICryptoProvider } from '@astral/cryptopro-cades';

import { CertificateInfo } from './components/CertificateInfo';
import { CryptoProviderInfo } from './components/CryptoProviderInfo';
declare const window: any;

const App = () => {
  return (
    <div className="App">
      <CryptoApp />
    </div>
  );
};

export default App;

const CryptoApp = () => {
  pluginConfig.CheckSystemSetup = true;
  pluginConfig.Debug = true;

  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [versionInfo, setVersionInfo] = useState<SystemInfo>();
  const [cryptoProviders, setCryptoProviders] = useState<ICryptoProvider[]>([]);
  const [showCertificates, setShowCertificates] = useState<boolean>();
  const [showCryptoProviders, setShowCryptoProviders] = useState<boolean>();
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate>();
  const [selectedFileForSign, setSelectedFileForSign] = useState<File>();

  useEffect(() => {
    async function fetchSystemInfo() {
      try {
        const systemInfo = await getSystemInfo();
        setVersionInfo(systemInfo);
      } catch (error) {
        window.alert(error);
      }
    }
    async function fetchCertificates() {
      const fetchedCertificates = await getCertificates(STORE_TYPE.ALL);

      setCertificates(fetchedCertificates);

      // автоматически берем первый валидный серт если еще выбран
      if (!selectedCertificate) {
        setSelectedCertificate(
          fetchedCertificates.find((c) => c.isGost && c.hasPrivateKey)
        );
      }
    }
    async function fetchCryptoProviders() {
      const cryptoProviders = await getCryptoProviders();
      setCryptoProviders(cryptoProviders);
    }

    if (showCryptoProviders) {
      fetchCryptoProviders();
    }
    if (showCertificates) {
      fetchCertificates();
    }
    fetchSystemInfo();
  }, [showCryptoProviders, showCertificates, selectedCertificate]);

  /**
   * Попытаться найти сертификат с указанным skid.
   * @param skid Идентификатор ключа субъекта.
   */
  const trySelectCertificate = async (skid: string) => {
    if (skid) {
      const certificate = await findCertificateBySkid(skid);
      if (certificate) {
        setSelectedCertificate(certificate);
      }
    }
  };

  /**
   * Подписать файл.
   */
  const signString = async (): Promise<void> => {
    if (!selectedCertificate) {
      window.alert('Сертификат не выбран');
      return;
    }
    if (!selectedFileForSign) {
      window.alert('Файл для подписи не выбран');
      return;
    }

    try {
      const sig = await sign(
        selectedCertificate,
        await selectedFileForSign.arrayBuffer() // либо Base64 строку
      );

      dowloadFile(
        await convertBase64toBlob(sig),
        selectedFileForSign.name + '.sig'
      );
    } catch (error) {
      outputError(error);
      window.alert(error?.toString());
    }
  };

  /**
   * Проверить шифрование и расшифровку, зашифровав данные на свой серт.
   */
  const checkEncryptDecrypt = async (): Promise<void> => {
    if (!selectedCertificate) {
      window.alert('Сертификат не выбран');
      return;
    }
    const originalData = 'Hello world!';

    try {
      const encryptedData = await encrypt(
        Buffer.from(originalData).toString('base64'),
        [selectedCertificate.certificateBin!]
      );

      const decryptedData = await decrypt(encryptedData);
      const isOk =
        Buffer.from(decryptedData, 'base64').toString('utf-8') === originalData;

      window.alert(
        isOk ? 'Шифрование-расшифровка прошла успешно' : 'Данные не совпали'
      );
    } catch (error) {
      window.alert(error.toString());
    }
  };

  /**
   * Скачать файл.
   * @param blob Блоб
   * @param name Наименование файла.
   */
  const dowloadFile = (blob: Blob, name: string): void => {
    const url = window.URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.style.display = 'hidden';
    window.document.body.appendChild(a);
    a.href = url;
    a.download = name;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  };

  /**
   *
   * @param base64 строка в формате Base64.
   * @param type Тип данных.
   * @returns {Promise<Blob>} Блоб.
   */
  const convertBase64toBlob = (
    base64: string,
    type: string = 'application/octet-stream'
  ): Promise<Blob> =>
    window
      .fetch(`data:${type};base64,${base64}`)
      .then((res: Response) => res.blob());

  return (
    <>
      <p>Версия плагина {versionInfo?.cadesVersion}</p>
      <p>Версия криптопровайдера {versionInfo?.cspVersion}</p>
      <button onClick={() => setShowCryptoProviders(!showCryptoProviders)}>
        {!showCryptoProviders
          ? 'Показать криптопровайдеры'
          : 'Скрыть криптопровайдеры'}
      </button>
      <button onClick={() => setShowCertificates(!showCertificates)}>
        {!showCertificates ? 'Показать сертификаты' : 'Скрыть сертификаты'}
      </button>
      <div style={{ display: showCryptoProviders ? '' : 'none' }}>
        Криптопровайдеры:
        {cryptoProviders?.map((cryptoProvider, index) => {
          return (
            <p key={index}>
              <CryptoProviderInfo cryptoProvider={cryptoProvider} />
            </p>
          );
        })}
      </div>
      <div style={{ display: showCertificates ? '' : 'none' }}>
        Сертификаты:
        {certificates?.map((certInfo, index) => {
          return (
            <p key={index}>
              <CertificateInfo certificate={certInfo} />
            </p>
          );
        }) ?? 'Ничего нет :('}
      </div>
      <br />
      <br />
      <br />
      <div>
        <b>
          ======================================= Операции с сертификатами
          =======================================
        </b>
        <br />
        <br />
        <input
          placeholder="Введите skid серта"
          onChange={(e) => trySelectCertificate(e.target.value)}
          value={selectedCertificate?.subjectKeyId!}
        />
        {selectedCertificate ? (
          <>
            <p>Выбранный сертификат</p>
            <CertificateInfo certificate={selectedCertificate} />
          </>
        ) : null}
        <br />
        <br />
        Подпись
        <input
          type="file"
          onChange={(e) => setSelectedFileForSign(e.target.files![0])}
        />
        {selectedCertificate && selectedFileForSign ? (
          <button onClick={(_) => signString()}>Подписать</button>
        ) : null}
        {selectedCertificate ? (
          <button onClick={(_) => checkEncryptDecrypt()}>
            Проверить шифрование/расшифровку
          </button>
        ) : null}
      </div>
    </>
  );
};
