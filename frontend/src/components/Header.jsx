import React, { useState } from "react";
import { Menu, ShoppingCart, X } from "lucide-react";

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Categories", href: "/categories" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#05080B] border-b border-white/5">
      <nav className="max-w-[1360px] mx-auto h-[92px] px-6 md:px-10 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#20BFFF] flex items-center justify-center shadow-[0_0_25px_rgba(32,191,255,0.35)]">
            <span className="text-black font-bold text-lg">R</span>
          </div>

          <div>
            <h1 className="text-white font-bold text-xl leading-none">
              Ravi<span className="text-[#20BFFF]">X</span>
            </h1>
            <p className="mt-2 text-[11px] tracking-[0.35em] text-gray-400 uppercase">
              Mobile Accessories
            </p>
          </div>
        </a>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map((link, index) => (
            <li key={link.name}>
              <a
                href={link.href}
                className={`relative pb-4 text-[15px] font-medium transition-colors ${
                  index === 0
                    ? "text-[#20BFFF]"
                    : "text-gray-400 hover:text-[#20BFFF]"
                }`}
              >
                {link.name}

                {index === 0 && (
                  <span className="absolute left-0 right-0 -bottom-0 h-[2px] bg-[#20BFFF] rounded-full" />
                )}
              </a>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            className="relative text-white hover:text-[#20BFFF] transition-colors"
            aria-label="Open cart"
          >
            <ShoppingCart size={22} strokeWidth={2} />
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-white hover:text-[#20BFFF] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#05080B] border-t border-white/10 px-6 pb-6">
          <ul className="flex flex-col gap-1">
            {links.map((link, index) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block py-4 text-base font-medium border-b border-white/5 ${
                    index === 0
                      ? "text-[#20BFFF]"
                      : "text-gray-400 hover:text-[#20BFFF]"
                  }`}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

export default Header;