import { Buffer } from 'buffer';

import { useEffect, useState } from 'react';
import {
  Certificate,
  STORE_TYPE,
  decrypt,
  encrypt,
  findCertificateBySkid,
  getCertificates,
  getCryptoProviders,
  getSystemInfo,
  outputError,
  pluginConfig,
  sign,
  signXml,
  CADESCOM_XML_SIGNATURE_TYPE,
  createObject,
  CRYPTO_OBJECTS,
} from '@astral/cryptopro-cades/src';

import {
  ICertificate,
  ICryptoProvider,
  SystemInfo,
} from '@astral/cryptopro-cades/src/types';

import { CertificateInfo } from './components/CertificateInfo';
import { CryptoProviderInfo } from './components/CryptoProviderInfo';

const CryptoApp = () => {
  pluginConfig.CheckSystemSetup = true;
  pluginConfig.Debug = true;

  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [versionInfo, setVersionInfo] = useState<SystemInfo>();
  const [cryptoProviders, setCryptoProviders] = useState<ICryptoProvider[]>([]);
  const [showCertificates, setShowCertificates] = useState<boolean>();
  const [showCryptoProviders, setShowCryptoProviders] = useState<boolean>();
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate>();
  const [selectedFile, setSelectedFile] = useState<File>();
  const [selectedEncryptCert, setSelectedEncryptCert] =
    useState<ICertificate>();
  const [selectedEncryptCertBase64, setSelectedEncryptCertBase64] =
    useState<string>();

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
   * Подписать файл в формате CMS.
   */
  const signFile = async (): Promise<void> => {
    if (!selectedCertificate) {
      window.alert('Сертификат не выбран');
      return;
    }
    if (!selectedFile) {
      window.alert('Файл для подписи не выбран');
      return;
    }

    try {
      const sig = await sign(
        selectedCertificate,
        await selectedFile.arrayBuffer() // либо Base64 строку
      );

      dowloadFile(await convertBase64toBlob(sig), selectedFile.name + '.sig');
    } catch (error) {
      outputError(error);
      window.alert(error?.toString());
    }
  };

  /**
   * Подписать файл в формате XmlDSig.
   */
  const signXmlFile = async (
    xmlSignatureType: CADESCOM_XML_SIGNATURE_TYPE
  ): Promise<void> => {
    if (!selectedCertificate) {
      window.alert('Сертификат не выбран');
      return;
    }
    if (!selectedFile) {
      window.alert('Файл для подписи не выбран');
      return;
    }

    try {
      const sig = await signXml(
        selectedCertificate,
        await selectedFile.arrayBuffer(), // либо Base64 строку
        xmlSignatureType
      );

      dowloadFile(
        await convertBase64toBlob(sig),
        selectedFile.name.replace('.xml', '') + '.sig.xml'
      );
    } catch (error) {
      outputError(error);
      window.alert(error?.toString());
    }
  };

  /**
   * Зашифровать файл в формате CMS.
   */
  const encryptFileCms = async (): Promise<void> => {
    if (!selectedEncryptCert) {
      window.alert('Сертификат получателя не выбран');
      return;
    }
    if (!selectedFile) {
      window.alert('Файл для шифрования не выбран');
      return;
    }

    try {
      const encryptedData = await encrypt(
        await selectedFile.arrayBuffer(), // либо Base64 строку
        [selectedEncryptCert]
      );

      dowloadFile(
        await convertBase64toBlob(encryptedData),
        selectedFile.name + '.enc'
      );
    } catch (error) {
      outputError(error);
      window.alert(error?.toString());
    }
  };

  /**
   * Зашифровать файл в формате CMS.
   */
  const decryptFileCms = async (): Promise<void> => {
    if (!selectedFile) {
      window.alert('Файл для расшифровки не выбран');
      return;
    }

    try {
      const decryptedData = await decrypt(
        await selectedFile.arrayBuffer() // либо Base64 строку
      );

      dowloadFile(
        await convertBase64toBlob(decryptedData),
        selectedFile.name + '.decrypted'
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
      outputError(error);
      window.alert(error.toString());
    }
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

  /**
   * Выполняет импорт сертификата.
   * @param data
   */
  const importCertificate = async (
    data: string | ArrayBuffer
  ): Promise<void> => {
    if (!data) {
      setSelectedEncryptCertBase64(undefined);
      setSelectedEncryptCert(undefined);
      return;
    }

    const arrayBufferToString = (buffer) => {
      return new TextDecoder().decode(buffer);
    };

    const parseFromArrayBuffer = async (buffer: ArrayBuffer) => {
      const certificate: ICertificate = await createObject(
        CRYPTO_OBJECTS.certificate
      );
      const base64 = Buffer.from(buffer).toString('base64');
      await certificate.Import(base64);
      setSelectedEncryptCertBase64(base64);
      setSelectedEncryptCert(certificate);
      return certificate;
    };

    const parseFromBase64String = async (base64: string) => {
      const certificate: ICertificate = await createObject(
        CRYPTO_OBJECTS.certificate
      );
      await certificate.Import(base64);
      setSelectedEncryptCertBase64(base64);
      setSelectedEncryptCert(certificate);
      return certificate;
    };
    try {
      if (data instanceof ArrayBuffer) {
        try {
          await parseFromArrayBuffer(data);
        } catch (error) {
          outputError(error);
          await parseFromBase64String(arrayBufferToString(data));
        }
      } else {
        try {
          await parseFromArrayBuffer(Buffer.from(data));
        } catch (error) {
          outputError(error);
          await parseFromBase64String(data);
        }
      }
    } catch (error) {
      outputError(error);
      window.alert(error.toString());
    }
  };

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
          ========================= Операции с сертификатами
          =========================
        </b>
        <br />
        <br />
        skid:
        <input
          style={{ width: 350 }}
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
        {selectedCertificate ? (
          <>
            <br />
            <br />
            <button onClick={(_) => checkEncryptDecrypt()}>
              Проверить шифрование/расшифровку
            </button>
            <br />
          </>
        ) : null}
        <br />
        <br />
        Выберите файл для криптооперации:
        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files![0])}
        />
        <br />
        {selectedCertificate && selectedFile ? (
          <>
            <br />
            <button onClick={(_) => signFile()}>Подписать CMS</button>
          </>
        ) : null}
        {selectedCertificate && selectedFile ? (
          <>
            <br />
            <button
              onClick={(_) =>
                signXmlFile(
                  CADESCOM_XML_SIGNATURE_TYPE.CADESCOM_XML_SIGNATURE_TYPE_ENVELOPED
                )
              }
            >
              Подписать XmlDSig (enveloped)
            </button>
          </>
        ) : null}
        {selectedCertificate && selectedFile ? (
          <>
            <br />
            <button
              onClick={(_) =>
                signXmlFile(
                  CADESCOM_XML_SIGNATURE_TYPE.CADESCOM_XML_SIGNATURE_TYPE_TEMPLATE
                )
              }
            >
              Подписать XmlDSig (template)
            </button>
          </>
        ) : null}
        <br />
        {selectedFile ? (
          <>
            <button onClick={(_) => decryptFileCms()}>Расшифровать CMS</button>
            <br />
          </>
        ) : null}
        <br />
        <br />
        Укажите Base64 сертификата на которого зашифровать
        <br /> или выберите серт из файла:
        <input
          type="file"
          onChange={async (e) =>
            await importCertificate(await e.target.files![0].arrayBuffer())
          }
        />
        <br />
        <textarea
          style={{ width: 500, height: 200 }}
          value={selectedEncryptCertBase64}
          onChange={async (e) => await importCertificate(e.target.value)}
        />
        {selectedEncryptCert && selectedFile ? (
          <>
            <br />
            <button onClick={(_) => encryptFileCms()}>Зашифровать CMS</button>
          </>
        ) : null}
      </div>
    </>
  );
};

const App = () => (
  <div className="App">
    <CryptoApp />
  </div>
);

export default App;
