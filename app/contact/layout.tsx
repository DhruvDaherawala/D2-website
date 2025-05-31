import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | D2 Digital Solutions",
  description: "Get in touch with our team for inquiries about our projects and services",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 