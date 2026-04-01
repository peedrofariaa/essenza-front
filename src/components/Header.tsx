import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IoIosMenu } from 'react-icons/io'
import { IoSearch, IoBagOutline } from 'react-icons/io5'
import { RiUserLine } from 'react-icons/ri'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import CartSidebar from './CartSidebar'

const CATEGORIES = [
  {
    label: 'Velas',
    slug: 'velas',
    sub: [
      { label: 'Velas Aromáticas', slug: 'velas?tipo=aromaticas' },
      { label: 'Velas de Massagem', slug: 'velas?tipo=massagem' },
    ],
  },
  { label: 'Corpo & Banho', slug: 'corpo' },
  { label: 'Decoração', slug: 'decoracao' },
  { label: 'Aromatizadores', slug: 'aromatizadores' },
]

type SearchProduct = {
  id: string
  name: string
  slug: string
  price_in_cents: number
  images?: { url: string }[]
}

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
  const [hoveredCat, setHoveredCat] = useState<string | null>(null)
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

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
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false)
      }
    }
    if (openUserMenu || openCatMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openUserMenu, openCatMenu, showSearchResults])

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    setSearchLoading(true)
    const timer = setTimeout(() => {
      fetch(
        `${import.meta.env.VITE_API_URL}/products?search=${encodeURIComponent(searchQuery.trim())}`,
      )
        .then((r) => r.json())
        .then((json) => {
          const products = json.data || json || []
          setSearchResults(products.slice(0, 6))
          setShowSearchResults(true)
        })
        .catch(() => setSearchResults([]))
        .finally(() => setSearchLoading(false))
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const openSub = (slug: string) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current)
    setHoveredCat(slug)
  }

  const closeSub = () => {
    hoverTimer.current = setTimeout(() => setHoveredCat(null), 150)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setShowSearchResults(false)
      setSearchQuery('')
    }
  }

  const handleSearchResultClick = () => {
    setShowSearchResults(false)
    setSearchQuery('')
  }

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
                    <div
                      key={c.slug}
                      className="relative"
                      onMouseEnter={() =>
                        c.sub ? openSub(c.slug) : closeSub()
                      }
                      onMouseLeave={closeSub}
                    >
                      <div className="flex items-center justify-between">
                        <Link
                          to={`/categoria/${c.slug}`}
                          role="menuitem"
                          className="flex-1 px-4 py-2 text-sm text-gray-700 transition hover:bg-[#00843d] hover:text-white"
                          onClick={() => setOpenCatMenu(false)}
                        >
                          {c.label}
                        </Link>
                      </div>

                      {c.sub && hoveredCat === c.slug && (
                        <div
                          className="absolute top-0 left-full z-50 ml-1 w-52 rounded-lg border border-gray-100 bg-white py-2 shadow-lg"
                          onMouseEnter={() => openSub(c.slug)}
                          onMouseLeave={closeSub}
                        >
                          {c.sub.map((s) => (
                            <Link
                              key={s.slug}
                              to={`/categoria/${s.slug}`}
                              role="menuitem"
                              className="block px-4 py-2 text-sm text-gray-700 transition hover:bg-[#00843d] hover:text-white"
                              onClick={() => setOpenCatMenu(false)}
                            >
                              {s.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="mt-1 border-t border-gray-100 pt-1">
                    <Link
                      to="/aromas"
                      role="menuitem"
                      className="block px-4 py-2 text-sm text-gray-700 transition hover:bg-[#00843d] hover:text-white"
                      onClick={() => setOpenCatMenu(false)}
                    >
                      Aromas
                    </Link>
                  </div>
                </nav>
              )}
            </div>

            <div
              ref={searchRef}
              className="relative hidden w-full max-w-xs md:block"
            >
              <form
                onSubmit={handleSearch}
                role="search"
                className="flex h-12 w-full items-center rounded-[5px] border border-black/10 bg-gray-50 px-3 py-1"
              >
                <IoSearch className="mr-2 text-lg text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 border-none bg-transparent text-sm outline-none"
                />
              </form>

              {showSearchResults && (
                <div className="absolute top-14 left-0 z-50 mt-2 w-full max-w-md rounded-lg border border-gray-100 bg-white shadow-xl">
                  {searchLoading ? (
                    <div className="p-4 text-center text-sm text-gray-500">
                      Buscando...
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">
                      Nenhum produto encontrado
                    </div>
                  ) : (
                    <div className="py-2">
                      {searchResults.map((product) => (
                        <Link
                          key={product.id}
                          to={`/produto/${product.slug}`}
                          onClick={handleSearchResultClick}
                          className="flex items-center gap-3 px-4 py-3 transition hover:bg-gray-50"
                        >
                          {product.images?.[0]?.url ? (
                            <img
                              src={product.images[0].url}
                              alt={product.name}
                              className="h-12 w-12 rounded object-cover"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded bg-gray-100" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {product.name}
                            </p>
                            <p className="text-sm font-semibold text-[#00843d]">
                              {(product.price_in_cents / 100).toLocaleString(
                                'pt-BR',
                                {
                                  style: 'currency',
                                  currency: 'BRL',
                                },
                              )}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
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
