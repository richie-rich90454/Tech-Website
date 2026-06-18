import type { Metadata } from 'next';
import './landing.css';

export const metadata: Metadata = {
  title: 'IPstress - Best stresser on the market.',
  description: 'The cheapest price, the best service guarantee.',
  icons: { icon: '/web/images/favicon.png' },
};

export default function WebLayout({ children }: { children: React.ReactNode }): React.ReactElement {
  return <>{children}</>;
}
