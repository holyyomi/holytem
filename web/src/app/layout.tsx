import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="scroll-smooth">
      <body className="bg-white text-zinc-900 antialiased">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header는 여기에 */}
          {children}
          {/* Footer는 여기에 */}
        </div>
      </body>
    </html>
  );
}
