import {
  CADESCOM_XADES_TYPE,
  CADESCOM_XML_SIGNATURE_TYPE,
  Certificate,
  checkIsValidSystemSetup,
  checkPlugin,
  createObject,
  CRYPTO_OBJECTS,
  decrypt,
  encrypt,
  findCertificateBySkid,
  getCertificates,
  getCryptoProviders,
  getSystemInfo,
  ICertificate,
  ICryptoProvider,
  ISystemInfo,
  outputError,
  pluginConfig,
  sign,
  signHash,
  signXml,
  STORE_TYPE,
} from '@astral/cryptopro-cades';
import { getLicensesState } from '@astral/cryptopro-cades/src/api/getLicensesState';
import { Buffer } from 'buffer';

import { useEffect, useState } from 'react';

import { CertificateInfo } from './components/CertificateInfo';
import { CryptoProviderInfo } from './components/CryptoProviderInfo';

const CryptoApp = () => {
  pluginConfig.CheckSystemSetup = true;
  pluginConfig.Debug = true;

  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [versionInfo, setVersionInfo] = useState<ISystemInfo>();
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
        outputError(error);
        window.alert(error?.toString());
      }
    }
    async function fetchCertificates() {
      try {
        const fetchedCertificates = await getCertificates(STORE_TYPE.ALL);

        setCertificates(fetchedCertificates);

        // автоматически берем первый валидный серт если еще выбран
        if (!selectedCertificate) {
          setSelectedCertificate(
            fetchedCertificates.find((c) => c.isGost && c.hasPrivateKey)
          );
        }
      } catch (error) {
        outputError(error);
        window.alert(error?.toString());
      }
    }
    async function fetchCryptoProviders() {
      try {
        const fetchedCryptoProviders = await getCryptoProviders();
        setCryptoProviders(fetchedCryptoProviders);
      } catch (error) {
        outputError(error);
        window.alert(error?.toString());
      }
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
        await selectedFile.arrayBuffer() // массив байт либо массив байт в формате Base64 строки
      );

      dowloadFile(await convertBase64toBlob(sig), selectedFile.name + '.sig');
    } catch (error) {
      outputError(error);
      window.alert(error?.toString());
    }
  };

  /**
   * Подписать файл с хэшом.
   */
  const signFileHash = async (): Promise<void> => {
    if (!selectedCertificate) {
      window.alert('Сертификат не выбран');
      return;
    }
    if (!selectedFile) {
      window.alert('Файл для подписи не выбран');
      return;
    }

    try {
      const sig = await signHash(
        selectedCertificate,
        await selectedFile.arrayBuffer(), // массив байт хэша либо хэш в формате hex строки
        true,
        true
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
        await selectedFile.arrayBuffer(), // массив байт либо массив байт в формате Base64 строки
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
   * Подписать файл в формате XAdES-T.
   */
  const signXadesT = async (withCustomTsp: boolean = false): Promise<void> => {
    if (!selectedCertificate) {
      window.alert('Сертификат не выбран');
      return;
    }
    if (!selectedFile) {
      window.alert('Файл для подписи не выбран');
      return;
    }

    const tspServer = withCustomTsp
      ? await prompt('Введите url службы штампов времени (TSP)')
      : 'http://pki.tax.gov.ru/tsp/tsp.srf';

    if (!tspServer) {
      window.alert('Не введен url службы штампов времени (TSP)');
      return;
    }

    try {
      const sig = await signXml(
        selectedCertificate,
        await selectedFile.arrayBuffer(), // массив байт либо массив байт в формате Base64 строки
        CADESCOM_XADES_TYPE.CADESCOM_XADES_T,
        false,
        tspServer
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
        await selectedFile.arrayBuffer(), // массив байт либо массив байт в формате Base64 строки
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
        await selectedFile.arrayBuffer() // массив байт либо массив байт в формате Base64 строки
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
      window.alert(error.message);
    }
  };

  /**
   * Проверить систему.
   */
  async function checkSystem() {
    try {
      await checkIsValidSystemSetup();
      window.alert('checkSystem: ok');
    } catch (error) {
      outputError(error);
      window.alert(error.toString());
    }
  }

  /**
   * Проверить криптопро браузер плагин.
   */
  async function checkPluginClick() {
    try {
      await checkPlugin();
    } catch (error) {
      outputError(error);
      window.alert(error.toString());
    }
  }

  /**
   * Проверить лицензии продуктов Крипто Про
   */
  async function handleCheckLicensesClick() {
    try {
      const result = await getLicensesState();
      console.log(result);
    } catch (error) {
      outputError(error);
      window.alert(error.toString());
    }
  }

  return (
    <>
      <p>Версия плагина {versionInfo?.cadesVersion}</p>
      <p>Версия криптопровайдера {versionInfo?.cspVersion}</p>
      <button onClick={() => checkPluginClick()}>Проверить плагин</button>
      <button onClick={() => checkSystem()}>Проверить систему</button>
      <button onClick={handleCheckLicensesClick}>Проверить лицензии</button>
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
            <div key={index}>
              <CertificateInfo
                certificate={certInfo}
                onSelect={(skid) => trySelectCertificate(skid)}
              />
            </div>
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
            <button onClick={(_) => signFileHash()}>Подписать CMS (хэш)</button>
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
        {selectedCertificate && selectedFile ? (
          <div>
            <button onClick={(_) => signXadesT(false)}>
              Подписать XAdES-T (TSP налоговой)
            </button>
            <button onClick={(_) => signXadesT(true)}>
              Подписать XAdES-T (кастомный TSP)
            </button>
          </div>
        ) : null}
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
