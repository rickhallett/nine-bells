export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto min-h-screen max-w-lg px-4 py-6">
      {children}
    </div>
  );
}
