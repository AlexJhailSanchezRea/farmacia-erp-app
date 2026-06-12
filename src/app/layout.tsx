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
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">{children}</body>
    </html>
  );
}