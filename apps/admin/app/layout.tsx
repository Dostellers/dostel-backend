import './globals.css';
import AuthGate from '@/components/AuthGate';

export const metadata = {
  title: 'Dostel Admin Panel',
  description: 'Admin panel for Dostel PMS',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AuthGate>{children}</AuthGate>
      </body>
    </html>
  );
}
