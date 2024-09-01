import { QRCodeSVG } from 'qrcode.react';

type Props = {
  url: string;
};

export const QrCode = (props: Props) => {
  const { url } = props;

  return (
    <QRCodeSVG value={url} />
  );
};