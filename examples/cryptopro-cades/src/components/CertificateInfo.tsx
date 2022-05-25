import { Certificate } from '@astral/cryptopro-cades';

type CertificateInfoProps = {
  certificate: Certificate;
  onSelect?: Function;
};

export const CertificateInfo = ({
  certificate,
  onSelect,
}: CertificateInfoProps) =>
  certificate ? (
    <div onClick={(e) => onSelect && onSelect(certificate.subjectKeyId)}>
      <span>
        <b>
          =========================
          <a
            download={`${certificate.subject.commonName}.cer`}
            href={`data:application/x-x509-ca-cert;base64,${certificate.certificateBase64Data}`}
          >
            {certificate.subject.commonName}
          </a>
          =========================
        </b>
        <br />
        <b>subjectKeyId: </b>
        <span
          onClick={(e) =>
            navigator.clipboard.writeText(certificate.subjectKeyId!)
          }
        >
          {certificate.subjectKeyId}
        </span>
      </span>
      {Object.keys(certificate)
        .filter(
          (key) =>
            ![
              'certificateBase64Data',
              'certificateBin',
              'subjectKeyId',
            ].includes(key)
        )
        .map((key, index) => (
          <span style={{ display: 'block' }} key={index}>
            <b>{key}:</b>{' '}
            {certificate[key] instanceof Object
              ? JSON.stringify(certificate[key])
              : certificate[key]?.toString() ?? 'null'}
          </span>
        ))}
    </div>
  ) : null;
