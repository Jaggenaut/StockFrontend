"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, UserCog, LogOut, Menu } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/Home" },
    { name: "Portfolio", path: "/" },
    { name: "Mutual Funds", path: "/mutual-funds" },
    { name: "Tools", path: "/tools" },
    { name: "Transactions", path: "/transactions" },
  ];

  return (
    <div className="flex justify-between items-center h-[60px] bg-gray-900 px-6 shadow-md rounded-b-2xl">
      {/* Logo */}
      <div className="flex items-center">
        <Image
          src="/icon.png"
          alt="Logo"
          width={30}
          height={30}
          className="cursor-pointer"
        />
      </div>

      {/* Mobile Menu Button */}
      <div
        className="md:hidden cursor-pointer text-gray-400 hover:text-white"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <Menu size={24} />
      </div>

      {/* Navigation Links */}
      <div
        className={`h-full md:flex space-x-6 ${
          isMenuOpen
            ? "absolute top-16 left-0 w-full bg-gray-900 p-4 flex flex-col space-y-4"
            : "hidden md:flex"
        }`}
      >
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.path}
            onClick={() => setIsMenuOpen(false)}
          >
            <div
              className={`h-full flex items-center cursor-pointer text-sm transition-all duration-300 ${
                pathname === link.path
                  ? "text-white border-b-2 border-blue-500"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {link.name}
            </div>
          </Link>
        ))}
      </div>
      <div></div>
      <div></div>

      {/* Icons Section */}
      <div className="hidden md:flex space-x-4 text-gray-400">
        <div className="relative cursor-pointer hover:text-white">
          <Search size={18} />
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </div>
        <div className="cursor-pointer hover:text-white">
          <Bell size={18} />
        </div>
        <div className="cursor-pointer hover:text-white">
          <UserCog size={18} />
        </div>
        <div className="cursor-pointer hover:text-white">
          <LogOut size={18} />
        </div>
      </div>
    </div>
  );
}
