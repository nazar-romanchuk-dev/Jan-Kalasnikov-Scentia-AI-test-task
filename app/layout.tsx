import { Sidebar } from '@components/Sidebar';
import '@styles/globals.css';
import React from 'react';

export const metadata = {
  title: 'ScentiaAI',
  description: '',
  icons: {
    icon: '/favicon.ico',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <main className="app">
          <Sidebar />
          {children}
        </main>
      </body>
    </html>
  );
};

export default RootLayout;
