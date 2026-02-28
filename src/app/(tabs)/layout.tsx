// app/(tabs)/layout.tsx
"use client";
import Navbar from "@/components/NavBar";

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
