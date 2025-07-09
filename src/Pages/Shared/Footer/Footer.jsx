import React from "react";
import LogoSection from "../Logo Section/LogoSection";

const socialLinks = [
  {
    name: "Facebook",
    href: "https://facebook.com/yourprofile",
    svgPath: "M18 2h-3a6 6 0 00-6 6v3H6v4h3v8h4v-8h3l1-4h-4V8a1 1 0 011-1h3z",
    color: "hover:text-blue-600",
  },
  {
    name: "Twitter",
    href: "https://twitter.com/yourprofile",
    svgPath:
      "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z",
    color: "hover:text-blue-400",
  },
  {
    name: "Instagram",
    href: "https://instagram.com/yourprofile",
    svgPath:
      "M7 2C4.79 2 3 3.79 3 6v12c0 2.21 1.79 4 4 4h10c2.21 0 4-1.79 4-4V6c0-2.21-1.79-4-4-4H7zM12 7a5 5 0 110 10 5 5 0 010-10zm0 8a3 3 0 100-6 3 3 0 000 6zm5-9.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z",
    color: "hover:text-pink-500",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/yourprofile",
    svgPath:
      "M16 8a6 6 0 016 6v6h-4v-6a2 2 0 00-4 0v6h-4v-6a6 6 0 016-6zM2 9h4v12H2zM4 3a2 2 0 110 4 2 2 0 010-4z",
    color: "hover:text-blue-700",
  },
];

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Logo Section */}
        <LogoSection></LogoSection>

        {/* Social Media Links */}
        <div className="flex gap-6 text-gray-400">
          {socialLinks.map(({ name, href, svgPath, color }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={name}
              className={`transition-colors duration-300 ${color}`}
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d={svgPath} />
              </svg>
            </a>
          ))}
        </div>

        {/* Footer Links */}
        <nav className="flex gap-6 text-sm text-gray-400">
          <a href="/about" className="hover:text-pink-400 transition">
            About Us
          </a>
          <a href="/adopt" className="hover:text-pink-400 transition">
            Adopt
          </a>
          <a href="/donate" className="hover:text-pink-400 transition">
            Donate
          </a>
          <a href="/contact" className="hover:text-pink-400 transition">
            Contact
          </a>
        </nav>

        {/* Copyright */}
        <div className="text-xs text-gray-500 select-none mt-6 md:mt-0">
          &copy; {new Date().getFullYear()} PetHaven. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
