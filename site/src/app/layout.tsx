import type { Metadata } from "next";
import '@fontsource/inter';
import { Inter } from 'next/font/google';
import "./globals.css";
import PageTrans from "@/components/page-trans";
import { ASLCharacterProvider } from '../contexts/ASLCharacterContext';
import { AuthProvider } from '../contexts/AuthContext';

const inter = Inter({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: "ISLE: Interactive Sign Language Education",
  description: "Learn American Sign Language interactively with ISLE.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={inter.className}
      >
        <AuthProvider>
          <ASLCharacterProvider>
            <PageTrans>{children}</PageTrans>
          </ASLCharacterProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
