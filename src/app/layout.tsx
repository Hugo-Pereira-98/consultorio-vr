import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/toaster';
import type { Metadata } from 'next';
import './globals.css';
import SidebarLayout from '../components/SidebarLayout';

export const metadata: Metadata = {
  title: 'Consultorio',
  description: 'Consultorio.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <SidebarLayout>{children}</SidebarLayout>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
