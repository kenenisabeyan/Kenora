import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kenora - Professional Knowledge & Intelligence Platform",
  description:
    "AI-powered professional intelligence infrastructure connecting fragmented knowledge ecosystems.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#0b0f19] text-slate-100 flex min-h-screen">
        {children}
      </body>
    </html>
  );
}
