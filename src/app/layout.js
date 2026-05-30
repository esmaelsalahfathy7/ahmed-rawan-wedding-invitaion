import "./globals.css";
import { LanguageProvider } from "../context/LanguageContext";

export const metadata = {
  title: "Ahmed & Rawan Wedding Invitation",
  description: "Ahmed & Rawan Wedding Invitation | You're Invited",
  keywords: "Ahmed, Rawan, Wedding, Invitation",
  openGraph: {
    title: "Ahmed & Rawan Wedding Invitation",
    description: "Ahmed & Rawan Wedding Invitation | You're Invited",
    url: "https://wedding-invitation-v2-iota.vercel.app",
    siteName: "Ahmed & Rawan Wedding Invitation",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ahmed & Rawan Wedding Invitation",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
