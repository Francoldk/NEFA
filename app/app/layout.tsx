import "./globals.css";

export const metadata = {
  title: "NEFA - Gestión Operativa",
  description: "Panel de control logístico y financiero",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-[#030712] text-slate-100 antialiased">{children}</body>
    </html>
  );
}
