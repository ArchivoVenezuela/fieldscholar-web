import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://about.fieldscholar.app"),
  title: "FieldScholar — A Global Learning Companion",
  description: "FieldScholar brings program information, experiential learning, communication, and safety into one mobile-first companion for international and field-based education.",
  alternates: { canonical: "/" },
  openGraph: { title: "FieldScholar — A Global Learning Companion", description: "One mobile-first companion for program information, field learning, communication, and safety.", type: "website", images: [{ url: "/og.png", width: 1200, height: 630, alt: "FieldScholar — A Global Learning Companion" }] },
  twitter: { card: "summary_large_image", title: "FieldScholar — A Global Learning Companion", description: "One mobile-first companion for learning beyond the classroom.", images: ["/og.png"] },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
