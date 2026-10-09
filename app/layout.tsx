import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://about.fieldscholar.app"),
  title: "FieldScholar — A Global Learning Companion",
  description: "FieldScholar is a mobile-first application for study abroad, field-based courses, and experiential learning programs: schedules, housing, field notes, faculty contact, and safety resources.",
  alternates: { canonical: "/" },
  openGraph: { title: "FieldScholar — A Global Learning Companion", description: "A mobile-first application for study abroad, field-based courses, and experiential learning programs.", type: "website", images: [{ url: "/og.png", width: 1200, height: 630, alt: "FieldScholar — A Global Learning Companion" }] },
  twitter: { card: "summary_large_image", title: "FieldScholar — A Global Learning Companion", description: "A mobile-first application for study abroad, field-based courses, and experiential learning programs.", images: ["/og.png"] },
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
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
