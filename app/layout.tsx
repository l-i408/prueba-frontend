import "./globals.css";

export const metadata = {
  title: "Prueba Frontend",
  description: "Verifica conexión con backend en Railway",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
