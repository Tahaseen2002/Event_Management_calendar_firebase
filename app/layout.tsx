import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import { EventProvider } from '@/contexts/EventContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Calendar App - Event Management',
  description: 'A beautiful calendar application with Firebase authentication and event management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <EventProvider>
            {children}
          </EventProvider>
        </AuthProvider>
      </body>
    </html>
  );
}