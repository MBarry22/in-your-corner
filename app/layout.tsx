import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import "./globals.css";

const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "In Your Corner";

export const metadata: Metadata = {
  title: appName,
  description: "Private daily support messages",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-zinc-900 antialiased">
        <Nav />
        <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">{children}</main>
      </body>
    </html>
  );
}
