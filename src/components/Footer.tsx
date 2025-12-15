export default function Footer() {
  return (
    <footer className="mt-10 border-t border-gray-100 bg-[#00843d] px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-white">
          © {new Date().getFullYear()} Essenza.
        </p>
        <nav className="flex items-center gap-4 text-sm text-white">
          <a href="/contato">Contato</a>
          <a href="/sobre">Sobre</a>
          <a href="/politicas">Políticas</a>
        </nav>
      </div>
    </footer>
  )
}
