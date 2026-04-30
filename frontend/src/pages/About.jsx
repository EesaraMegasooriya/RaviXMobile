import React from "react";
import { Award, Truck, Shield, Heart, Star } from "lucide-react";

function About() {
  const reasons = [
    {
      icon: Award,
      title: "Premium Quality",
      desc: "Hand-tested products from trusted brands worldwide.",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      desc: "Same-day dispatch with tracked, insured shipping.",
    },
    {
      icon: Shield,
      title: "2-Year Warranty",
      desc: "Confidence with every purchase, hassle-free returns.",
    },
    {
      icon: Heart,
      title: "Customer Love",
      desc: "10,000+ five-star reviews from happy customers.",
    },
  ];

  const reviews = [
    {
      name: "Aarav K.",
      text: "RaviX earbuds blew me away — the sound is crystal clear and the bass is rich. Delivery was lightning fast.",
      rating: 5,
    },
    {
      name: "Priya M.",
      text: "Best place to buy accessories online. Genuine products at honest prices. Customer service is top notch.",
      rating: 5,
    },
    {
      name: "Rohan S.",
      text: "I've ordered chargers, cables, and a power bank — all premium quality. Will definitely shop here again.",
      rating: 5,
    },
  ];

  const brands = ["Apple", "Samsung", "Anker", "RaviX", "Phison"];

  return (
    <main className="min-h-screen bg-[#05080B] text-white overflow-hidden">
      {/* HERO */}
      <section className="relative pt-36 pb-24">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px] opacity-60" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#20BFFF]/10 blur-[140px]" />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <p className="text-[#20BFFF] text-xs font-bold tracking-[0.35em] uppercase mb-5">
            About RaviX
          </p>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
            Powering your devices with{" "}
            <span className="text-[#20BFFF]">premium accessories</span>
          </h1>

          <p className="mt-7 text-lg text-gray-400 leading-relaxed">
            RaviX Mobile Accessories was founded with a simple mission: deliver
            high-quality mobile accessories at honest prices, backed by fast
            service you can trust. From earbuds to power banks, every product
            passes our quality checklist before it ships.
          </p>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="max-w-[1360px] mx-auto px-6 md:px-10 py-24">
        <div className="text-center mb-14">
          <p className="text-[#20BFFF] text-xs font-bold tracking-[0.35em] uppercase mb-4">
            — Why Us
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold">
            Why Choose RaviX
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-[28px] bg-[#090D14] border border-white/10 p-7 hover:border-[#20BFFF]/50 hover:shadow-[0_0_35px_rgba(32,191,255,0.12)] transition"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#20BFFF]/10 border border-[#20BFFF]/30 text-[#20BFFF] flex items-center justify-center mb-6">
                <Icon size={26} />
              </div>

              <h3 className="text-xl font-bold">{title}</h3>
              <p className="mt-3 text-gray-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DELIVERY INFO */}
      <section className="max-w-[1360px] mx-auto px-6 md:px-10">
        <div className="rounded-[32px] bg-gradient-to-r from-[#101723] via-[#0A1119] to-[#103947] border border-white/10 p-10 md:p-14 grid md:grid-cols-3 gap-10">
          {[
            ["24h", "Order Processing"],
            ["2-5 Days", "Standard Delivery"],
            ["Free", "Shipping over $50"],
          ].map(([number, label]) => (
            <div key={label} className="text-center">
              <h3 className="text-5xl md:text-6xl font-black text-[#20BFFF]">
                {number}
              </h3>
              <p className="mt-3 text-gray-400">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TRUSTED BRANDS */}
      <section className="max-w-[1360px] mx-auto px-6 md:px-10 py-24">
        <div className="text-center mb-14">
          <p className="text-[#20BFFF] text-xs font-bold tracking-[0.35em] uppercase mb-4">
            — Partners
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold">
            Trusted Brands
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {brands.map((brand) => (
            <div
              key={brand}
              className="px-9 py-5 rounded-2xl bg-[#090D14] border border-white/10 text-lg font-bold hover:border-[#20BFFF] hover:text-[#20BFFF] transition"
            >
              {brand}
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section className="max-w-[1360px] mx-auto px-6 md:px-10 pb-24">
        <div className="text-center mb-14">
          <p className="text-[#20BFFF] text-xs font-bold tracking-[0.35em] uppercase mb-4">
            — Reviews
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold">
            What customers say
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <figure
              key={review.name}
              className="rounded-[28px] bg-[#090D14] border border-white/10 p-7 hover:border-[#20BFFF]/50 hover:shadow-[0_0_35px_rgba(32,191,255,0.12)] transition"
            >
              <div className="flex gap-1 mb-5">
                {Array.from({ length: review.rating }).map((_, index) => (
                  <Star
                    key={index}
                    size={18}
                    className="text-[#20BFFF] fill-[#20BFFF]"
                  />
                ))}
              </div>

              <blockquote className="text-gray-300 leading-relaxed">
                “{review.text}”
              </blockquote>

              <figcaption className="mt-6 pt-5 border-t border-white/10 font-bold">
                {review.name}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </main>
  );
}

export default About;