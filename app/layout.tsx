import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const orbitron = localFont({
  src: "../public/assets/fonts/orbitron/orbitron-variable.ttf",
  variable: "--font-orbitron-face",
  weight: "100 900",
  display: "swap",
});

const jetbrainsMono = localFont({
  src: "../public/assets/fonts/jetbrains-mono/jetbrains-mono-variable.ttf",
  variable: "--font-jetbrains-mono-face",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Frontend Mentor | Gamer sign-up form",
  description:
    "NEONCORE sign-up form — initialize your competitive-gaming network identity.",
  icons: {
    icon: "/assets/images/favicon-32x32.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-navy-950 font-jetbrains-mono">
        {children}
      </body>
    </html>
  );
}
