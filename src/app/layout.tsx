import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NexaERP",
  description:
    "Sistema ERP modular para ventas, inventario, compras, caja y reportes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}