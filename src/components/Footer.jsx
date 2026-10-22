import React from 'react';
import { MapPin, Mail, Globe, Share2, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-gradient-to-b from-[#f4f7fc] to-[#e8edfc] mt-20 border-t border-blue-200/60 relative overflow-hidden text-[#0b1c30]">
      {/* Garis aksen kilau dekoratif di atas */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>

      <div className="max-w-[1200px] mx-auto px-6 py-12 md:py-16 flex flex-col gap-10">
        
        {/* Bagian Utama */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          
          {/* Identitas / Kiri */}
          <div className="flex flex-col gap-3 max-w-md w-full">
            <div className="flex items-center gap-3">
              <span className="text-xl font-extrabold tracking-tight text-[#00236f]">Salwa Fauziah</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Mahasiswa Program Studi Manajemen, Fakultas Ekonomi dan Bisnis, Universitas Siliwangi. Berfokus pada eksplorasi ilmu bisnis dan pengembangan profesional.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-1">
              <MapPin size={15} className="text-[#00236f] shrink-0" />
              <span>Tasikmalaya, Jawa Barat, Indonesia</span>
            </div>
          </div>
          
          {/* Tautan Sosial Media & Tombol Kembali ke Atas / Kanan */}
          <div className="flex flex-col items-start md:items-end gap-5 w-full md:w-auto">
            
            {/* Tombol Tautan */}
            <div className="flex items-center gap-2.5 flex-wrap w-full md:w-auto">
              <a 
                href="https://www.linkedin.com/in/salwa-fauziah-835842433" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs font-bold text-slate-700 hover:text-white transition-all px-4 py-2.5 rounded-xl bg-white hover:bg-[#00236f] border border-slate-200/80 shadow-xs flex items-center gap-2 group"
              >
                <Share2 size={16} className="text-[#00236f] group-hover:text-white transition-colors" />
                <span>LinkedIn</span>
              </a>

              <a 
                href="mailto:salwasehhun@gmail.com" 
                className="text-xs font-bold text-slate-700 hover:text-white transition-all px-4 py-2.5 rounded-xl bg-white hover:bg-[#00236f] border border-slate-200/80 shadow-xs flex items-center gap-2 group"
              >
                <Mail size={16} className="text-[#00236f] group-hover:text-white transition-colors" />
                <span>Email Resmi</span>
              </a>

              <a 
                href="https://instagram.com/slwfzh" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs font-bold text-slate-700 hover:text-white transition-all px-4 py-2.5 rounded-xl bg-white hover:bg-[#00236f] border border-slate-200/80 shadow-xs flex items-center gap-2 group"
              >
                <Globe size={16} className="text-[#00236f] group-hover:text-white transition-colors" />
                <span>Instagram</span>
              </a>
            </div>

            {/* Tombol Kembali ke Atas */}
            <button 
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#00236f] hover:text-blue-800 transition bg-blue-100/60 hover:bg-blue-200/80 px-4 py-2 rounded-xl cursor-pointer self-start md:self-end shadow-xs"
            >
              <span>Kembali ke Atas</span>
              <ArrowUp size={14} />
            </button>

          </div>
        </div>

        {/* Garis Pemisah */}
        <div className="w-full h-[1px] bg-blue-200/70"></div>

        {/* Bagian Bawah Copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-medium text-center sm:text-left">
          <p>© 2026 Salwa Fauziah. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-1">
            <span>Terakreditasi · Fakultas Ekonomi dan Bisnis UNSIL</span>
          </div>
        </div>

      </div>
    </footer>
  );
}