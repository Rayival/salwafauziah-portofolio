import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, addDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { LogOut, Plus, Trash2, Mail, GraduationCap, User, CheckCircle, Shield, AlertCircle } from 'lucide-react';

const ALLOWED_ADMINS = [
  'salwasehhun@gmail.com',
  'dederayival19@gmail.com'
];

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [projects, setProjects] = useState([]);
  const [educations, setEducations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [profile, setProfile] = useState({
    name: 'Salwa Fauziah',
    title: 'Management Student & Future Business Leader',
    university: 'UNIVERSITAS SILIWANGI · S1 MANAJEMEN',
    bio: 'Mengintegrasikan presisi analitis dan tata kelola bisnis modern.',
    gpa: '3.88+',
    location: 'Tasikmalaya, Jawa Barat',
    profileImageUrl: ''
  });
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileSuccess, setProfileSuccess] = useState('');

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('strategic');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const [eduDegree, setEduDegree] = useState('');
  const [eduInstitution, setEduInstitution] = useState('');
  const [eduPeriod, setEduPeriod] = useState('');
  const [eduDesc, setEduDesc] = useState('');
  const [eduLogoFile, setEduLogoFile] = useState(null);
  const [eduSuccessMsg, setEduSuccessMsg] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        if (ALLOWED_ADMINS.includes(currentUser.email)) {
          setUser(currentUser);
          fetchAllData();
        } else {
          await signOut(auth);
          setUser(null);
          setError('Akses ditolak. Email tidak diizinkan.');
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchAllData = async () => {
    try {
      const profileSnap = await getDocs(collection(db, 'profile'));
      if (!profileSnap.empty) {
        const profData = profileSnap.docs.find(d => d.id === 'main');
        if (profData) setProfile(profData.data());
      }

      const projSnap = await getDocs(collection(db, 'projects'));
      setProjects(projSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      const eduSnap = await getDocs(collection(db, 'education'));
      setEducations(eduSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      const msgSnap = await getDocs(collection(db, 'messages'));
      setMessages(msgSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Gagal ambil data:", err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!ALLOWED_ADMINS.includes(email.trim())) {
      setError('Email ini tidak memiliki izin admin.');
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      setError('Login gagal. Periksa kembali email atau password.');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  // Simpan Profil dengan Notifikasi Jelas
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProfileSuccess('');
    setError('');
    try {
      let imageUrl = profile.profileImageUrl;
      if (profileImageFile) {
        const imgRef = ref(storage, `profile/main_${Date.now()}_${profileImageFile.name}`);
        const snapshot = await uploadBytes(imgRef, profileImageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const updatedProfile = { 
        name: profile.name || '',
        title: profile.title || '',
        university: profile.university || '',
        bio: profile.bio || '',
        gpa: profile.gpa || '',
        location: profile.location || '',
        profileImageUrl: imageUrl 
      };

      // Menggunakan { merge: true } agar dokumen otomatis dibuat jika belum ada, atau di-update jika sudah ada
      await setDoc(doc(db, 'profile', 'main'), updatedProfile, { merge: true });
      
      setProfile(updatedProfile);
      setProfileSuccess('✅ Berhasil! Perubahan profil utama telah tersimpan di database.');
      setProfileImageFile(null);
    } catch (err) {
      console.error(err);
      setError('❌ Gagal menyimpan profil. Periksa koneksi atau izin database.');
    }
    setLoading(false);
  };

  // Simpan Portofolio dengan Notifikasi Jelas
  const handleAddProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setError('');
    try {
      let imageUrl = '';
      if (imageFile) {
        const imageRef = ref(storage, `projects/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      await addDoc(collection(db, 'projects'), { title, category, description, link, imageUrl });
      setTitle(''); setDescription(''); setLink(''); setImageFile(null);
      setSuccessMsg('✅ Berhasil! Portofolio baru telah dipublikasikan ke beranda.');
      fetchAllData();
    } catch (err) {
      console.error(err);
      setError('❌ Gagal mengunggah portofolio.');
    }
    setLoading(false);
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('Yakin ingin menghapus portofolio ini?')) {
      await deleteDoc(doc(db, 'projects', id));
      fetchAllData();
    }
  };

  // Simpan Pendidikan dengan Notifikasi Jelas
  const handleAddEducation = async (e) => {
    e.preventDefault();
    setLoading(true);
    setEduSuccessMsg('');
    setError('');
    try {
      let logoUrl = '';
      if (eduLogoFile) {
        const logoRef = ref(storage, `education_logos/${Date.now()}_${eduLogoFile.name}`);
        const snapshot = await uploadBytes(logoRef, eduLogoFile);
        logoUrl = await getDownloadURL(snapshot.ref);
      }

      await addDoc(collection(db, 'education'), { 
        degree: eduDegree, 
        institution: eduInstitution, 
        period: eduPeriod, 
        description: eduDesc, 
        logoUrl 
      });
      setEduDegree(''); setEduInstitution(''); setEduPeriod(''); setEduDesc(''); setEduLogoFile(null);
      setEduSuccessMsg('✅ Berhasil! Riwayat pendidikan dan logo berhasil ditambahkan.');
      fetchAllData();
    } catch (err) {
      console.error(err);
      setError('❌ Gagal menambahkan pendidikan.');
    }
    setLoading(false);
  };

  const handleDeleteEducation = async (id) => {
    if (window.confirm('Yakin ingin menghapus riwayat pendidikan ini?')) {
      await deleteDoc(doc(db, 'education', id));
      fetchAllData();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#071328] flex items-center justify-center p-6 font-sans">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl w-full max-w-md shadow-2xl text-white">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3 text-blue-200">
              <Shield size={24} />
            </div>
            <h2 className="text-2xl font-bold">Admin Portal</h2>
            <p className="text-xs text-blue-200 mt-1">Salwa Fauziah & Dede Rayival</p>
          </div>
          {error && <div className="mb-4 bg-red-500/20 border border-red-500 text-red-200 p-3 rounded-xl text-xs flex items-center gap-2"><AlertCircle size={16}/>{error}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-blue-200 uppercase mb-1 block">Email</label>
              <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-sm focus:outline-none" placeholder="salwasehhun@gmail.com" />
            </div>
            <div>
              <label className="text-xs font-semibold text-blue-200 uppercase mb-1 block">Password</label>
              <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-sm focus:outline-none" placeholder="••••••••" />
            </div>
            <button type="submit" className="w-full py-3 rounded-xl bg-white text-[#00236f] font-bold text-sm hover:bg-blue-50 transition shadow-lg cursor-pointer">Masuk</button>
          </form>
          <div className="mt-6 text-center"><a href="/" className="text-xs text-blue-300 hover:underline">← Beranda Website</a></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] font-sans">
      <header className="bg-[#071328] text-white shadow-md sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-sm font-bold">Admin Dashboard · {user.email}</h1>
          <p className="text-[10px] text-blue-200">Full Control Panel (Profil, Pendidikan, Portofolio, Pesan)</p>
        </div>
        <div className="flex items-center gap-4">
          <a href="/" className="text-xs text-blue-200 hover:text-white transition">Lihat Web ↗</a>
          <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/30 border border-red-500/40 text-red-200 text-xs cursor-pointer">
            <LogOut size={14} /> Keluar
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-12">
        
        {/* EDIT PROFIL UTAMA */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-[#0b1c30] mb-2 flex items-center gap-2">
            <User size={20} className="text-[#00236f]" /> Edit Profil Utama & Foto Beranda
          </h2>
          <p className="text-xs text-slate-500 mb-6">Ubah informasi teks dan foto profil utama yang langsung tampil di halaman depan website.</p>
          
          {profileSuccess && (
            <div className="mb-6 bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-xl text-sm font-semibold flex items-center gap-3 shadow-sm animate-fade-in">
              <CheckCircle size={20} className="text-emerald-600 shrink-0" />
              <span>{profileSuccess}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase mb-1 block">Nama Lengkap</label>
                <input type="text" required value={profile.name} onChange={e=>setProfile({...profile, name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase mb-1 block">Judul / Slogan Utama</label>
                <input type="text" required value={profile.title} onChange={e=>setProfile({...profile, title: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase mb-1 block">Tag Institusi</label>
                <input type="text" required value={profile.university} onChange={e=>setProfile({...profile, university: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase mb-1 block">IPK / Poin Utama</label>
                <input type="text" required value={profile.gpa} onChange={e=>setProfile({...profile, gpa: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase mb-1 block">Domisili</label>
                <input type="text" required value={profile.location} onChange={e=>setProfile({...profile, location: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border text-sm" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase mb-1 block">Deskripsi / Bio Singkat</label>
              <textarea rows="3" required value={profile.bio} onChange={e=>setProfile({...profile, bio: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border text-sm"></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase mb-1 block">Upload Foto Profil Baru (Opsional)</label>
                <input type="file" accept="image/*" onChange={e=>setProfileImageFile(e.target.files[0])} className="w-full text-xs text-slate-500 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-[#00236f] file:text-white cursor-pointer" />
              </div>
              {profile.profileImageUrl && (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500">Foto Saat Ini:</span>
                  <img src={profile.profileImageUrl} alt="Profile" className="w-12 h-12 rounded-lg object-cover border" />
                </div>
              )}
            </div>
            <button type="submit" disabled={loading} className="py-3 px-6 rounded-xl bg-[#00236f] text-white font-bold text-xs hover:bg-[#1e3a8a] transition shadow-md cursor-pointer">
              {loading ? 'Menyimpan...' : 'Simpan Perubahan Profil'}
            </button>
          </form>
        </section>

        {/* KELOLA PENDIDIKAN & LOGO */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-[#0b1c30] mb-2 flex items-center gap-2">
            <GraduationCap size={20} className="text-[#00236f]" /> Kelola Riwayat Pendidikan & Logo Institusi
          </h2>
          <p className="text-xs text-slate-500 mb-6">Tambah atau hapus riwayat sekolah/kampus beserta logo resminya.</p>
          
          {eduSuccessMsg && (
            <div className="mb-6 bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-xl text-sm font-semibold flex items-center gap-3 shadow-sm">
              <CheckCircle size={20} className="text-emerald-600 shrink-0" />
              <span>{eduSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleAddEducation} className="space-y-4 mb-8 pb-8 border-b border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase mb-1 block">Gelar / Jenjang</label>
                <input type="text" required value={eduDegree} onChange={e=>setEduDegree(e.target.value)} placeholder="Contoh: S1 Manajemen" className="w-full px-4 py-2.5 rounded-xl border text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase mb-1 block">Nama Institusi / Sekolah</label>
                <input type="text" required value={eduInstitution} onChange={e=>setEduInstitution(e.target.value)} placeholder="Universitas Siliwangi" className="w-full px-4 py-2.5 rounded-xl border text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase mb-1 block">Periode</label>
                <input type="text" required value={eduPeriod} onChange={e=>setEduPeriod(e.target.value)} placeholder="2022 — Sekarang" className="w-full px-4 py-2.5 rounded-xl border text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase mb-1 block">Keterangan Tambahan</label>
                <input type="text" value={eduDesc} onChange={e=>setEduDesc(e.target.value)} placeholder="Fakultas Ekonomi dan Bisnis" className="w-full px-4 py-2.5 rounded-xl border text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase mb-1 block">Upload Logo Institusi</label>
                <input type="file" accept="image/*" onChange={e=>setEduLogoFile(e.target.files[0])} className="w-full text-xs text-slate-500 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-[#00236f] file:text-white cursor-pointer" />
              </div>
            </div>
            <button type="submit" className="py-2.5 px-5 rounded-xl bg-[#00236f] text-white font-bold text-xs hover:bg-[#1e3a8a] transition cursor-pointer">Tambah Riwayat Pendidikan</button>
          </form>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {educations.map(edu => (
              <div key={edu.id} className="p-4 rounded-xl border border-slate-200 flex justify-between items-center bg-slate-50">
                <div className="flex items-center gap-3">
                  {edu.logoUrl ? (
                    <img src={edu.logoUrl} alt="Logo" className="w-10 h-10 object-contain rounded-lg bg-white border p-1" />
                  ) : (
                    <div className="w-10 h-10 bg-blue-100 text-[#00236f] rounded-lg flex items-center justify-center font-bold text-xs">Logo</div>
                  )}
                  <div>
                    <span className="text-[10px] text-blue-600 font-bold">{edu.period}</span>
                    <h4 className="text-sm font-bold text-[#0b1c30]">{edu.degree}</h4>
                    <p className="text-xs text-slate-600">{edu.institution}</p>
                  </div>
                </div>
                <button onClick={() => handleDeleteEducation(edu.id)} className="text-red-500 hover:text-red-700 p-2 cursor-pointer"><Trash2 size={16}/></button>
              </div>
            ))}
          </div>
        </section>

        {/* KELOLA PORTOFOLIO */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-[#0b1c30] mb-2 flex items-center gap-2">
            <Plus size={20} className="text-[#00236f]" /> Kelola Portofolio & Studi Kasus
          </h2>
          
          {successMsg && (
            <div className="mb-6 bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-xl text-sm font-semibold flex items-center gap-3 shadow-sm">
              <CheckCircle size={20} className="text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleAddProject} className="space-y-4 mb-8 pb-8 border-b border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase mb-1 block">Judul Proyek</label>
                <input type="text" required value={title} onChange={e=>setTitle(e.target.value)} placeholder="Analisis Strategi..." className="w-full px-4 py-2.5 rounded-xl border text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase mb-1 block">Kategori</label>
                <select value={category} onChange={e=>setCategory(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border text-sm bg-white">
                  <option value="strategic">Manajemen Strategik</option>
                  <option value="financial">Kelayakan Finansial</option>
                  <option value="supplychain">Supply Chain & Organisasi</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase mb-1 block">Deskripsi</label>
              <textarea rows="3" required value={description} onChange={e=>setDescription(e.target.value)} placeholder="Deskripsi proyek..." className="w-full px-4 py-2.5 rounded-xl border text-sm"></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="url" value={link} onChange={e=>setLink(e.target.value)} placeholder="Link Eksternal (Opsional)" className="w-full px-4 py-2.5 rounded-xl border text-sm" />
              <input type="file" accept="image/*" onChange={e=>setImageFile(e.target.files[0])} className="w-full text-xs text-slate-500 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-[#00236f] file:text-white cursor-pointer" />
            </div>
            <button type="submit" className="py-2.5 px-5 rounded-xl bg-[#00236f] text-white font-bold text-xs hover:bg-[#1e3a8a] transition cursor-pointer">Simpan Portofolio</button>
          </form>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map(p => (
              <div key={p.id} className="p-4 rounded-xl border border-slate-200 flex justify-between items-start bg-slate-50">
                <div>
                  <span className="text-[10px] font-bold text-[#00236f] bg-blue-100 px-2 py-0.5 rounded">{p.category}</span>
                  <h3 className="text-sm font-bold text-[#0b1c30] mt-1">{p.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-1">{p.description}</p>
                </div>
                <button onClick={() => handleDeleteProject(p.id)} className="text-red-500 hover:text-red-700 p-2 cursor-pointer"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </section>

        {/* KOTAK MASUK */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-[#0b1c30] mb-4 flex items-center gap-2">
            <Mail size={20} className="text-[#00236f]" /> Kotak Masuk Pesan ({messages.length})
          </h2>
          <div className="space-y-4">
            {messages.length === 0 ? (
              <p className="text-xs text-slate-500">Belum ada pesan masuk dari pengunjung website.</p>
            ) : (
              messages.map(m => (
                <div key={m.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[#0b1c30]">{m.name} ({m.email})</span>
                    <span className="text-[10px] text-slate-400">{m.subject}</span>
                  </div>
                  <p className="text-xs text-slate-700 bg-white p-3 rounded-lg border">{m.message}</p>
                </div>
              ))
            )}
          </div>
        </section>

      </main>
    </div>
  );
}