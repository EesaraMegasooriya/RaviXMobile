import React, { useState } from "react";
import {
  Headphones,
  BatteryCharging,
  Watch,
  Cable,
  Speaker,
  Zap,
  Filter,
} from "lucide-react";

function Categories() {
  const [activeCategory, setActiveCategory] = useState("All products");

  const categories = [
    {
      name: "All products",
      icon: Filter,
      description: "Browse every RaviX mobile accessory in one place.",
    },
    {
      name: "Earbuds",
      icon: Headphones,
      description: "Wireless earbuds for music, calls, and daily use.",
    },
    {
      name: "Chargers",
      icon: Zap,
      description: "Fast and reliable chargers for your devices.",
    },
    {
      name: "Power banks",
      icon: BatteryCharging,
      description: "Portable power for travel, work, and emergencies.",
    },
    {
      name: "Smart watches",
      icon: Watch,
      description: "Smart wearables for fitness, calls, and notifications.",
    },
    {
      name: "Cables",
      icon: Cable,
      description: "Durable charging and data cables for all devices.",
    },
    {
      name: "Speakers",
      icon: Speaker,
      description: "Portable speakers with powerful sound quality.",
    },
  ];

  const filteredCategories =
    activeCategory === "All products"
      ? categories.filter((category) => category.name !== "All products")
      : categories.filter((category) => category.name === activeCategory);

  return (
    <main className="min-h-screen bg-[#05080B] text-white px-6 pt-[140px] pb-20">
      <section className="max-w-[1360px] mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[#20BFFF] text-sm font-semibold tracking-[0.35em] uppercase mb-4">
            Shop
          </p>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-5">
            Product <span className="text-[#20BFFF]">Categories</span>
          </h1>

          <p className="max-w-2xl mx-auto text-gray-400 text-base md:text-lg leading-relaxed">
            Find the right mobile accessories by filtering through our main
            RaviX product categories.
          </p>
        </div>

        {/* Filter Section */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8 shadow-[0_0_35px_rgba(32,191,255,0.08)] mb-12">
          <div className="flex flex-col md:flex-row md:items-center gap-5">
            <h2 className="text-lg font-semibold text-white whitespace-nowrap">
              Filter by:
            </h2>

            <div className="flex flex-wrap gap-3">
              {categories.map((category) => {
                const isActive = activeCategory === category.name;

                return (
                  <button
                    key={category.name}
                    onClick={() => setActiveCategory(category.name)}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                      isActive
                        ? "bg-[#20BFFF] text-black border-[#20BFFF] shadow-[0_0_20px_rgba(32,191,255,0.35)]"
                        : "bg-white/[0.04] text-gray-300 border-white/10 hover:text-[#20BFFF] hover:border-[#20BFFF]/50"
                    }`}
                  >
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => {
            const Icon = category.icon;

            return (
              <div
                key={category.name}
                className="group rounded-3xl border border-white/10 bg-white/[0.03] p-8 hover:border-[#20BFFF]/50 hover:shadow-[0_0_35px_rgba(32,191,255,0.12)] transition-all"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#20BFFF] flex items-center justify-center shadow-[0_0_25px_rgba(32,191,255,0.35)] mb-6">
                  <Icon size={30} className="text-black" />
                </div>

                <h3 className="text-2xl font-semibold mb-3 group-hover:text-[#20BFFF] transition-colors">
                  {category.name}
                </h3>

                <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                  {category.description}
                </p>

                <div className="mt-6">
                  <a
                    href="/shop"
                    className="inline-flex items-center text-[#20BFFF] text-sm font-semibold hover:underline"
                  >
                    View products
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

export default Categories;