import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import Logo from "../assets/Logo.png";

function Footer() {
  const quickLinks = [
    ["Home", "/"],
    ["Shop", "/shop"],
    ["Categories", "/categories"],
    ["About", "/about"],
    ["Contact", "/contact"],
  ];

  const categories = [
    "Earbuds",
    "Chargers",
    "Power Banks",
    "Smart Watches",
    "Cables",
    "Speakers",
  ];

  const FacebookIcon = () => (
    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="currentColor">
      <path d="M22 12a10 10 0 1 0-11.6 9.9v-7h-2.5V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.5v2h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z" />
    </svg>
  );

  const InstagramIcon = () => (
    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none">
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
    </svg>
  );

  const TikTokIcon = () => (
    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="currentColor">
      <path d="M16.6 5.2c-.7-.8-1.1-1.9-1.1-3.2h-3.1v13.1c0 1.4-1.1 2.5-2.5 2.5s-2.5-1.1-2.5-2.5 1.1-2.5 2.5-2.5c.3 0 .6.1.8.2V9.6c-.3 0-.5-.1-.8-.1-3.1 0-5.6 2.5-5.6 5.6s2.5 5.6 5.6 5.6 5.6-2.5 5.6-5.6V8.6c1.3.9 2.8 1.4 4.4 1.5V7c-1.3-.1-2.4-.7-3.3-1.8z" />
    </svg>
  );

  const socials = [
    {
      label: "Facebook",
      href: "https://www.facebook.com/share/17Z9s6hGNH/",
      Icon: FacebookIcon,
    },
    {
      label: "TikTok",
      href: "https://www.tiktok.com/@ravix.mobile.lk",
      Icon: TikTokIcon,
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/ravixmobile.lk?igsh=eXMweXdhbmRsdjRt",
      Icon: InstagramIcon,
    },
  ];

  return (
    <footer className="relative bg-[#05080B] border-t border-white/10 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px] opacity-60 pointer-events-none" />

      <div className="relative max-w-[1360px] mx-auto px-6 md:px-10 py-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <a href="/" className="flex items-center gap-3">
            <img
              src={Logo}
              alt="RaviX Logo"
              className="w-12 h-12 rounded-2xl object-contain shadow-[0_0_25px_rgba(32,191,255,0.35)]"
            />

            <div>
              <h2 className="text-white font-bold text-xl leading-none">
                Ravi<span className="text-[#20BFFF]">X</span>
              </h2>
              <p className="mt-2 text-[11px] tracking-[0.35em] text-gray-400 uppercase">
                Mobile Accessories
              </p>
            </div>
          </a>

          <p className="mt-6 max-w-xs text-gray-400 leading-relaxed">
            Premium mobile accessories at honest prices. Fast delivery, trusted
            service, lifetime support.
          </p>

          <div className="mt-6 flex gap-3">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:text-[#20BFFF] hover:border-[#20BFFF] hover:shadow-[0_0_20px_rgba(32,191,255,0.25)] transition"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6">Quick Links</h4>
          <ul className="space-y-3 text-gray-400">
            {quickLinks.map(([label, href]) => (
              <li key={href}>
                <a href={href} className="hover:text-[#20BFFF] transition">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6">Categories</h4>
          <ul className="space-y-3 text-gray-400">
            {categories.map((category) => (
              <li key={category}>
                <a
                  href="/categories"
                  className="hover:text-[#20BFFF] transition"
                >
                  {category}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6">Contact</h4>
          <ul className="space-y-4 text-gray-400">
            <li className="flex gap-4">
              <MapPin size={19} className="text-[#20BFFF] shrink-0 mt-1" />
              <span>Gampaha, Sri Lanka</span>
            </li>
            <li className="flex gap-4">
              <Phone size={18} className="text-[#20BFFF] shrink-0 mt-1" />
              <a
                href="tel:0703280480"
                className="hover:text-[#20BFFF] transition"
              >
                070 328 0480
              </a>
            </li>
            <li className="flex gap-4">
              <Mail size={18} className="text-[#20BFFF] shrink-0 mt-1" />
              <a
                href="mailto:ravixmobile.lk@gmail.com"
                className="hover:text-[#20BFFF] transition break-all"
              >
                ravixmobile.lk@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10 py-7 flex flex-col md:flex-row justify-between gap-3 text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()} RaviX Mobile Accessories. All rights
            reserved.
          </p>
          <p>
            Crafted with{" "}
            <a
              href="https://www.nexonick.com"
              target="_blank"
              rel="noreferrer"
              className="text-[#20BFFF] hover:underline"
            >
              nexonick Solutions
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
