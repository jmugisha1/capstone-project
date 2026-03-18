import localFont from "next/font/local";
import "./layout.css";

const Amulya = localFont({
  src: [
    {
      path: "../public/fonts/Amulya/Amulya-Variable.woff2",
      weight: "300 700",
      style: "normal",
    },
    {
      path: "../public/fonts/Amulya/Amulya-VariableItalic.woff2",
      weight: "300 700",
      style: "italic",
    },
  ],
  variable: "--font-amulya",
  display: "swap",
});

const Manrope = localFont({
  src: [
    {
      path: "../public/fonts/Manrope/Manrope-Variable.woff2",
      weight: "200 800",
      style: "normal",
    },
  ],
  variable: "--font-Manrope",
  display: "swap",
});

const Literate = localFont({
  src: [
    {
      path: "../public/fonts/Literate/Literata-Variable.woff2",
      weight: "200 900",
      style: "normal",
    },
    {
      path: "../public/fonts/Literate/Literata-VariableItalic.woff2",
      weight: "200 900",
      style: "italic",
    },
  ],
  variable: "--font-literate",
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
      className={`${Amulya.variable} ${Literate.variable} ${Manrope.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
