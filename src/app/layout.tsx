import type { Metadata, Viewport } from "next";
import { Fredoka, Nunito } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "blocksy. — Make online safety click",
    template: "%s · blocksy.",
  },
  description:
    "Blocksy makes cybersecurity simple and fun. Learn to spot threats, strengthen your accounts and build better digital safety habits while collecting colorful bricks.",
  openGraph: {
    title: "blocksy. — Make online safety click",
    description: "Build your digital safety, one block at a time.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "blocksy. — Make online safety click",
    description: "Build your digital safety, one block at a time.",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fredoka.variable} ${nunito.variable} antialiased`}>
      <body className="min-h-dvh bg-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
