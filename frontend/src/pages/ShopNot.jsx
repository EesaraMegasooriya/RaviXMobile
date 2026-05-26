import React from "react";
import { ShoppingBag, Clock } from "lucide-react";
import Logo from "../assets/Logo.png";

function ShopNot() {
  return (
    <main className="min-h-screen bg-[#05080B] text-white flex items-center justify-center px-6 pt-[92px]">
      <section className="w-full max-w-4xl text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src={Logo}
            alt="RaviX Logo"
            className="w-20 h-20 rounded-3xl object-contain shadow-[0_0_35px_rgba(32,191,255,0.35)]"
          />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#20BFFF]/30 bg-[#20BFFF]/10 text-[#20BFFF] text-sm font-medium mb-6">
          <Clock size={16} />
          Coming Soon
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-5">
          Shop Will Be{" "}
          <span className="text-[#20BFFF]">Available Soon</span>
        </h1>

        {/* Description */}
        <p className="max-w-2xl mx-auto text-gray-400 text-base md:text-lg leading-relaxed mb-10">
          We are getting our latest mobile accessories ready for you. 
          RaviX will soon bring you quality chargers, cases, cables, 
          earbuds, and more.
        </p>

        {/* Card */}
        <div className="max-w-xl mx-auto rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-[0_0_35px_rgba(32,191,255,0.08)]">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#20BFFF] flex items-center justify-center shadow-[0_0_25px_rgba(32,191,255,0.35)] mb-5">
            <ShoppingBag size={30} className="text-black" />
          </div>

          <h2 className="text-2xl font-semibold mb-3">
            New Products Are On The Way
          </h2>

          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            Our online shop is currently being updated. Please check back soon
            to explore the full RaviX mobile accessories collection.
          </p>
        </div>

        {/* Button */}
        <div className="mt-10">
          <a
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-[#20BFFF] text-black font-semibold hover:bg-[#4DCCFF] transition-colors shadow-[0_0_25px_rgba(32,191,255,0.35)]"
          >
            Back to Home
          </a>
        </div>
      </section>
    </main>
  );
}

export default ShopNot;