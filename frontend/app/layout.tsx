import localFont from "next/font/local";
import "./globals.css";

const CooperHewitt = localFont({
  src: "../public/fonts/CooperHewitt/CooperHewitt-Book.woff",
  weight: "400",
  variable: "--font-cooperhewitt",
  display: "swap",
});

const opensans = localFont({
  src: "../public/fonts/open-sans/OpenSans-Regular.ttf",
  weight: "400",
  variable: "--font-opensans",
  display: "swap",
});

const worksans = localFont({
  src: [
    {
      path: "../public/fonts/worksans/WorkSans-VariableFont_wght.ttf",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-worksans",
  display: "swap",
});

const PlusJakartaSans = localFont({
  src: [
    {
      path: "../public/fonts/PlusJakartaSans/PlusJakartaSans-Variable.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-PlusJakartaSans",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${CooperHewitt.variable} ${opensans.variable} ${worksans.variable} ${PlusJakartaSans.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
