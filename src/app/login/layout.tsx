import '../globals.css';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed top-0 z-40 w-full h-14 header-fixed bg-ani-light-gray">
      {children}
    </div>
  )
}
