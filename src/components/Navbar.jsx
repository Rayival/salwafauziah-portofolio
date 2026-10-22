import React, { useState } from 'react';
import { Lock, Menu, X } from 'lucide-react';
import defaultProfileImg from '../assets/SalwaF.jpeg';

export default function Navbar({ onOpenAdmin, profileImage }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#f8f9ff]/90 backdrop-blur-xl border-b border-blue-100/60 shadow-[0_1px_12px_rgba(0,35,111,0.06)]">
      <div className="h-20 max-w-[1200px] mx-auto px-6 flex items-center justify-between">
        
        {/* Logo & Title */}
        <a href="#" className="flex items-center gap-3 group transition-opacity hover:opacity-90">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-[#00236f] tracking-tight">SALWA FAUZIAH</span>
            <span className="text-[0.75rem] text-[#565e74] uppercase tracking-widest font-semibold">Manajemen · Universitas Siliwangi</span>
          </div>
        </a>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-2">
          <a href="#tentang-saya" className="text-sm font-bold text-[#00236f] bg-[#e5eeff] px-3.5 py-1.5 rounded-lg shadow-sm transition hover:bg-[#dce9ff]">Tentang Saya</a>
          <a href="#pendidikan" className="text-sm font-medium text-[#444651] hover:text-[#00236f] transition-colors py-1.5 px-3.5 rounded-lg hover:bg-[#eff4ff]">Pendidikan</a>
          <a href="#proyek-riset" className="text-sm font-medium text-[#444651] hover:text-[#00236f] transition-colors py-1.5 px-3.5 rounded-lg hover:bg-[#eff4ff]">Portofolio</a>
          <a href="#kontak" className="text-sm font-medium text-[#444651] hover:text-[#00236f] transition-colors py-1.5 px-3.5 rounded-lg hover:bg-[#eff4ff]">Kontak</a>
        </nav>

        {/* Tombol Admin & Profil */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenAdmin} 
            className="p-2 rounded-lg text-[#565e74] hover:text-[#00236f] hover:bg-[#dce9ff] transition-colors flex items-center gap-1.5 border border-slate-200 text-xs font-semibold px-3 cursor-pointer shadow-sm" 
            title="Admin Portal"
          >
            <Lock size={16} />
            <span className="hidden sm:inline">Admin</span>
          </button>
          
          <div className="w-9 h-9 rounded-full ring-2 ring-blue-200 overflow-hidden bg-slate-200 shadow-sm">
            <img 
              src={profileImage || defaultProfileImg} 
              alt="Salwa Fauziah" 
              className="w-full h-full object-cover" 
            />
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="lg:hidden p-2 text-[#00236f] hover:bg-blue-100 rounded-lg transition"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-blue-100 px-6 py-4 flex flex-col gap-3 shadow-lg animate-fadeIn">
          <a href="#tentang-saya" onClick={() => setIsOpen(false)} className="text-sm font-bold text-[#00236f] py-2 px-3 rounded-lg bg-[#e5eeff]">Tentang Saya</a>
          <a href="#pendidikan" onClick={() => setIsOpen(false)} className="text-sm font-medium text-[#444651] py-2 px-3 rounded-lg hover:bg-[#eff4ff]">Pendidikan</a>
          <a href="#proyek-riset" onClick={() => setIsOpen(false)} className="text-sm font-medium text-[#444651] py-2 px-3 rounded-lg hover:bg-[#eff4ff]">Portofolio</a>
          <a href="#kontak" onClick={() => setIsOpen(false)} className="text-sm font-medium text-[#444651] py-2 px-3 rounded-lg hover:bg-[#eff4ff]">Kontak</a>
        </div>
      )}
    </header>
  );
}