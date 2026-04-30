import React from "react";
import {
  ArrowRight,
  Truck,
  ShieldCheck,
  Headphones,
  Sparkles,
  ShoppingCart,
  Star,
  Smartphone,
  Zap,
  Watch,
  MoveUpRight,
} from "lucide-react";

function Home() {
  const products = [
    {
      brand: "RAVIX",
      name: "Pulse Pro Wireless Earbuds",
      price: "$79.99",
      oldPrice: "$109.99",
      rating: "4.8",
      badge: "-27%",
      img: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=900",
    },
    {
      brand: "APPLE",
      name: "iPhone 15 Slim Matte Case",
      price: "$19.99",
      rating: "4.6",
      badge: "New",
      img: "https://images.unsplash.com/photo-1603313011102-320f26a4f6f6?q=80&w=900",
    },
    {
      brand: "SAMSUNG",
      name: "65W GaN Fast Charger",
      price: "$34.99",
      oldPrice: "$49.99",
      rating: "4.7",
      badge: "-30%",
      img: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=900",
    },
    {
      brand: "RAVIX",
      name: "20000mAh PD Power Bank",
      price: "$44.99",
      rating: "4.9",
      img: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?q=80&w=900",
    },
  ];

  const features = [
    [Truck, "Free Shipping", "On orders over $50"],
    [ShieldCheck, "2-Year Warranty", "On all RaviX products"],
    [Headphones, "24/7 Support", "Real humans, real fast"],
    [Sparkles, "Trusted Brands", "Apple, Samsung, Anker"],
  ];

  const categories = [
    [Smartphone, "Phone Cases", "Premium protection for every device", "124 products"],
    [Zap, "Chargers", "Fast charging for every need", "86 products"],
    [Headphones, "Earphones", "Crystal-clear wireless audio", "64 products"],
    [Watch, "Smart Watches", "Track. Connect. Perform.", "32 products"],
  ];

  return (
    <main className="min-h-screen bg-[#05080B] text-white overflow-hidden">
      {/* HERO */}
      <section className="relative pt-32 pb-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 blur-[140px]" />

        <div className="relative max-w-[1360px] mx-auto px-6 md:px-10 grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/5 px-4 py-2 text-sm text-cyan-400 mb-8">
              <Sparkles size={15} />
              New collection 2026 — up to 30% off
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight">
              Upgrade Your <br />
              <span className="text-cyan-400">Mobile Experience</span>
            </h1>

            <p className="mt-8 max-w-xl text-lg md:text-xl text-gray-400 leading-relaxed">
              Discover premium mobile accessories engineered for performance.
              Wireless audio, fast charging, smart wearables — all in one place.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="/shop"
                className="inline-flex items-center gap-3 rounded-full bg-cyan-400 px-8 py-4 text-black font-semibold shadow-[0_0_30px_rgba(34,211,238,0.35)] hover:bg-cyan-300 transition"
              >
                Shop Now <ArrowRight size={18} />
              </a>

              <a
                href="/categories"
                className="inline-flex items-center rounded-full border border-white/10 px-8 py-4 text-white font-semibold hover:border-cyan-400 hover:text-cyan-400 transition"
              >
                View Categories
              </a>
            </div>

            <div className="mt-10 pt-8 border-t border-white/10 flex gap-10">
              {[
                ["10K+", "Happy Customers"],
                ["500+", "Products"],
                ["4.9★", "Rating"],
              ].map(([num, label]) => (
                <div key={label}>
                  <h3 className="text-3xl font-bold text-cyan-400">{num}</h3>
                  <p className="text-sm text-gray-400">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-cyan-400/20 blur-[80px]" />
            <img
              src="https://images.unsplash.com/photo-1603539947678-cd3954ed515d?q=80&w=1400"
              alt="Mobile accessories"
              className="relative w-full rounded-[28px] shadow-2xl object-cover h-[360px] md:h-[430px]"
            />
          </div>
        </div>
      </section>

      {/* FEATURE STRIP */}
      <section className="relative max-w-[1360px] mx-auto px-6 md:px-10 -mt-4 z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 rounded-[28px] bg-[#0D111A] border border-white/10 p-6 shadow-xl">
          {features.map(([Icon, title, desc]) => (
            <div key={title} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-400/10 text-cyan-400 flex items-center justify-center">
                <Icon size={22} />
              </div>
              <div>
                <h4 className="font-semibold">{title}</h4>
                <p className="text-sm text-gray-400">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="max-w-[1360px] mx-auto px-6 md:px-10 py-28">
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="text-cyan-400 tracking-[0.35em] text-xs font-bold uppercase mb-4">
              — Featured
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold">Best Sellers</h2>
            <p className="mt-5 text-lg text-gray-400">
              Hand-picked accessories our customers can't get enough of.
            </p>
          </div>

          <a
            href="/shop"
            className="hidden md:inline-flex items-center gap-2 text-cyan-400 font-semibold hover:text-cyan-300"
          >
            View all <ArrowRight size={18} />
          </a>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <div
              key={p.name}
              className="group overflow-hidden rounded-2xl bg-[#090D14] border border-white/10 hover:border-cyan-400/40 transition"
            >
              <div className="relative h-[330px] bg-black">
                <img
                  src={p.img}
                  alt={p.name}
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-500"
                />

                {p.badge && (
                  <span className="absolute top-4 left-4 rounded-full border border-cyan-400 px-3 py-1 text-xs font-bold text-cyan-400 bg-black/60">
                    {p.badge}
                  </span>
                )}
              </div>

              <div className="p-6">
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <span className="tracking-widest">{p.brand}</span>
                  <span className="flex items-center gap-1">
                    <Star size={15} className="fill-cyan-400 text-cyan-400" />
                    {p.rating}
                  </span>
                </div>

                <h3 className="mt-4 font-bold text-lg">{p.name}</h3>

                <div className="mt-14 flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-cyan-400">
                      {p.price}
                    </span>
                    {p.oldPrice && (
                      <span className="ml-2 text-sm text-gray-500 line-through">
                        {p.oldPrice}
                      </span>
                    )}
                  </div>

                  <button className="w-11 h-11 rounded-full bg-cyan-400 text-black flex items-center justify-center hover:bg-cyan-300 transition">
                    <ShoppingCart size={19} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PROMO */}
      <section className="max-w-[1360px] mx-auto px-6 md:px-10">
        <div className="relative overflow-hidden rounded-[32px] border border-cyan-400/30 bg-gradient-to-r from-[#101723] via-[#0A1119] to-[#103947] p-10 md:p-16">
          <div className="absolute right-0 top-0 w-[420px] h-[420px] bg-cyan-400/20 blur-[120px]" />

          <div className="relative grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-block rounded-full bg-cyan-400 text-black px-4 py-2 text-xs font-extrabold">
                LIMITED OFFER
              </span>

              <h2 className="mt-6 text-4xl md:text-5xl font-extrabold leading-tight">
                Save up to <span className="text-cyan-400">30% off</span>
                <br />
                on premium accessories
              </h2>

              <p className="mt-6 text-gray-400 text-lg">
                Bundle deals on earbuds, chargers, and smartwatches. Limited
                stock — ends this month.
              </p>

              <a
                href="/shop"
                className="mt-7 inline-flex items-center gap-3 rounded-full bg-cyan-400 px-8 py-4 text-black font-semibold hover:bg-cyan-300 transition"
              >
                Grab the deal <ArrowRight size={18} />
              </a>
            </div>

            <div className="hidden md:block text-right text-[10rem] leading-none font-black text-cyan-400">
              30%
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-[1360px] mx-auto px-6 md:px-10 py-28">
        <div className="text-center mb-16">
          <p className="text-cyan-400 tracking-[0.35em] text-xs font-bold uppercase mb-4">
            — Browse
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold">
            Shop by Category
          </h2>
          <p className="mt-5 text-lg text-gray-400">
            Find exactly what you need across our curated collections.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(([Icon, title, desc, count]) => (
            <a
              key={title}
              href="/categories"
              className="group relative rounded-[28px] bg-[#090D14] border border-white/10 p-9 min-h-[250px] hover:border-cyan-400/40 transition"
            >
              <MoveUpRight
                size={22}
                className="absolute right-9 top-9 text-gray-400 group-hover:text-cyan-400"
              />

              <div className="w-16 h-16 rounded-2xl border border-cyan-400/40 bg-cyan-400/10 text-cyan-400 flex items-center justify-center">
                <Icon size={30} />
              </div>

              <h3 className="mt-12 text-2xl font-bold">{title}</h3>
              <p className="mt-3 text-gray-400">{desc}</p>
              <p className="mt-5 text-cyan-400 font-semibold">{count}</p>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;