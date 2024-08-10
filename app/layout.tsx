import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "AR23 | TST",
    description: "Typing Speed Trainer App",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${font.className} flex flex-col justify-between p-3 lg:px-24 lg:py-12 h-svh lg:h-screen bg-zinc-900`}>
                <Header />
                <main>
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    );
}
