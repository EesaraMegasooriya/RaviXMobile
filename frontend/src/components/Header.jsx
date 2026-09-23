import React, { useEffect, useState } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../assets/Logo.png";

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const links = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Categories", href: "/categories" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href) =>
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);

  // Close the mobile menu on route change so it doesn't stay open after navigating.
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/[0.06] bg-[#05080B]/95 backdrop-blur-sm">
      <nav className="mx-auto flex h-20 max-w-[1360px] items-center justify-between px-6 md:px-10">
        <Link to="/" className="flex items-center gap-3">
          <img src={Logo} alt="RaviX Logo" className="h-10 w-10 rounded-xl object-contain" />
          <span className="text-lg font-bold leading-none text-white">
            Ravi<span className="text-cyan-300">X</span>
          </span>
        </Link>

        {/* Desktop menu */}
        <ul className="hidden items-center gap-9 md:flex">
          {links.map((link) => {
            const active = isActive(link.href);
            return (
              <li key={link.name}>
                <Link
                  to={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`text-sm font-medium transition-colors ${
                    active ? "text-cyan-300" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-5">
          <Link
            to="/shop"
            aria-label="Browse shop"
            className="text-gray-300 transition-colors hover:text-cyan-300"
          >
            <ShoppingCart size={21} strokeWidth={2} />
          </Link>

          <button
            onClick={() => setMobileOpen((open) => !open)}
            className="text-gray-300 transition-colors hover:text-cyan-300 md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden border-t border-white/[0.06] bg-[#05080B] transition-[max-height] duration-200 ease-out md:hidden ${
          mobileOpen ? "max-h-80" : "max-h-0 border-t-0"
        }`}
      >
        <ul className="flex flex-col px-6">
          {links.map((link) => {
            const active = isActive(link.href);
            return (
              <li key={link.name} className="border-b border-white/[0.06] last:border-none">
                <Link
                  to={link.href}
                  className={`block py-4 text-base font-medium ${
                    active ? "text-cyan-300" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}

export default Header;