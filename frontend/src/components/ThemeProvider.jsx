export default function ThemeProvider({children}) {
  return (
    <div className="bg-black text-white min-h-screen">
      {children}
    </div>
  )
}