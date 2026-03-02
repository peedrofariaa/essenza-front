import { FaInstagram } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-gray-100 bg-[#00843d] px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-white">
          © {new Date().getFullYear()} Essenza.
        </p>
        <nav className="flex items-center gap-4 text-sm text-white">
          <a
            href="https://instagram.com/essenza.brasil"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 transition hover:text-white/70"
            aria-label="Instagram da Essenza"
          >
            <FaInstagram size={16} />
            Instagram
          </a>
          <Link to="/sobre" className="transition hover:text-white/70">
            Sobre
          </Link>
        </nav>
      </div>
    </footer>
  )
}
