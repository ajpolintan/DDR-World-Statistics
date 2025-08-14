import type { Metadata } from "next";
import { Geist, Geist_Mono, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";


const vietnamPro = Be_Vietnam_Pro({
    subsets: ['latin'], 
    weight: ['400', '700'],
    variable: '--font-vietnam-pro',
})
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DDR World Statistics",
  description: "A site where you can view specific DDR stats :0",
  icons: {
    icon: '/favicon.ico',
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
        className={`${vietnamPro.variable} ${vietnamPro.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
