import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosMenu } from "react-icons/io";
import { IoSearch, IoBagOutline } from "react-icons/io5";
import { RiUserLine } from "react-icons/ri";
import Logo from '../assets/Logo-Essenza.png'
import { useAuth } from "../context/AuthContext";


export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate()
  const [openUserMenu, setOpenUserMenu] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setOpenUserMenu(false);
      }
    }
    if (openUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openUserMenu]);

  return (
   <header className="flex items-center justify-between h-24 px-10 border-b border-gray-100 bg-white">
      <div className="flex items-center max-w-md gap-6 flex-1">
        <button
          className="text-2xl mr-2 cursor-pointer hover:text-[#00843d]"
          aria-label="Abrir menu de navegação"
        >
          <IoIosMenu />
        </button>
        <form role="search" className="hidden md:flex items-center rounded-[5px] border border-black/10 px-3 py-1 w-full max-w-xs h-12 bg-gray-50">
          <IoSearch className="text-gray-400 text-lg mr-2" />
          <input
            type="text"
            placeholder="Buscar produtos..."
            className="bg-transparent border-none outline-none flex-1 text-sm"
          />
        </form>
      </div>

      <div className="flex-1 flex justify-center">
        <Link to={"/"}>
          <img
            src={Logo}
            alt="Logo"
            className="w-full max-w-[220px]"
          />
        </Link>
      </div>

      <div className="flex items-center gap-6 flex-1 justify-end">
          <div className="relative" ref={userMenuRef}>
          <button
            className="flex items-center justify-center rounded-full border border-black/10 w-10 h-10 ml-5 cursor-pointer hover:shadow-md transition"
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
              className="absolute right-0 mt-2 w-44 rounded-lg shadow-lg bg-white border border-gray-100 z-50 py-2"
            >
            {!user && (
              <>
                <Link
                  to="/create-user"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#00843d] hover:text-white transition"
                  onClick={() => setOpenUserMenu(false)}
                >
                  Criar conta
                </Link>
                <Link
                  to="/login"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#00843d] hover:text-white transition"
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
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#00843d] hover:text-white transition"
                onClick={() => setOpenUserMenu(false)}
              >
                Minha conta
              </Link>
              <button
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition cursor-pointer"
                onClick={async () => {
                  setOpenUserMenu(false);
                  await logout();
                  navigate("/");
                }}
              >
                Sair
              </button>
            </>
            )}
            </div>
          )}
        </div>

          <button className="flex items-center justify-center rounded-full border border-black/10 w-10 h-10 ml-5 cursor-pointer hover:shadow-md transition">
            <IoBagOutline className="text-2xl" />
          </button>
      </div>
    </header>
  );
}