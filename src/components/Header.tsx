import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IoIosMenu } from 'react-icons/io'
import { IoSearch, IoBagOutline } from 'react-icons/io5'
import { RiUserLine } from 'react-icons/ri'
import Logo from '../assets/Logo-Essenza.png'
import { useAuth } from '../context/AuthContext'

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [openUserMenu, setOpenUserMenu] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setOpenUserMenu(false)
      }
    }
    if (openUserMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openUserMenu])

  return (
    <header className="flex h-24 items-center justify-between border-b border-gray-100 bg-white px-10">
      <div className="flex max-w-md flex-1 items-center gap-6">
        <button
          className="mr-2 cursor-pointer text-2xl hover:text-[#00843d]"
          aria-label="Abrir menu de navegação"
        >
          <IoIosMenu />
        </button>
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
          <img src={Logo} alt="Logo" className="w-full max-w-[220px]" />
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
              className="absolute right-0 z-50 mt-2 w-44 rounded-lg border border-gray-100 bg-white py-2 shadow-lg"
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

        <button className="ml-5 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-black/10 transition hover:shadow-md">
          <IoBagOutline className="text-2xl" />
        </button>
      </div>
    </header>
  )
}
