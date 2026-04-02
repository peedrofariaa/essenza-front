import { FaInstagram } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-gray-100 bg-[#00843d] px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <span className="text-2xl font-bold tracking-wider text-white">
            Essenza
          </span>
          <a
            href="https://instagram.com/essenza.brasil"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-white transition hover:text-white/70"
            aria-label="Instagram da Essenza"
          >
            <FaInstagram size={18} />
            @essenza.brasil
          </a>
        </div>

        <div className="border-t border-white/20" />

        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-sm text-white/70">
            © {new Date().getFullYear()} Essenza. Todos os direitos reservados.
          </p>
          <nav className="flex flex-wrap justify-center gap-4 text-sm text-white/80">
            <Link to="/sobre" className="transition hover:text-white">
              Sobre
            </Link>
            <Link
              to="/politica-de-privacidade"
              className="transition hover:text-white"
            >
              Política de Privacidade
            </Link>
            <Link to="/termos-de-uso" className="transition hover:text-white">
              Termos de Uso
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
