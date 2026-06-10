import type { Metadata } from 'next';
import './landing.css';

export const metadata: Metadata = {
  title: 'IPstress - Best stresser on the market.',
  description: 'The cheapest price, the best service guarantee.',
  icons: { icon: '/web/images/favicon.png' },
};

export default function WebLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/web/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/web/css/font-awesome.min.css" />
        <link rel="stylesheet" href="/web/vendors/flat-icon/flaticon.css" />
        <link rel="stylesheet" href="/web/vendors/animate-css/animate.css" />
        <link rel="stylesheet" href="/web/vendors/owl-carousel/owl.carousel.min.css" />
        <link rel="stylesheet" href="/web/vendors/magnify-popup/magnific-popup.css" />
        <link rel="stylesheet" href="/web/vendors/jquery-ui/jquery-ui.min.css" />
        <link rel="stylesheet" href="/web/vendors/bootstrap-selector/nice-select.css" />
        <link rel="stylesheet" href="/web/vendors/lightbox/simpleLightbox.css" />
        <link rel="stylesheet" href="/web/vendors/meanMenu/meanmenu.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}