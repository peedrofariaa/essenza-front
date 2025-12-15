import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IoIosMenu } from 'react-icons/io'
import { IoSearch, IoBagOutline } from 'react-icons/io5'
import { RiUserLine } from 'react-icons/ri'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import CartSidebar from './CartSidebar'

const CATEGORIES = [
  { label: 'Velas Aromáticas', slug: 'velas' },
  { label: 'Corpo & Banho', slug: 'corpo' },
  { label: 'Decoração', slug: 'decoracao' },
  { label: 'Aromatizadores', slug: 'aromatizadores' },
]

export default function Header() {
  const { user, logout } = useAuth()
  const { totalItems } = useCart()
  const navigate = useNavigate()
  const [openUserMenu, setOpenUserMenu] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const [openCatMenu, setOpenCatMenu] = useState(false)
  const catMenuRef = useRef<HTMLDivElement>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setOpenUserMenu(false)
      }
      if (
        catMenuRef.current &&
        !catMenuRef.current.contains(event.target as Node)
      ) {
        setOpenCatMenu(false)
      }
    }
    if (openUserMenu || openCatMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openUserMenu, openCatMenu])

  const activeBg = scrolled || hovered

  return (
    <>
      <header
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`fixed top-8 right-0 left-0 z-40 transition-colors ${
          activeBg ? 'bg-white/95 shadow-sm backdrop-blur' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
          <div className="flex max-w-md flex-1 items-center gap-6">
            <div className="relative" ref={catMenuRef}>
              <button
                className="mr-2 cursor-pointer text-2xl hover:text-[#00843d]"
                aria-label="Abrir menu de categorias"
                aria-haspopup="menu"
                aria-expanded={openCatMenu}
                aria-controls="header-categories-menu"
                onClick={() => setOpenCatMenu((v) => !v)}
              >
                <IoIosMenu />
              </button>

              {openCatMenu && (
                <nav
                  id="header-categories-menu"
                  role="menu"
                  className="absolute top-14 left-0 z-50 mt-2 w-56 rounded-lg border border-gray-100 bg-white py-2 shadow-lg"
                >
                  {CATEGORIES.map((c) => (
                    <Link
                      key={c.slug}
                      to={`/categoria/${c.slug}`}
                      role="menuitem"
                      className="block px-4 py-2 text-sm text-gray-700 transition hover:bg-[#00843d] hover:text-white"
                      onClick={() => setOpenCatMenu(false)}
                    >
                      {c.label}
                    </Link>
                  ))}
                </nav>
              )}
            </div>

            <form
              role="search"
              className="hidden h-12 w-full max-w-xs items-center rounded-[5px] border border-black/10 bg-gray-50 px-3 py-1 md:flex"
            >
              <IoSearch className="mr-2 text-lg text-gray-400" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                className="flex-1 border-none bg-transparent text-sm outline-none"
              />
            </form>
          </div>

          <div className="flex flex-1 justify-center">
            <Link to={'/'}>
              <span
                className={`block text-3xl font-bold tracking-wider transition-colors select-none ${
                  activeBg ? 'text-[#c9a227]' : 'text-[#00843d]'
                }`}
                style={{ fontFamily: 'var(--font-essenza, inherit)' }}
              >
                Essenza
              </span>
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-end gap-6">
            <div className="relative" ref={userMenuRef}>
              <button
                className="ml-5 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-black/10 transition hover:shadow-md"
                onClick={() => setOpenUserMenu((v) => !v)}
                aria-haspopup="true"
                aria-expanded={openUserMenu}
                aria-controls="header-user-menu"
              >
                <RiUserLine className="text-2xl" />
              </button>
              {openUserMenu && (
                <div
                  id="header-user-menu"
                  className="absolute top-15 right-0 z-50 mt-2 w-44 rounded-lg border border-gray-100 bg-white py-2 shadow-lg"
                >
                  {!user && (
                    <>
                      <Link
                        to="/create-user"
                        className="block px-4 py-2 text-sm text-gray-700 transition hover:bg-[#00843d] hover:text-white"
                        onClick={() => setOpenUserMenu(false)}
                      >
                        Criar conta
                      </Link>
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-sm text-gray-700 transition hover:bg-[#00843d] hover:text-white"
                        onClick={() => setOpenUserMenu(false)}
                      >
                        Entrar
                      </Link>
                    </>
                  )}

                  {user && (
                    <>
                      <Link
                        to="/me"
                        className="block px-4 py-2 text-sm text-gray-700 transition hover:bg-[#00843d] hover:text-white"
                        onClick={() => setOpenUserMenu(false)}
                      >
                        Minha conta
                      </Link>
                      <button
                        className="w-full cursor-pointer px-4 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
                        onClick={async () => {
                          setOpenUserMenu(false)
                          await logout()
                          navigate('/')
                        }}
                      >
                        Sair
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="relative ml-5">
              {' '}
              <button
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-black/10 transition hover:shadow-md"
                onClick={() => setCartOpen(true)}
                aria-label={`Abrir sacola com ${totalItems} itens`}
              >
                <IoBagOutline className="text-2xl" />
              </button>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#00843d] text-xs font-bold text-white">
                  {totalItems}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
