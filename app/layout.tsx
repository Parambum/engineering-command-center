import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aditya Parameswar — Engineering Command Center",
  description:
    "Interactive engineering command center of Aditya Parameswar: ML research, agentic RAG systems, full-stack builds, and hackathon wins — explorable via terminal, knowledge graph, and git timeline.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${jetbrains.variable} ${grotesk.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
