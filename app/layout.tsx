import type { Metadata } from "next";
import Layout from "../components/Layout";
import "bootstrap/dist/css/bootstrap.min.css";

export const metadata: Metadata = {
  title: "Quiz Builder",
  description: "Create and manage quizzes in your browser.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
