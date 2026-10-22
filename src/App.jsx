import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs, doc, getDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminDashboard from './admin/AdminDashboard';
import { ArrowRight, Mail, GraduationCap, BookOpen, Users, CheckCircle2, MapPin, ExternalLink, Sparkles, Briefcase, Globe } from 'lucide-react';

import defaultProfileImg from './assets/SalwaF.jpeg';
import logoUnsil from './assets/LOGO-UNSIL.png';
import logoSman5 from './assets/Campus5.png';

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [educations, setEducations] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  
  const [profile, setProfile] = useState({
    name: 'Salwa Fauziah',
    title: 'Management Student',
    university: 'UNIVERSITAS SILIWANGI · S1 MANAJEMEN',
    bio: 'Mahasiswa aktif Program Studi Manajemen Fakultas Ekonomi dan Bisnis Universitas Siliwangi. Berfokus membangun fondasi kuat dalam ilmu manajemen, organisasi, dan analisis bisnis.',
    gpa: 'Aktif S1',
    location: 'Tasikmalaya, Jawa Barat',
    profileImageUrl: defaultProfileImg
  });
  
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (window.location.pathname === '/admin') {
      setIsAdminOpen(true);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profDoc = await getDoc(doc(db, 'profile', 'main'));
        if (profDoc.exists()) {
          const data = profDoc.data();
          setProfile({
            name: data.name || 'Salwa Fauziah',
            title: data.title || 'Management Student',
            university: data.university || 'UNIVERSITAS SILIWANGI · S1 MANAJEMEN',
            bio: data.bio || 'Mahasiswa aktif Program Studi Manajemen Fakultas Ekonomi dan Bisnis Universitas Siliwangi.',
            gpa: data.gpa || 'Aktif S1',
            location: data.location || 'Tasikmalaya, Jawa Barat',
            profileImageUrl: (data.profileImageUrl && data.profileImageUrl.trim() !== '') ? data.profileImageUrl : defaultProfileImg
          });
        }
        const projSnap = await getDocs(collection(db, 'projects'));
        setProjects(projSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        const eduSnap = await getDocs(collection(db, 'education'));
        setEducations(eduSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Gagal memuat data:", err);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchData();
  }, []);

  // Fungsi simpan pesan kontak dipastikan menangkap data dengan benar
  const handleSubmitContact = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'messages'), {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        createdAt: serverTimestamp()
      });
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error("Gagal mengirim pesan:", err);
    }
    setSubmitting(false);
  };

  const filteredProjects = activeTab === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeTab);

  if (isAdminOpen) {
    return (
      <div>
        <div className="bg-[#071328] px-6 py-2 text-right">
          <button onClick={() => { setIsAdminOpen(false); window.history.pushState({}, '', '/'); }} className="text-xs text-blue-200 hover:text-white underline cursor-pointer transition">
            ← Kembali ke Website Utama
          </button>
        </div>
        <AdminDashboard />
      </div>
    );
  }

  return (
    <div className="bg-[#f4f7fc] text-[#0b1c30] font-sans min-h-screen flex flex-col justify-between selection:bg-[#00236f] selection:text-white scroll-smooth overflow-x-hidden">
      <Navbar profileImage={profile.profileImageUrl} onOpenAdmin={() => { setIsAdminOpen(true); window.history.pushState({}, '', '/admin'); }} />

      <main className="w-full pt-24 lg:pt-28 flex-grow max-w-[1200px] mx-auto px-4 sm:px-6">
        
        {/* HERO SECTION - Responsif Mobile */}
        <section className="relative w-full rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#071328] via-[#0b1c30] to-[#00285e] text-white shadow-2xl mb-16 lg:mb-20 border border-white/10 group">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#4b8cf6_1px,transparent_1px)] [background-size:24px_24px] group-hover:opacity-30 transition-opacity duration-700"></div>
          <div className="absolute -top-32 -right-32 w-72 h-72 lg:w-96 lg:h-96 bg-blue-500/20 blur-[80px] lg:blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="relative z-10 px-6 py-12 sm:p-12 lg:px-16 lg:py-24 flex flex-col-reverse lg:flex-row items-center justify-between gap-10 lg:gap-12">
            
            <div className="w-full lg:w-7/12 flex flex-col items-center lg:items-start text-center lg:text-left gap-6 lg:gap-7">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-blue-200 text-[10px] sm:text-xs uppercase tracking-wider font-semibold shadow-inner">
                <Sparkles size={14} className="text-blue-300 animate-pulse hidden sm:block" />
                <span>{profile.university}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.15]">
                {profile.name} <br />
                <span className="bg-gradient-to-r from-blue-200 via-blue-100 to-white bg-clip-text text-transparent text-xl sm:text-2xl lg:text-3xl font-semibold mt-2 lg:mt-3 block">{profile.title}</span>
              </h1>
              
              <p className="text-sm sm:text-base lg:text-lg text-slate-300/90 max-w-2xl leading-relaxed">
                {profile.bio}
              </p>

              {/* Tombol responsif: stack di HP, sejajar di layar besar */}
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-2 w-full lg:w-auto">
                <a href="#proyek-riset" className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-7 py-3.5 rounded-2xl bg-white text-[#00236f] font-bold text-sm shadow-xl hover:bg-blue-50 hover:-translate-y-1 transition-all duration-300">
                  <span>Lihat Portofolio</span>
                  <ArrowRight size={18} />
                </a>
                <a href="#kontak" className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-7 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 font-bold text-sm shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <Mail size={18} />
                  <span>Hubungi Saya</span>
                </a>
              </div>

              {/* Kotak Info Responsif */}
              <div className="grid grid-cols-2 gap-4 lg:gap-6 w-full pt-6 mt-2 border-t border-white/10 text-left">
                <div className="bg-white/5 p-3 lg:p-0 lg:bg-transparent rounded-xl lg:rounded-none">
                  <span className="text-[10px] lg:text-xs text-slate-400 block mb-1 uppercase tracking-wider font-semibold">Status Akademik</span>
                  <span className="text-lg lg:text-xl font-bold text-white tracking-wide">{profile.gpa}</span>
                </div>
                <div className="bg-white/5 p-3 lg:p-0 lg:bg-transparent rounded-xl lg:rounded-none">
                  <span className="text-[10px] lg:text-xs text-slate-400 block mb-1 uppercase tracking-wider font-semibold">Domisili</span>
                  <span className="text-sm sm:text-lg lg:text-xl font-bold text-white flex items-center gap-1.5 lg:gap-2 tracking-wide"><MapPin size={16} className="text-blue-400 shrink-0"/> <span className="truncate">{profile.location}</span></span>
                </div>
              </div>
            </div>

            {/* Foto Profil Responsif */}
            <div className="w-4/5 sm:w-2/3 lg:w-5/12 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[280px] lg:max-w-sm group cursor-pointer">
                <div className="absolute -inset-2 lg:-inset-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-[2rem] lg:rounded-[2.5rem] blur-xl lg:blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
                <div className="relative bg-slate-900/40 backdrop-blur-2xl p-3 lg:p-4 rounded-[2rem] lg:rounded-[2.5rem] border border-white/20 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                  <div className="relative w-full aspect-square rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden bg-slate-800">
                    <img src={profile.profileImageUrl} alt={profile.name} className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#071328]/90 via-[#071328]/20 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 lg:bottom-6 lg:left-6 lg:right-6 text-white">
                      <h3 className="text-lg lg:text-xl font-bold">{profile.name}</h3>
                      <p className="text-[10px] lg:text-xs text-blue-200 mt-0.5 lg:mt-1 font-medium tracking-wide truncate">FEB Universitas Siliwangi</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ABOUT SECTION */}
        <section id="tentang-saya" className="py-12 lg:py-16 flex flex-col gap-8 lg:gap-10 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 lg:gap-6">
            <div className="space-y-1.5 lg:space-y-2 text-center md:text-left">
              <span className="text-[10px] lg:text-xs uppercase tracking-widest text-[#00236f] font-extrabold flex items-center justify-center md:justify-start gap-2"><div className="w-4 lg:w-6 h-0.5 bg-[#00236f]"></div> FOKUS & EKSPLORASI</span>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-[#0b1c30] tracking-tight">Pengembangan Diri</h2>
            </div>
            <p className="text-sm text-slate-600 max-w-md leading-relaxed text-center md:text-left">
              Menjalani perkuliahan tingkat awal dengan semangat eksplorasi ilmu ekonomi, tata kelola organisasi, dan kolaborasi tim profesional.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 lg:gap-6">
            {[
              { icon: GraduationCap, title: 'Studi Manajemen', desc: 'Mempelajari konsep dasar organisasi, pengantar bisnis, dan dinamika perusahaan di Fakultas Ekonomi dan Bisnis UNSIL.' },
              { icon: BookOpen, title: 'Literasi & Riset Dasar', desc: 'Aktif mengikuti literatur bisnis, studi kasus sederhana, serta penulisan laporan akademik secara terstruktur.' },
              { icon: Users, title: 'Kolaborasi Tim', desc: 'Mengasah kemampuan komunikasi, kerja sama tim, dan kepemimpinan melalui penugasan kelompok serta relasi kampus.' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-[1.5rem] lg:rounded-3xl p-6 lg:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 hover:shadow-[0_8px_30px_rgba(0,35,111,0.08)] hover:-translate-y-1.5 transition-all duration-300 group text-center sm:text-left">
                <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-blue-50/80 text-[#00236f] flex items-center justify-center mb-5 lg:mb-6 group-hover:bg-[#00236f] group-hover:text-white transition-colors duration-300 mx-auto sm:mx-0">
                  <item.icon size={24} />
                </div>
                <h3 className="text-lg lg:text-xl font-extrabold text-[#0b1c30] mb-2.5 lg:mb-3">{item.title}</h3>
                <p className="text-xs lg:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* EDUCATION SECTION */}
        <section id="pendidikan" className="py-12 lg:py-16 flex flex-col gap-8 lg:gap-10 scroll-mt-24">
          <div className="space-y-1.5 lg:space-y-2 text-center md:text-left">
            <span className="text-[10px] lg:text-xs uppercase tracking-widest text-[#00236f] font-extrabold flex items-center justify-center md:justify-start gap-2"><div className="w-4 lg:w-6 h-0.5 bg-[#00236f]"></div> AKADEMIK</span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-[#0b1c30] tracking-tight">Riwayat Pendidikan</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
            <div className="bg-white p-5 lg:p-8 rounded-[1.5rem] lg:rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row items-center sm:items-start gap-4 lg:gap-5 hover:shadow-md transition-shadow text-center sm:text-left">
              <div className="w-16 h-16 lg:w-16 lg:h-16 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center p-2.5 shrink-0">
                <img src={logoUnsil} alt="Logo UNSIL" className="w-full h-full object-contain" />
              </div>
              <div className="space-y-1.5">
                <span className="inline-block text-[9px] lg:text-[10px] font-extrabold text-blue-700 bg-blue-50/80 px-2.5 lg:px-3 py-1 lg:py-1.5 rounded-lg uppercase tracking-wider">2024 — Sekarang</span>
                <h3 className="text-lg lg:text-xl font-extrabold text-[#0b1c30] tracking-tight">S1 Manajemen</h3>
                <p className="text-xs lg:text-sm font-bold text-slate-700">Universitas Siliwangi (UNSIL)</p>
                <p className="text-[11px] lg:text-xs text-slate-500 leading-relaxed">Fakultas Ekonomi dan Bisnis, Tasikmalaya.</p>
              </div>
            </div>

            <div className="bg-white p-5 lg:p-8 rounded-[1.5rem] lg:rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row items-center sm:items-start gap-4 lg:gap-5 hover:shadow-md transition-shadow text-center sm:text-left">
              <div className="w-16 h-16 lg:w-16 lg:h-16 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center p-2.5 shrink-0">
                <img src={logoSman5} alt="Logo SMAN 5" className="w-full h-full object-contain" />
              </div>
              <div className="space-y-1.5">
                <span className="inline-block text-[9px] lg:text-[10px] font-extrabold text-slate-600 bg-slate-100 px-2.5 lg:px-3 py-1 lg:py-1.5 rounded-lg uppercase tracking-wider">2021 — 2024</span>
                <h3 className="text-lg lg:text-xl font-extrabold text-[#0b1c30] tracking-tight">Sekolah Menengah Atas</h3>
                <p className="text-xs lg:text-sm font-bold text-slate-700">SMA Negeri 5 Tasikmalaya</p>
                <p className="text-[11px] lg:text-xs text-slate-500 leading-relaxed">Alumni terdaftar secara resmi.</p>
              </div>
            </div>
          </div>

          {educations.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 mt-2">
              {educations.map((edu) => (
                <div key={edu.id} className="bg-white p-5 lg:p-8 rounded-[1.5rem] lg:rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row items-center sm:items-start gap-4 lg:gap-5 hover:shadow-md transition-shadow text-center sm:text-left">
                  {edu.logoUrl ? (
                    <img src={edu.logoUrl} alt="Logo" className="w-16 h-16 object-contain rounded-2xl bg-white border border-slate-100 shadow-sm p-2 shrink-0" />
                  ) : (
                    <div className="w-16 h-16 bg-[#00236f] text-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm"><GraduationCap size={24} /></div>
                  )}
                  <div className="space-y-1.5">
                    <span className="inline-block text-[9px] lg:text-[10px] font-extrabold text-blue-700 bg-blue-50/80 px-2.5 lg:px-3 py-1 lg:py-1.5 rounded-lg uppercase tracking-wider">{edu.period}</span>
                    <h3 className="text-lg lg:text-xl font-extrabold text-[#0b1c30] tracking-tight">{edu.degree}</h3>
                    <p className="text-xs lg:text-sm font-bold text-slate-700">{edu.institution}</p>
                    {edu.description && <p className="text-[11px] lg:text-xs text-slate-500 leading-relaxed">{edu.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* PROJECTS SECTION */}
        <section id="proyek-riset" className="py-12 lg:py-16 flex flex-col gap-8 lg:gap-10 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 lg:gap-6">
            <div className="space-y-1.5 lg:space-y-2 text-center md:text-left">
              <span className="text-[10px] lg:text-xs uppercase tracking-widest text-[#00236f] font-extrabold flex items-center justify-center md:justify-start gap-2"><div className="w-4 lg:w-6 h-0.5 bg-[#00236f]"></div> KARYA & TUGAS</span>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-[#0b1c30] tracking-tight">Portofolio Akademik</h2>
            </div>
            {/* Filter Buttons */}
            <div className="flex gap-2 flex-wrap justify-center p-1.5 bg-white rounded-xl lg:rounded-2xl shadow-sm border border-slate-100">
              {['all', 'strategic', 'financial'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 lg:px-5 py-2 lg:py-2.5 rounded-lg lg:rounded-xl text-[10px] lg:text-xs font-extrabold transition-all duration-300 cursor-pointer flex-1 sm:flex-none ${activeTab === tab ? 'bg-[#00236f] text-white shadow-md' : 'bg-transparent text-slate-500 hover:bg-slate-50 hover:text-[#0b1c30]'}`}>
                  {tab === 'all' ? 'Semua' : tab === 'strategic' ? 'Manajemen' : 'Analisis'}
                </button>
              ))}
            </div>
          </div>

          {projects.length === 0 ? (
            <div className="bg-white p-10 lg:p-14 text-center rounded-[2rem] border-2 border-dashed border-slate-200 shadow-sm mx-2">
              <div className="w-14 h-14 lg:w-16 lg:h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400"><BookOpen size={24}/></div>
              <h3 className="text-base lg:text-lg font-bold text-[#0b1c30] mb-1">Belum Ada Portofolio</h3>
              <p className="text-xs lg:text-sm text-slate-500 max-w-md mx-auto">Karya akademik dan tugas akan ditampilkan di sini. Akses panel Admin untuk mengunggah studi kasus baru.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {filteredProjects.map((project) => (
                <div key={project.id} className="bg-white rounded-[2rem] p-4 sm:p-5 lg:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col justify-between hover:shadow-[0_12px_40px_rgba(0,35,111,0.08)] hover:-translate-y-2 transition-all duration-300 group">
                  <div>
                    {project.imageUrl && (
                      <div className="w-full h-48 sm:h-52 lg:h-56 bg-slate-100 rounded-[1.5rem] mb-5 overflow-hidden border border-slate-100 relative">
                        <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-[#00236f]/0 group-hover:bg-[#00236f]/10 transition-colors duration-300"></div>
                      </div>
                    )}
                    <span className="text-[9px] lg:text-[10px] font-extrabold text-[#00236f] uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-lg">{project.category}</span>
                    <h3 className="text-xl lg:text-2xl font-extrabold text-[#0b1c30] mt-3 lg:mt-4 mb-2 lg:mb-3 leading-tight group-hover:text-[#00236f] transition-colors">{project.title}</h3>
                    <p className="text-xs lg:text-sm text-slate-600 mb-5 lg:mb-6 leading-relaxed line-clamp-3 lg:line-clamp-none">{project.description}</p>
                  </div>
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex w-full sm:w-fit justify-center sm:justify-start items-center gap-2 px-5 py-3 bg-slate-50 hover:bg-[#00236f] text-slate-700 hover:text-white rounded-xl text-xs font-bold transition-all duration-300">
                      <span>Lihat Detail Studi</span> <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CONTACT SECTION (Dengan Link IG & LinkedIn) */}
        <section id="kontak" className="py-12 lg:py-16 flex flex-col gap-8 lg:gap-10 scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* Bagian Kiri: Info & Sosial Media */}
            <div className="lg:col-span-5 flex flex-col gap-6 text-center lg:text-left">
              <div className="space-y-1.5 lg:space-y-2">
                <span className="text-[10px] lg:text-xs uppercase tracking-widest text-[#00236f] font-extrabold flex items-center justify-center lg:justify-start gap-2"><div className="w-4 lg:w-6 h-0.5 bg-[#00236f]"></div> HUBUNGI SAYA</span>
                <h2 className="text-3xl lg:text-4xl font-extrabold text-[#0b1c30] tracking-tight leading-tight">Mulai Diskusi & Kolaborasi</h2>
              </div>
              <p className="text-xs lg:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto lg:mx-0">
                Terbuka untuk diskusi tugas akademik, kerja sama tim, maupun peluang relasi profesional. Hubungi saya melalui email atau terhubung di platform profesional.
              </p>
              
              <div className="bg-white p-5 lg:p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col gap-5 mt-2 lg:mt-4 mx-auto lg:mx-0 w-full max-w-sm lg:max-w-full text-left">
                {/* Email Info */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-blue-50/80 text-[#00236f] flex items-center justify-center shadow-inner shrink-0">
                    <Mail size={22} className="lg:w-6 lg:h-6" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[10px] lg:text-[11px] font-bold text-slate-400 block uppercase tracking-wider mb-0.5">Email Pribadi</span>
                    <span className="text-sm lg:text-base font-extrabold text-[#0b1c30] truncate block">salwasehhun@gmail.com</span>
                  </div>
                </div>

                <div className="h-px w-full bg-slate-100"></div>

                {/* Social Media Links (Dipindah ke sini) */}
                <div className="flex items-center gap-3">
                  <a href="https://www.linkedin.com/in/salwa-fauziah-835842433" target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex justify-center items-center gap-2 px-4 py-3 rounded-xl bg-[#0a66c2]/10 hover:bg-[#0a66c2] text-[#0a66c2] hover:text-white text-xs font-bold transition-all duration-300">
                    <Briefcase size={16} /> <span>LinkedIn</span>
                  </a>
                  <a href="https://instagram.com/slwfzh" target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex justify-center items-center gap-2 px-4 py-3 rounded-xl bg-[#e1306c]/10 hover:bg-[#e1306c] text-[#e1306c] hover:text-white text-xs font-bold transition-all duration-300">
                    <Globe size={16} /> <span>Instagram</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Bagian Kanan: Form */}
            <div className="lg:col-span-7 bg-gradient-to-br from-[#071328] to-[#0b1c30] text-white p-6 sm:p-8 md:p-12 rounded-[2rem] lg:rounded-[2.5rem] shadow-2xl border border-slate-800 relative overflow-hidden mt-4 lg:mt-0">
              <div className="absolute top-0 right-0 w-48 h-48 lg:w-64 lg:h-64 bg-blue-500/10 blur-[60px] lg:blur-[80px] rounded-full pointer-events-none"></div>
              
              {success && (
                <div className="mb-6 lg:mb-8 bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 p-4 rounded-xl lg:rounded-2xl text-xs lg:text-sm font-semibold flex items-center gap-3 animate-fade-in backdrop-blur-sm">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0" /> <span className="leading-tight">Pesan berhasil dikirim! Salwa akan segera merespons.</span>
                </div>
              )}
              
              <form onSubmit={handleSubmitContact} className="space-y-4 lg:space-y-5 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] lg:text-xs font-bold text-slate-300 uppercase tracking-wider ml-1">Nama Lengkap</label>
                    <input type="text" required value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full px-4 lg:px-5 py-3.5 lg:py-4 rounded-xl lg:rounded-2xl bg-white/5 border border-white/10 text-white text-xs lg:text-sm focus:outline-none focus:border-blue-400 focus:bg-white/10 transition-all shadow-inner placeholder:text-slate-500" placeholder="Ketik nama Anda" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] lg:text-xs font-bold text-slate-300 uppercase tracking-wider ml-1">Email</label>
                    <input type="email" required value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} className="w-full px-4 lg:px-5 py-3.5 lg:py-4 rounded-xl lg:rounded-2xl bg-white/5 border border-white/10 text-white text-xs lg:text-sm focus:outline-none focus:border-blue-400 focus:bg-white/10 transition-all shadow-inner placeholder:text-slate-500" placeholder="Ketik email anda" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] lg:text-xs font-bold text-slate-300 uppercase tracking-wider ml-1">Subjek</label>
                  <input type="text" required value={formData.subject} onChange={e=>setFormData({...formData, subject: e.target.value})} className="w-full px-4 lg:px-5 py-3.5 lg:py-4 rounded-xl lg:rounded-2xl bg-white/5 border border-white/10 text-white text-xs lg:text-sm focus:outline-none focus:border-blue-400 focus:bg-white/10 transition-all shadow-inner placeholder:text-slate-500" placeholder="Topik diskusi atau pesan" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] lg:text-xs font-bold text-slate-300 uppercase tracking-wider ml-1">Pesan</label>
                  <textarea rows="4" required value={formData.message} onChange={e=>setFormData({...formData, message: e.target.value})} className="w-full px-4 lg:px-5 py-3.5 lg:py-4 rounded-xl lg:rounded-2xl bg-white/5 border border-white/10 text-white text-xs lg:text-sm focus:outline-none focus:border-blue-400 focus:bg-white/10 transition-all shadow-inner resize-none placeholder:text-slate-500" placeholder="Tuliskan pesan Anda secara detail..."></textarea>
                </div>
                <button type="submit" disabled={submitting} className="w-full py-3.5 lg:py-4 mt-2 rounded-xl lg:rounded-2xl bg-white text-[#00236f] font-extrabold text-xs lg:text-sm hover:bg-blue-50 hover:-translate-y-1 transition-all duration-300 shadow-xl cursor-pointer">
                  {submitting ? 'Memproses Pengiriman...' : 'Kirim Pesan Sekarang'}
                </button>
              </form>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}