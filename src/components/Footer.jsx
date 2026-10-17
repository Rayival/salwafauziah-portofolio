import React from 'react';
import { MapPin, Mail, Globe, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#eff4ff] mt-16 border-t border-blue-100">
      <div className="max-w-[1200px] mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-[#00236f]">Salwa Fauziah</span>
            <span className="px-3 py-0.5 rounded-full bg-[#dae2fd] text-[#131b2e] text-xs font-semibold">B.Mgt Candidate</span>
          </div>
          <p className="text-sm text-[#444651] max-w-md leading-relaxed">
            Program Studi Manajemen, Fakultas Ekonomi dan Bisnis, Universitas Siliwangi. Berfokus pada manajemen strategis, kepemimpinan organisasi, dan analitik bisnis.
          </p>
          <div className="flex items-center gap-2 text-xs text-[#565e74] mt-1">
            <MapPin size={14} /><span>Tasikmalaya, Jawa Barat, Indonesia</span>
          </div>
        </div>
        
        <div className="flex flex-col md:items-end gap-4">
          <div className="flex items-center gap-3">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-sm text-[#444651] hover:text-[#00236f] transition-colors px-3 py-1.5 rounded-lg hover:bg-white flex items-center gap-1.5">
              <ExternalLink size={16} /><span>LinkedIn</span>
            </a>
            <a href="mailto:salwa@unsil.ac.id" className="text-sm text-[#444651] hover:text-[#00236f] transition-colors px-3 py-1.5 rounded-lg hover:bg-white flex items-center gap-1.5">
              <Mail size={16} /><span>Email</span>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-sm text-[#444651] hover:text-[#00236f] transition-colors px-3 py-1.5 rounded-lg hover:bg-white flex items-center gap-1.5">
              <Globe size={16} /><span>Instagram</span>
            </a>
          </div>
          <div className="text-xs text-[#757682] flex flex-col md:items-end gap-0.5">
            <span>© 2026 Salwa Fauziah. Hak Cipta Dilindungi.</span>
            <span className="text-[#565e74] font-medium">Terakreditasi · Universitas Siliwangi</span>
          </div>
        </div>
      </div>
    </footer>
  );
}