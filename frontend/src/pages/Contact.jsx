import React from "react";
import { Mail, MapPin, Phone, MessageCircle } from "lucide-react";
import Logo from "../assets/Logo.png";

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
      href: "https://www.google.com/maps/search/?api=1&query=Gampaha,Sri+Lanka",
      icon: MapPin,
    },
  ];

  return (
    <main className="min-h-screen bg-[#05080B] text-white px-6 pt-[140px] pb-20">
      <section className="max-w-[1360px] mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img
              src={Logo}
              alt="RaviX Logo"
              className="w-20 h-20 rounded-3xl object-contain shadow-[0_0_35px_rgba(32,191,255,0.35)]"
            />
          </div>

          <p className="text-[#20BFFF] text-sm font-semibold tracking-[0.35em] uppercase mb-4">
            Contact
          </p>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-5">
            Get In <span className="text-[#20BFFF]">Touch</span>
          </h1>

          <p className="max-w-2xl mx-auto text-gray-400 text-base md:text-lg leading-relaxed">
            Have a question about RaviX mobile accessories? Contact us through
            phone, email, or visit us in Gampaha, Sri Lanka.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {contactDetails.map((item) => {
            const Icon = item.icon;

            return (
              <a
                key={item.title}
                href={item.href}
                target={item.title === "Location" ? "_blank" : undefined}
                rel={item.title === "Location" ? "noreferrer" : undefined}
                className="group rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center hover:border-[#20BFFF]/50 hover:shadow-[0_0_35px_rgba(32,191,255,0.12)] transition-all"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-[#20BFFF] flex items-center justify-center shadow-[0_0_25px_rgba(32,191,255,0.35)] mb-6">
                  <Icon size={30} className="text-black" />
                </div>

                <h2 className="text-xl font-semibold mb-3 group-hover:text-[#20BFFF] transition-colors">
                  {item.title}
                </h2>

                <p className="text-gray-400 text-sm md:text-base break-words">
                  {item.value}
                </p>
              </a>
            );
          })}
        </div>

        {/* Main Contact Box */}
        <div className="max-w-3xl mx-auto rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:p-10 text-center shadow-[0_0_35px_rgba(32,191,255,0.08)]">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#20BFFF] flex items-center justify-center shadow-[0_0_25px_rgba(32,191,255,0.35)] mb-6">
            <MessageCircle size={30} className="text-black" />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Need Help Choosing Accessories?
          </h2>

          <p className="text-gray-400 leading-relaxed mb-8">
            Contact RaviX for product availability, recommendations, and mobile
            accessory inquiries. We are ready to help you find the best products
            for your device.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="tel:0703280480"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-[#20BFFF] text-black font-semibold hover:bg-[#4DCCFF] transition-colors shadow-[0_0_25px_rgba(32,191,255,0.35)]"
            >
              <Phone size={18} />
              Call Now
            </a>

            <a
              href="mailto:ravixmobile.lk@gmail.com"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full border border-[#20BFFF]/40 text-[#20BFFF] font-semibold hover:bg-[#20BFFF]/10 transition-colors"
            >
              <Mail size={18} />
              Send Email
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;