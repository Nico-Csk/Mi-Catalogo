import "./globals.css";

export const metadata = {
  title: "Mi Tienda",
  description: "Ropa, Zapatillas y Electrónica",
  manifest: "/manifest.json",
  themeColor: "#000000",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/icon-192.png" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      </head>
      <body>{children}</body>
    </html>
  );
}