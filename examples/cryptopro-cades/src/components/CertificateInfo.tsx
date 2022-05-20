import { Certificate } from '@astral/cryptopro-cades';

type CertificateInfoProps = {
  certificate: Certificate;
};

export const CertificateInfo = ({ certificate }: CertificateInfoProps) =>
  certificate ? (
    <>
      <span>
        <b>
          ========================={certificate.name}=========================
        </b>
      </span>
      {Object.keys(certificate)
        .filter(
          (key) => !['certificateBase64Data', 'certificateBin'].includes(key)
        )
        .map((key, index) => (
          <span style={{ display: 'block' }} key={index}>
            <b>{key}:</b>{' '}
            {certificate[key] instanceof Object
              ? JSON.stringify(certificate[key])
              : certificate[key]?.toString() ?? 'null'}
          </span>
        ))}
    </>
  ) : null;
