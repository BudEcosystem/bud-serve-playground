import { Inter } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";

import "./globals.scss";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI SDK - Next.js OpenAI Examples",
  description: "Examples of using the AI SDK with Next.js and OpenAI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} chat-app`}>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
