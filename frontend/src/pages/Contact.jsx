import React from "react";
import { Mail, MapPin, Phone, MessageCircle } from "lucide-react";

const SURFACE = "border border-white/[0.06] bg-[#0B0F16]";
const RADIUS = "rounded-2xl";

function Contact() {
  const contactDetails = [
    {
      title: "Telephone",
      value: "070 328 0480",
      href: "tel:0703280480",
      icon: Phone,
    },
    {
      title: "Email",
      value: "ravixmobile.lk@gmail.com",
      href: "mailto:ravixmobile.lk@gmail.com",
      icon: Mail,
    },
    {
      title: "Location",
      value: "Gampaha, Sri Lanka",
      href: "https://share.google/CFlGAfNpskxLBe87z",
      icon: MapPin,
    },
  ];

  return (
    <main className="min-h-screen bg-[#05080B] px-6 pb-24 pt-32 text-white md:pt-40">
      <section className="mx-auto max-w-[1360px]">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h1 className="text-4xl font-bold leading-tight md:text-6xl">
            Get in <span className="text-cyan-300">touch</span>
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-gray-400">
            Have a question about RaviX mobile accessories? Reach us by phone,
            email, or visit us in Gampaha, Sri Lanka.
          </p>
        </div>

        {/* Contact details */}
        <div className={`mb-14 grid divide-y divide-white/[0.06] sm:grid-cols-3 sm:divide-y-0 sm:divide-x ${SURFACE} ${RADIUS}`}>
          {contactDetails.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.title}
                href={item.href}
                target={item.title === "Location" ? "_blank" : undefined}
                rel={item.title === "Location" ? "noreferrer" : undefined}
                className="group flex items-center gap-4 px-7 py-6 transition hover:bg-white/[0.02]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-400/5 text-cyan-300">
                  <Icon size={19} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-gray-500">{item.title}</p>
                  <p className="truncate font-medium group-hover:text-cyan-300">{item.value}</p>
                </div>
              </a>
            );
          })}
        </div>

        {/* Main contact box */}
        <div className={`mx-auto max-w-2xl ${RADIUS} ${SURFACE} p-9 text-center md:p-12`}>
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400">
            <MessageCircle size={22} className="text-black" />
          </div>

          <h2 className="text-2xl font-bold md:text-3xl">Need help choosing accessories?</h2>

          <p className="mx-auto mt-4 max-w-md leading-relaxed text-gray-400">
            Ask about product availability, recommendations, or compatibility —
            we'll help you find the right fit for your device.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="tel:0703280480"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-400 px-7 py-3 font-semibold text-black transition hover:bg-cyan-300"
            >
              <Phone size={17} />
              Call now
            </a>
            <a
              href="mailto:ravixmobile.lk@gmail.com"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-7 py-3 font-semibold text-gray-300 transition hover:border-cyan-400/40 hover:text-cyan-300"
            >
              <Mail size={17} />
              Send email
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;