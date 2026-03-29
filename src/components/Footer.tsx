import { Link } from "react-router";

import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
export default function Footer() {
  return (
    <footer className="bg-[#050505] py-16 border-t border-white/5 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                G
              </div>
              <span className="text-xl font-black tracking-tighter text-white uppercase italic">
                Game<span className="text-blue-500">Vault</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Exploring the digital frontier. Built with React, Tailwind, and
              RAWG API.
            </p>

            {/* Social Icons with Tooltips or better Hover states */}
            <div className="flex gap-4">
              {/* Replace your SVGs with Lucide-react or keep yours, but add better transitions */}
              <a
                href="https://github.com/Wesam-Harb"
                className="text-gray-500 hover:text-white transition-all transform hover:-translate-y-1"
              >
                <GitHubIcon />
              </a>
              <a
                href="https://linkedin.com/in/wesam-harb-30333129wh"
                className="text-gray-500 hover:text-blue-400 transition-all transform hover:-translate-y-1"
              >
                <LinkedInIcon />
              </a>
            </div>
          </div>

          {/* Dynamic Navigation */}
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-widest mb-6">
              Discovery
            </h4>
            <ul className="text-gray-500 text-sm space-y-3">
              <li>
                <Link
                  to="/Browsegames?platform=pc"
                  className="hover:text-blue-500 transition-colors"
                >
                  PC Master Race
                </Link>
              </li>
              <li>
                <Link
                  to="/Browsegames?platform=playstation5"
                  className="hover:text-blue-500 transition-colors"
                >
                  PlayStation 5
                </Link>
              </li>
              <li>
                <Link
                  to="/Browsegames?platform=xbox-series-x"
                  className="hover:text-blue-500 transition-colors"
                >
                  Xbox Series X
                </Link>
              </li>
            </ul>
          </div>

          {/* API Reference (Shows you understand the tech stack) */}
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-widest mb-6">
              Data Source
            </h4>
            <p className="text-gray-500 text-xs mb-4">
              Powered by RAWG Video Games Database API.
            </p>
            <a
              href="https://rawg.io/apidocs"
              target="_blank"
              className="text-blue-500 hover:underline text-xs"
            >
              API Documentation →
            </a>
          </div>

          {/* Credits Section */}
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-widest mb-6">
              Project
            </h4>
            <p className="text-gray-500 text-xs italic">
              "This project is a showcase of frontend architecture and
              responsive design patterns."
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-[10px] font-medium tracking-widest uppercase">
            © 2026 Wesam Harb • MISSION ACCOMPLISHED.
          </p>

          {/* Animated Server Status */}
          <div className="flex items-center gap-6">
            <span className="text-gray-600 text-[10px] font-bold uppercase flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]"></span>
              API Status: Stable
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
