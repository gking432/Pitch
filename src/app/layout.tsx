import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Del Campo Growth Engine",
  description: "Candidate-built growth operating system concept for Del Campo Golf."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
