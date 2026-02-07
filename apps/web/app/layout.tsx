import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "AION | Sistema Cognitivo",
    description: "Agente de IA de Próxima Generación",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.className} bg-[rgb(var(--background))] text-[rgb(var(--foreground))] min-h-screen antialiased`}>{children}</body>
        </html>
    );
}
