import "../globals.css"

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav className="fixed top-0 z-40 w-full h-16 header-fixed bg-ani-gray"></nav>
      {children}
    </div>
  )
}
