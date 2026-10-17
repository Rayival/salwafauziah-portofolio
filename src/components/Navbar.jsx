import React from 'react';
import { Lock } from 'lucide-react';

export default function Navbar({ onOpenAdmin }) {
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
          <a href="#tentang-saya" className="text-sm font-bold text-[#00236f] bg-[#e5eeff] px-3 py-1.5 rounded-lg shadow-sm">Tentang Saya</a>
          <a href="#pendidikan" className="text-sm font-medium text-[#444651] hover:text-[#00236f] transition-colors py-1.5 px-3 rounded-lg hover:bg-[#eff4ff]">Pendidikan</a>
          <a href="#proyek-riset" className="text-sm font-medium text-[#444651] hover:text-[#00236f] transition-colors py-1.5 px-3 rounded-lg hover:bg-[#eff4ff]">Portofolio</a>
          <a href="#kontak" className="text-sm font-medium text-[#444651] hover:text-[#00236f] transition-colors py-1.5 px-3 rounded-lg hover:bg-[#eff4ff]">Kontak</a>
        </nav>

        {/* Tombol Admin Portal */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenAdmin} 
            className="p-2 rounded-lg text-[#565e74] hover:text-[#00236f] hover:bg-[#dce9ff] transition-colors flex items-center gap-1.5 border border-slate-200 text-xs font-semibold px-3" 
            title="Admin Portal"
          >
            <Lock size={16} />
            <span className="hidden sm:inline">Admin</span>
          </button>
          
          <div className="w-8 h-8 rounded-full ring-2 ring-blue-200 overflow-hidden bg-slate-200">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-Z9BPMjQydtqQ8MIteqDfc9Sd7LuiZW6AyzDEqMFnXDDfaAN-RxTb9P9VCU9h6tlvR_apV0-dlkix-uyQ4hLXWx-aqSewVzRXqnlK7bWme5Cwy_rz81eYTA4qLqm2BLH4dpJOsURzVDJxajMhk5aZyEvwzk7924EUvXYzuGGIlb0qgVxc-cxtm0vrmOBD57ijiEIJpMppeQ3EninRx5A6X6V5peD7cXN6b826rLXESCN-KgP49q6lgg" alt="Salwa Fauziah" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  );
}