import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs, doc, getDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminDashboard from './admin/AdminDashboard';
import { ArrowRight, Mail, GraduationCap, Building2, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [educations, setEducations] = useState([]);
  const [profile, setProfile] = useState({
    name: 'Salwa Fauziah',
    title: 'Management Student & Future Business Leader',
    university: 'UNIVERSITAS SILIWANGI · S1 MANAJEMEN',
    bio: 'Mengintegrasikan presisi analitis dan tata kelola bisnis modern. Berfokus pada Manajemen Strategis, Analisis Bisnis, dan pengembangan profesional berbasis di Tasikmalaya, Jawa Barat.',
    gpa: '3.88+',
    location: 'Tasikmalaya, Jawa Barat',
    profileImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-Z9BPMjQydtqQ8MIteqDfc9Sd7LuiZW6AyzDEqMFnXDDfaAN-RxTb9P9VCU9h6tlvR_apV0-dlkix-uyQ4hLXWx-aqSewVzRXqnlK7bWme5Cwy_rz81eYTA4qLqm2BLH4dpJOsURzVDJxajMhk5aZyEvwzk7924EUvXYzuGGIlb0qgVxc-cxtm0vrmOBD57ijiEIJpMppeQ3EninRx5A6X6V5peD7cXN6b826rLXESCN-KgP49q6lgg'
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
          setProfile(profDoc.data());
        }

        const projSnap = await getDocs(collection(db, 'projects'));
        setProjects(projSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const eduSnap = await getDocs(collection(db, 'education'));
        setEducations(eduSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Gagal memuat data:", err);
      }
    };
    fetchData();
  }, []);

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
          <button 
            onClick={() => { setIsAdminOpen(false); window.history.pushState({}, '', '/'); }}
            className="text-xs text-blue-200 hover:text-white underline cursor-pointer"
          >
            ← Kembali ke Website Utama
          </button>
        </div>
        <AdminDashboard />
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30] font-sans min-h-screen flex flex-col justify-between selection:bg-[#00236f] selection:text-white">
      
      <Navbar onOpenAdmin={() => { setIsAdminOpen(true); window.history.pushState({}, '', '/admin'); }} />

      <main className="w-full pt-28 bg-[#f8f9ff] flex-grow max-w-[1200px] mx-auto px-6">
        
        {/* HERO SECTION */}
        <section className="relative w-full rounded-2xl overflow-hidden bg-[#071328] text-white shadow-2xl mb-12 border border-white/10">
          <div className="absolute inset-0 bg-gradient-to-br from-[#071328] via-[#091f4d] to-[#00285e] opacity-95"></div>
          
          <div className="relative z-10 px-8 lg:px-16 py-12 lg:py-16 flex flex-col lg:flex-row items-center justify-between gap-12">
            
            <div className="w-full lg:w-7/12 flex flex-col items-start gap-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
                <span className="w-2 h-2 rounded-full bg-blue-300"></span>
                <span className="text-xs uppercase tracking-wider text-blue-100 font-semibold">{profile.university}</span>
              </div>

              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                {profile.name} <br />
                <span className="bg-gradient-to-r from-blue-200 via-sky-100 to-white bg-clip-text text-transparent text-2xl lg:text-4xl">{profile.title}</span>
              </h1>
              
              <p className="text-lg text-blue-100/90 max-w-2xl leading-relaxed">
                {profile.bio}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a href="#proyek-riset" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-[#00236f] font-semibold shadow-lg hover:bg-blue-50 transition-all">
                  <span>Lihat Portofolio</span>
                  <ArrowRight size={18} />
                </a>
                <a href="#kontak" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 font-semibold transition-all">
                  <Mail size={18} />
                  <span>Hubungi Saya</span>
                </a>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full pt-4 mt-2 bg-white/[0.06] backdrop-blur-md rounded-xl p-4 border border-white/10">
                <div>
                  <span className="text-xs text-blue-200 block mb-1">Poin Akademik / IPK</span>
                  <span className="text-xl font-bold text-white">{profile.gpa}</span>
                </div>
                <div className="border-l border-white/10 pl-4">
                  <span className="text-xs text-blue-200 block mb-1">Domisili</span>
                  <span className="text-xl font-bold text-white">{profile.location}</span>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-5/12 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-sm">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/40 to-indigo-500/40 rounded-2xl blur-xl opacity-80"></div>
                <div className="relative bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/25 shadow-2xl">
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#1e3a8a] border border-white/20">
                    <img src={profile.profileImageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuA-Z9BPMjQydtqQ8MIteqDfc9Sd7LuiZW6AyzDEqMFnXDDfaAN-RxTb9P9VCU9h6tlvR_apV0-dlkix-uyQ4hLXWx-aqSewVzRXqnlK7bWme5Cwy_rz81eYTA4qLqm2BLH4dpJOsURzVDJxajMhk5aZyEvwzk7924EUvXYzuGGIlb0qgVxc-cxtm0vrmOBD57ijiEIJpMppeQ3EninRx5A6X6V5peD7cXN6b826rLXESCN-KgP49q6lgg"} alt={profile.name} className="w-full h-full object-cover object-top" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-lg font-bold">{profile.name}</h3>
                      <p className="text-xs text-blue-200">{profile.university}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ABOUT SECTION */}
        <section id="tentang-saya" className="py-12 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#00236f] font-bold">PROFIL AKADEMIK & KOMPETENSI</span>
              <h2 className="text-3xl font-bold text-[#0b1c30] mt-1">Dedikasi Manajemen Terstruktur</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <GraduationCap className="text-[#00236f] mb-4" size={32} />
              <h3 className="text-lg font-bold text-[#0b1c30] mb-2">Pendidikan Unggul</h3>
              <p className="text-sm text-[#444651]">Menempuh studi manajemen dengan komitmen tinggi pada prestasi dan pengembangan diri.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <Building2 className="text-[#00236f] mb-4" size={32} />
              <h3 className="text-lg font-bold text-[#0b1c30] mb-2">Tata Kelola Bisnis</h3>
              <p className="text-sm text-[#444651]">Mendalami prinsip manajemen strategis, operasional, dan perencanaan bisnis.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <TrendingUp className="text-[#00236f] mb-4" size={32} />
              <h3 className="text-lg font-bold text-[#0b1c30] mb-2">Analitik & Kepemimpinan</h3>
              <p className="text-sm text-[#444651]">Menguasai riset pasar, analisis finansial, serta komunikasi profesional.</p>
            </div>
          </div>
        </section>

        {/* EDUCATION SECTION */}
        <section id="pendidikan" className="py-12 flex flex-col gap-8">
          <h2 className="text-3xl font-bold text-[#0b1c30]">Riwayat Pendidikan</h2>
          {educations.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl text-center border border-dashed border-slate-300">
              <p className="text-sm text-slate-500">Belum ada riwayat pendidikan yang ditambahkan dari halaman Admin.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {educations.map((edu) => (
                <div key={edu.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
                  {edu.logoUrl ? (
                    <img src={edu.logoUrl} alt="Logo" className="w-12 h-12 object-contain rounded-xl bg-slate-50 border p-1.5 shrink-0" />
                  ) : (
                    <div className="p-3 bg-[#00236f] text-white rounded-xl shrink-0"><GraduationCap size={24} /></div>
                  )}
                  <div>
                    <span className="text-xs font-semibold text-blue-600">{edu.period}</span>
                    <h3 className="text-lg font-bold text-[#0b1c30]">{edu.degree}</h3>
                    <p className="text-sm font-medium text-slate-700">{edu.institution}</p>
                    {edu.description && <p className="text-xs text-slate-500 mt-1">{edu.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* PROJECTS / PORTFOLIO SECTION */}
        <section id="proyek-riset" className="py-12 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#00236f] font-bold">PORTOFOLIO TERPILIH</span>
              <h2 className="text-3xl font-bold text-[#0b1c30] mt-1">Tugas, Studi Kasus & Proyek Manajemen</h2>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => setActiveTab('all')} className={`px-4 py-2 rounded-full text-xs font-semibold transition cursor-pointer ${activeTab === 'all' ? 'bg-[#00236f] text-white' : 'bg-white text-slate-600 border'}`}>Semua</button>
              <button onClick={() => setActiveTab('strategic')} className={`px-4 py-2 rounded-full text-xs font-semibold transition cursor-pointer ${activeTab === 'strategic' ? 'bg-[#00236f] text-white' : 'bg-white text-slate-600 border'}`}>Strategik</button>
              <button onClick={() => setActiveTab('financial')} className={`px-4 py-2 rounded-full text-xs font-semibold transition cursor-pointer ${activeTab === 'financial' ? 'bg-[#00236f] text-white' : 'bg-white text-slate-600 border'}`}>Finansial</button>
            </div>
          </div>

          {projects.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-300">
              <p className="text-sm text-slate-500">Belum ada portofolio. Silakan buka menu <b>Admin</b> di pojok kanan atas untuk menambahkannya.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProjects.map((project) => (
                <div key={project.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
                  <div>
                    {project.imageUrl && (
                      <div className="w-full h-40 bg-slate-100 rounded-xl mb-4 overflow-hidden">
                        <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <span className="text-xs font-bold text-[#00236f] uppercase tracking-wider">{project.category}</span>
                    <h3 className="text-xl font-bold text-[#0b1c30] mt-1 mb-2">{project.title}</h3>
                    <p className="text-sm text-[#444651] mb-4">{project.description}</p>
                  </div>
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-[#00236f] hover:underline flex items-center gap-1">
                      Lihat Detail <ArrowRight size={14} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CONTACT SECTION */}
        <section id="kontak" className="py-12 flex flex-col gap-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 flex flex-col gap-4">
              <span className="text-xs uppercase tracking-widest text-[#00236f] font-bold">HUBUNGI SAYA</span>
              <h2 className="text-3xl font-bold text-[#0b1c30]">Mulai Diskusi & Kolaborasi</h2>
              <p className="text-sm text-[#444651]">Terbuka untuk peluang profesional, tugas kolaborasi, maupun diskusi akademik.</p>
              
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#00236f] flex items-center justify-center font-bold">@</div>
                <div>
                  <span className="text-xs text-slate-500 block">Email Institusi Resmi</span>
                  <span className="text-sm font-bold text-[#0b1c30]">salwafauziah@unsil.ac.id</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-[#0b162c] text-white p-8 rounded-2xl shadow-xl border border-white/10">
              {success && (
                <div className="mb-4 bg-emerald-600/90 text-white p-3 rounded-xl text-sm flex items-center gap-2">
                  <CheckCircle2 size={18} /> Pesan berhasil dikirim ke Salwa!
                </div>
              )}
              <form onSubmit={handleSubmitContact} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-blue-200 uppercase mb-1 block">Nama Lengkap</label>
                    <input type="text" required value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-blue-200 uppercase mb-1 block">Email</label>
                    <input type="email" required value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-sm" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-blue-200 uppercase mb-1 block">Subjek</label>
                  <input type="text" required value={formData.subject} onChange={e=>setFormData({...formData, subject: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-blue-200 uppercase mb-1 block">Pesan</label>
                  <textarea rows="4" required value={formData.message} onChange={e=>setFormData({...formData, message: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-sm"></textarea>
                </div>
                <button type="submit" disabled={submitting} className="w-full py-3 rounded-xl bg-white text-[#00236f] font-bold text-sm hover:bg-blue-50 transition shadow-lg cursor-pointer">
                  {submitting ? 'Mengirim...' : 'Kirim Pesan Resmi'}
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