import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer>
      {/* Footer */}
      <div className="bg-[#FE6F61] text-white">
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 flex items-center justify-center text-4xl md:text-6xl font-bold py-8 md:py-12 border-b md:border-b-0 md:border-r border-opacity-30 border-white">
            <div className="flex-shrink-0 text-center md:text-left">
              <Link to="/" className="text-4xl lg:text-5xl font-bold hover:opacity-90 transition-opacity">
                ROR
              </Link>
              <p className="text-xs text-gray-200 mt-1">Rooms On Rent</p>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center gap-4 py-8 md:py-12 border-b md:border-b-0 md:border-r border-opacity-30 border-white">
            <div className="text-center md:text-left">
              <p className="text-xl font-semibold mb-3">CONTACT US!</p>
              <div className="space-y-1 text-sm">
                <motion.a href="tel:+916207409628" className="block hover:underline" whileHover={{ scale: 1.05 }}>
                  +91 62074 09628
                </motion.a>
                <motion.a href="mailto:officialroomsonrent@gmail.com" className="block hover:underline truncate" whileHover={{ scale: 1.05 }}>
                  officialroomsonrent@gmail.com
                </motion.a>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center gap-4 py-8 md:py-12">
            <div className="text-center md:text-left">
              <p className="text-xl font-semibold mb-3">FOLLOW US!</p>
              <div className="flex justify-center md:justify-start gap-4">
                {[
                  { href: "https://twitter.com", src: "/images/media/icons8-twitter-bird.ebc67185.svg", alt: "Twitter" },
                  { href: "https://linkedin.com", src: "/images/media/icons8-linkedin.4a98e29e.svg", alt: "LinkedIn" },
                  { href: "https://instagram.com", src: "/images/media/icons8-instagram.2fe214cb.svg", alt: "Instagram" },
                  { href: "https://facebook.com", src: "/images/media/icons8-facebook.d9ed0702.svg", alt: "Facebook" },
                ].map(social => (
                  <motion.a
                    key={social.alt}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.alt}
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <img alt={social.alt} src={social.src} width="40" height="40" className="opacity-90 hover:opacity-100 transition-opacity" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="py-4 text-center text-sm bg-[#e55a4d] bg-opacity-50">
          <p>© 2025 Rooms On Rent. | <Link to="/privacy" className="hover:underline">Privacy Policy</Link> | <Link to="/terms" className="hover:underline">Terms of Use</Link></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 