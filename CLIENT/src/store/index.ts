import { create } from 'zustand';

export type UserAdmin = {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Admin" | "Editor";
  lastLogin: string;
};

export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  status: "Aktif" | "Cuti" | "Nonaktif";
  schedule: string;
  image?: string;
  slug?: string;
  sipNumber?: string;
  poliklinik?: string;
  subspecialty?: string;
  bio?: string;
  education?: string[];
};

export type Service = {
  id: string;
  name: string;
  category: string;
  status: "Aktif" | "Nonaktif";
  description: string;
  image?: string;
  slug?: string;
  facilities?: string[];
  operationalHours?: string;
};

export type Article = {
  id: string;
  title: string;
  category: string;
  date: string;
  status: "Published" | "Draft";
  content: string;
  image?: string;
  slug?: string;
  author?: string;
  tags?: string[];
};

export type AdCampaign = {
  id: string;
  title: string;
  slug: string;
  startDate: string;
  endDate: string;
  status: "Aktif" | "Berakhir" | "Draft";
  content: string;
  image?: string;
  price?: string;
  originalPrice?: string;
  badge?: string;
  highlights?: string[];
  targetKeywords?: string;
  contactWa?: string;
};

export type MediaItem = {
  id: string;
  name: string;
  type: "image" | "video" | "document" | "slideshow" | "website_image";
  url: string;
  size: string;
  date: string;
  description?: string;
};

export type AppSettings = {
  hospitalName: string;
  slogan: string;
  aboutText: string;
  operationalHours: string;
  logoUrl: string;
  phoneCs: string;
  phoneEmergency: string;
  whatsapp: string;
  email: string;
  address: string;
  mapsUrl: string;
  mapsEmbed: string;
  instagram: string;
  facebook: string;
  youtube: string;
  tiktok: string;
};

export type RegistrationSettings = {
  isOpen: boolean;
  maxDailyQuota: number;
  noticeMessage: string;
};

export type JobVacancy = {
  id: string;
  title: string;
  department: string;
  type: "Full Time" | "Part Time" | "Kontrak";
  location: string;
  status: "Published" | "Draft";
  description: string;
  requirements: string;
  date: string;
  slug?: string;
  deadline?: string;
  contactEmail?: string;
  contactWa?: string;
  experience?: string;
};

export type Appointment = {
  id: string;
  patientName: string;
  phone: string;
  patientType: "baru" | "lama";
  paymentMethod: "umum" | "bpjs" | "asuransi";
  serviceId: string;
  doctorId: string;
  doctorName?: string;
  serviceName?: string;
  date: string;
  time?: string;
  notes?: string;
  status: "Menunggu" | "Dikonfirmasi" | "Selesai" | "Batal";
  createdAt: string;
};

interface AppState {
  users: UserAdmin[];
  doctors: Doctor[];
  services: Service[];
  articles: Article[];
  ads: AdCampaign[];
  media: MediaItem[];
  vacancies: JobVacancy[];
  appointments: Appointment[];
  settings: AppSettings;
  registrationSettings: RegistrationSettings;
  
  setUsers: (users: UserAdmin[]) => void;
  setDoctors: (doctors: Doctor[]) => void;
  setServices: (services: Service[]) => void;
  setArticles: (articles: Article[]) => void;
  setAds: (ads: AdCampaign[]) => void;
  setMedia: (media: MediaItem[]) => void;
  setVacancies: (vacancies: JobVacancy[]) => void;
  setAppointments: (appointments: Appointment[]) => void;
  addAppointment: (appointment: Appointment) => void;
  updateAppointmentStatus: (id: string, status: Appointment["status"]) => void;
  deleteAppointment: (id: string) => void;
  setSettings: (settings: AppSettings) => void;
  setRegistrationSettings: (settings: RegistrationSettings) => void;
}

const generateSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

export const useStore = create<AppState>((set) => ({
  users: [
    { id: "1", name: "Dr. Budi Santoso", email: "budi.admin@sayangibu.com", role: "Super Admin", lastLogin: "Hari ini, 08:30" },
    { id: "2", name: "Siti Rahmawati", email: "siti.marketing@sayangibu.com", role: "Editor", lastLogin: "Kemarin, 14:15" },
    { id: "3", name: "Ahmad Hidayat", email: "ahmad.it@sayangibu.com", role: "Admin", lastLogin: "12 Okt 2024, 09:00" },
  ],
  doctors: [
    { 
      id: "1", 
      name: "Dr. Amanda Saraswati, Sp.OG", 
      specialty: "Kandungan", 
      status: "Aktif", 
      schedule: "Senin - Jumat, 08:00 - 14:00", 
      slug: "dr-amanda-saraswati-spog", 
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80",
      sipNumber: "503/SIP.DS/DPM-PTSP/2021",
      poliklinik: "Poli Obgyn Lantai 2",
      subspecialty: "Fetomaternal, ERACS & Fertilitas",
      bio: "Dr. Amanda Saraswati, Sp.OG merupakan dokter spesialis kebidanan dan kandungan dengan pengalaman lebih dari 10 tahun. Berdedikasi mendampingi setiap tahapan kehamilan bunda dengan pendekatan personal, pemulihan persalinan ERACS minim nyeri, serta penanganan kehamilan risiko tinggi secara komprehensif.",
      education: [
        "Spesialis Obstetri & Ginekologi - Fakultas Kedokteran Universitas Andalas",
        "Pendidikan Dokter Umum - Universitas Padjadjaran",
        "Sertifikasi USG Fetomaternal & Laparoskopi Ginekologi Nasional",
        "Anggota Perkumpulan Obstetri dan Ginekologi Indonesia (POGI) & IDI"
      ]
    },
    { 
      id: "2", 
      name: "Dr. Budi Santoso, Sp.A", 
      specialty: "Anak", 
      status: "Aktif", 
      schedule: "Selasa & Kamis, 14:00 - 20:00", 
      slug: "dr-budi-santoso-spa", 
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80",
      sipNumber: "503/SIP.DS/DPM-PTSP/2020",
      poliklinik: "Poli Anak Ramah Balita Lantai 1",
      subspecialty: "Tumbuh Kembang & Nutrisi Pediatrik",
      bio: "Dr. Budi Santoso, Sp.A berfokus pada pendampingan tumbuh kembang 1000 hari pertama kehidupan, imunisasi dasar lengkap, serta penanganan alergi dan infeksi pada bayi dan anak-anak dengan suasana periksa yang hangat dan ramah anak.",
      education: [
        "Spesialis Ilmu Kesehatan Anak - Fakultas Kedokteran Universitas Indonesia",
        "Pendidikan Dokter Umum - Universitas Gadjah Mada",
        "Pelatihan Resusitasi Neonatus & Manajemen Laktasi Terpadu",
        "Anggota Ikatan Dokter Anak Indonesia (IDAI)"
      ]
    },
    { 
      id: "3", 
      name: "Dr. Citra Lestari, Sp.OG(K)", 
      specialty: "Kandungan", 
      status: "Cuti", 
      schedule: "Konfirmasi Terlebih Dahulu", 
      slug: "dr-citra-lestari-spog-k", 
      image: "https://images.unsplash.com/photo-1594824436998-d40b2f568600?w=400&q=80",
      sipNumber: "503/SIP.DS/DPM-PTSP/2019",
      poliklinik: "Poli Konsultan Eksekutif",
      subspecialty: "Konsultan Onkologi Ginekologi & Hormon",
      bio: "Dr. Citra Lestari, Sp.OG(K) merupakan konsultan ahli kesehatan reproduksi wanita yang fokus pada pemeriksaan skrining serviks, hormon, dan terapi pra-kehamilan.",
      education: [
        "Konsultan Subspesialis Ginekologi - FKUI",
        "Pendidikan Spesialis Obgyn - FK Unand",
        "Anggota Dewan Pembina Komite Mutu Medis RSIA Sayang Ibu"
      ]
    },
  ],
  services: [
    { 
      id: "1", 
      name: "Kandungan & Kebidanan (Obgyn)", 
      category: "Poliklinik", 
      status: "Aktif", 
      description: "Pelayanan komprehensif bagi kesehatan reproduksi wanita, perencanaan kehamilan, masa kehamilan, hingga persalinan dan masa nifas.", 
      slug: "kandungan-kebidanan", 
      image: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=400&q=80",
      operationalHours: "Senin - Sabtu: 08:00 - 20:00 (UGD Bersalin 24 Jam)",
      facilities: [
        "Pemeriksaan USG 2D/3D/4D Fetomaternal Berdefinisi Tinggi",
        "Kamar Bersalin (VK) Standar Rumah Sakit Ibu & Anak",
        "Persalinan Normal & Operasi Caesar (Metode ERACS)",
        "Konsultasi Program Hamil & Kesehatan Reproduksi",
        "Skrining Kelainan Kongenital Trimester Awal"
      ]
    },
    { 
      id: "2", 
      name: "Spesialis Anak", 
      category: "Poliklinik", 
      status: "Aktif", 
      description: "Pemeriksaan dan perawatan bayi serta anak-anak secara komprehensif didukung ruang tunggu ramah anak.", 
      slug: "spesialis-anak", 
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=80",
      operationalHours: "Senin - Sabtu: 08:00 - 18:00",
      facilities: [
        "Poli Tumbuh Kembang & Nutrisi Anak",
        "Imunisasi Dasar Lengkap & Vaksinasi Tambahan",
        "Perawatan Intensif Perinatologi & Inkubator",
        "Kamar Rawat Inap Khusus Anak Ramah Balita",
        "Konsultasi Alergi dan Saluran Cerna Anak"
      ]
    },
    { 
      id: "3", 
      name: "Laboratorium 24 Jam", 
      category: "Penunjang Medis", 
      status: "Aktif", 
      description: "Pemeriksaan laboratorium lengkap, cepat, dan akurat siaga 24 jam penuh.", 
      slug: "laboratorium-24-jam", 
      image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&q=80",
      operationalHours: "24 Jam Penuh Setiap Hari",
      facilities: [
        "Pemeriksaan Darah Lengkap Otomatis",
        "Tes Hormon Kehamilan & Skrining TORCH",
        "Pemeriksaan Urine Rutin & Kimia Darah",
        "Layanan Laboratorium Siaga 24 Jam Penuh"
      ]
    },
  ],
  articles: [
    { 
      id: "1", 
      title: "Mengenal Persalinan Metode ERACS di RSIA Sayang Ibu Batusangkar: Cepat Pulih & Minim Nyeri", 
      category: "Kebidanan & Kandungan", 
      date: "14 Okt 2024", 
      status: "Published", 
      content: "<h2>Apa itu Metode Persalinan ERACS?</h2><p>Enhanced Recovery After Cesarean Surgery (ERACS) merupakan protokol modern persalinan caesar yang dirancang untuk mempercepat proses pemulihan ibu pasca operasi dengan tingkat nyeri yang minimal. Di <strong>RSIA Sayang Ibu Batusangkar</strong>, protokol ini dijalankan oleh tim dokter spesialis kandungan (Sp.OG), dokter spesialis anestesi, dan dokter spesialis anak berpengalaman.</p><h3>Keunggulan Metode ERACS:</h3><ul><li><strong>Mobilisasi Lebih Dini:</strong> 2 jam pasca tindakan pasien sudah dapat duduk dan berlatih berdiri.</li><li><strong>Bebas Mual & Pusing:</strong> Formulasi anestesi terkontrol meminimalkan efek samping obat bius.</li><li><strong>Inisiasi Menyusu Dini (IMD) Lebih Cepat:</strong> Bonding ibu dan bayi baru lahir dapat segera terlaksana dalam suasana nyaman.</li><li><strong>Masa Rawat Inap Lebih Singkat:</strong> Rata-rata ibu sudah dapat pulang dengan bugar dalam 24-48 jam.</li></ul><p>Konsultasikan rencana persalinan nyaman Anda bersama dokter kandungan RSIA Sayang Ibu di Batusangkar, Kabupaten Tanah Datar.</p>", 
      slug: "persalinan-metode-eracs-batusangkar", 
      image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&q=80" 
    },
    { 
      id: "2", 
      title: "Pentingnya Imunisasi Dasar Lengkap pada 1000 Hari Pertama Kehidupan Anak", 
      category: "Kesehatan Anak", 
      date: "12 Okt 2024", 
      status: "Published", 
      content: "<h2>Investasi Masa Depan Buah Hati</h2><p>Masa 1000 hari pertama kehidupan (sejak dalam kandungan hingga usia 2 tahun) merupakan periode emas (golden period) pertumbuhan otak dan sistem kekebalan tubuh anak. Memberikan <strong>imunisasi dasar lengkap</strong> sesuai jadwal IDAI di poliklinik anak RSIA Sayang Ibu Batusangkar memberikan benteng perlindungan terhadap penyakit berbahaya seperti Hepatitis B, Polio, DPT, Hib, PCV, dan Rotavirus.</p><h3>Tips Menghadapi Pasca Imunisasi:</h3><p>Berikan ASI lebih sering, pantau suhu tubuh secara berkala, dan komunikasikan dengan dokter spesialis anak kami apabila anak mengalami demam ringan yang wajar sebagai respon pembentukan antibodi.</p>", 
      slug: "pentingnya-imunisasi-dasar-anak", 
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80" 
    },
    { 
      id: "3", 
      title: "Manfaat Pemeriksaan USG 4D Fetomaternal untuk Deteksi Dini Kelainan Janin", 
      category: "Kehamilan", 
      date: "10 Okt 2024", 
      status: "Published", 
      content: "<h2>Melihat Lebih Jelas Tumbuh Kembang Janin</h2><p>Pemeriksaan Ultrasonografi 4 Dimensi (USG 4D) di RSIA Sayang Ibu Batusangkar memungkinkan orang tua melihat ekspresi wajah dan gerakan bayi secara nyata (real-time). Lebih dari itu, secara klinis USG 4D berfungsi sebagai skrining detail organ anatomi janin, jantung, aliran darah tali pusat, hingga posisi plasenta dan kecukupan air ketuban oleh dokter spesialis kandungan.</p>", 
      slug: "manfaat-usg-4d-fetomaternal-batusangkar", 
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80" 
    },
    { 
      id: "4", 
      title: "Tips Mengatasi Mual Muntah (Morning Sickness) Trimester Pertama", 
      category: "Kehamilan", 
      date: "08 Okt 2024", 
      status: "Published", 
      content: "<p>Banyak ibu hamil di awal kehamilan mengalami mual dan muntah akibat lonjakan hormon hCG. Konsumsi makanan dalam porsi kecil namun sering, hindari aroma menyengat, serta cukupi kebutuhan cairan dengan air hangat atau teh jahe. Jika mual berlebih hingga tidak dapat makan, segera konsultasikan ke RSIA Sayang Ibu Batusangkar.</p>", 
      slug: "tips-mengatasi-mual-trimester-pertama", 
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80" 
    }
  ],
  ads: [
    { 
      id: "1", 
      title: "Promo Persalinan Caesar ERACS 2024 - Cepat Pulih & Minim Nyeri", 
      slug: "promo-persalinan-eracs-2024", 
      startDate: "2024-10-01", 
      endDate: "2024-12-31", 
      status: "Aktif", 
      content: "Dapatkan paket persalinan metode ERACS terjangkau di RSIA Sayang Ibu Batusangkar. Sudah termasuk kamar perawatan VIP, obat-obatan dasar, tindakan dokter spesialis kandungan dan anak, serta inisiasi menyusu dini (IMD).", 
      image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&q=80",
      price: "Rp 6.800.000",
      originalPrice: "Rp 8.500.000",
      badge: "Diskon 20% Terbatas",
      highlights: [
        "Metode ERACS: Bisa duduk 2 jam pasca tindakan",
        "Kamar Rawat Inap VIP eksklusif dan nyaman",
        "Didampingi Dokter Spesialis Obgyn & Dokter Anak",
        "Sudah termasuk obat-obatan paten & administrasi",
        "Free souvenir bayi & dokumentasi momen persalinan"
      ],
      targetKeywords: "promo persalinan eracs batusangkar, operasi sesar murah tanah datar, rsia sayang ibu promo melahirkan, dokter kandungan batusangkar"
    },
    { 
      id: "2", 
      title: "Paket USG 4D Fetomaternal Lengkap & Cetak Foto Realtime", 
      slug: "paket-usg-4d-fetomaternal-batusangkar", 
      startDate: "2024-10-05", 
      endDate: "2024-12-31", 
      status: "Aktif", 
      content: "Skrining anatomi organ janin lengkap bersama Dokter Spesialis Kandungan. Dapatkan hasil foto USG 4D definisi tinggi, rekaman video klip janin di smartphone, dan buku evaluasi berat badan janin.", 
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80",
      price: "Rp 250.000",
      originalPrice: "Rp 350.000",
      badge: "Best Seller",
      highlights: [
        "Pemeriksaan detail organ vital janin",
        "Cetak foto 4D berwarna kualitas studio",
        "File video klip gerakan janin via WhatsApp/Drive",
        "Konsultasi nutrisi dan taksiran persalinan"
      ],
      targetKeywords: "usg 4d batusangkar promo, usg fetomaternal tanah datar, biaya usg 4d rsia sayang ibu, dokter obgyn usg 4d"
    },
    { 
      id: "3", 
      title: "Paket Persalinan Normal Nyaman & Pendampingan Bidan 24 Jam", 
      slug: "paket-persalinan-normal-nyaman", 
      startDate: "2024-10-10", 
      endDate: "2024-12-31", 
      status: "Aktif", 
      content: "Sambut kelahiran buah hati dengan rasa tenang dan penuh cinta. Fasilitas kamar bersalin privat, terapi relaksasi pernapasan, serta perawatan tali pusat bayi.", 
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
      price: "Rp 3.500.000",
      originalPrice: "Rp 4.500.000",
      badge: "Paket Favorit",
      highlights: [
        "Fasilitas ruang persalinan privat ber-AC",
        "Pendampingan suami/keluarga secara leluasa",
        "Pemeriksaan laboratorium darah rutin & golongan darah",
        "Pemeriksaan bayi baru lahir oleh Dokter Spesialis Anak"
      ],
      targetKeywords: "melahirkan normal batusangkar, biaya melahirkan normal tanah datar, rsia sayang ibu bersalin normal"
    }
  ],
  media: [
    { id: "1", name: "hero-banner-1.jpg", type: "slideshow", url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1600&auto=format&fit=crop", size: "2.4 MB", date: "12 Okt 2024" },
    { id: "2", name: "hospital-tour", type: "video", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", size: "Link", date: "10 Okt 2024" }
  ],
  settings: {
    hospitalName: "RSIA Sayang Ibu",
    slogan: "Pelayanan Medis Sepenuh Hati",
    aboutText: "Fasilitas kesehatan ibu dan anak berstandar tinggi, didukung oleh tenaga medis spesialis profesional yang berdedikasi tinggi.",
    operationalHours: "UGD 24 Jam | Poli: Senin - Sabtu 08:00 - 20:00",
    logoUrl: "/logo.png",
    phoneCs: "(0752) 123456",
    phoneEmergency: "(0752) 123456",
    whatsapp: "+6281123456789",
    email: "info@sayangibu.co.id",
    address: "Jl. Soekarno Hatta No.123, Batusangkar, Kab. Tanah Datar, Sumatera Barat",
    mapsUrl: "https://maps.google.com/...",
    mapsEmbed: '<iframe src="https://www.google.com/maps/embed?pb=..." width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>',
    instagram: "https://instagram.com/rsiasayangibu",
    facebook: "https://facebook.com/rsiasayangibu",
    youtube: "https://youtube.com/@rsiasayangibu",
    tiktok: ""
  },
  registrationSettings: {
    isOpen: true,
    maxDailyQuota: 50,
    noticeMessage: "Harap datang 30 menit sebelum jadwal konsultasi."
  },
  vacancies: [
    {
      id: "1",
      title: "Perawat Pelaksana (IGD)",
      department: "Keperawatan",
      type: "Full Time",
      location: "Batusangkar",
      status: "Published",
      description: "<p>Kami mencari perawat IGD yang tanggap dan berdedikasi tinggi.</p>",
      requirements: "<p>- S1 Keperawatan / Ners<br>- Memiliki STR aktif<br>- Pengalaman minimal 1 tahun di IGD</p>",
      date: "12 Okt 2024",
      slug: "perawat-pelaksana-igd",
      deadline: "30 November 2024",
      contactEmail: "hrd@sayangibu.co.id",
      contactWa: "+6281123456789",
      experience: "Minimal 1 Tahun di Rumah Sakit"
    }
  ],
  appointments: [
    {
      id: "REG-839201",
      patientName: "Ny. Ratna Sari",
      phone: "+6281298765432",
      patientType: "lama",
      paymentMethod: "bpjs",
      serviceId: "1",
      serviceName: "Kandungan & Kebidanan (Obgyn)",
      doctorId: "1",
      doctorName: "Dr. Amanda Saraswati, Sp.OG",
      date: "2024-10-25",
      time: "09:00",
      notes: "Kontrol kehamilan trimester 3, rencana persalinan metode ERACS.",
      status: "Menunggu",
      createdAt: "24 Okt 2024, 10:15"
    },
    {
      id: "REG-718290",
      patientName: "An. Budi (Ibu Siti)",
      phone: "+6281345678901",
      patientType: "baru",
      paymentMethod: "umum",
      serviceId: "2",
      serviceName: "Spesialis Anak",
      doctorId: "2",
      doctorName: "Dr. Budi Santoso, Sp.A",
      date: "2024-10-25",
      time: "14:30",
      notes: "Vaksinasi PCV dan konsultasi berat badan anak.",
      status: "Dikonfirmasi",
      createdAt: "24 Okt 2024, 08:30"
    },
    {
      id: "REG-556123",
      patientName: "Ny. Linda Hermawan",
      phone: "+6282176543210",
      patientType: "lama",
      paymentMethod: "asuransi",
      serviceId: "1",
      serviceName: "Kandungan & Kebidanan (Obgyn)",
      doctorId: "1",
      doctorName: "Dr. Amanda Saraswati, Sp.OG",
      date: "2024-10-24",
      time: "10:00",
      notes: "Pemeriksaan USG 4D Fetomaternal berkala.",
      status: "Selesai",
      createdAt: "23 Okt 2024, 16:45"
    }
  ],
  
  setUsers: (users) => set({ users }),
  setDoctors: (doctors) => set({ doctors: doctors.map(d => ({...d, slug: d.slug || generateSlug(d.name)})) }),
  setServices: (services) => set({ services: services.map(s => ({...s, slug: s.slug || generateSlug(s.name)})) }),
  setArticles: (articles) => set({ articles: articles.map(a => ({...a, slug: a.slug || generateSlug(a.title)})) }),
  setAds: (ads) => set({ ads }),
  setMedia: (media) => set({ media }),
  setVacancies: (vacancies) => set({ vacancies: vacancies.map(v => ({...v, slug: v.slug || generateSlug(v.title)})) }),
  setAppointments: (appointments) => set({ appointments }),
  addAppointment: (appointment) => set((state) => ({ appointments: [appointment, ...state.appointments] })),
  updateAppointmentStatus: (id, status) => set((state) => ({
    appointments: state.appointments.map(a => a.id === id ? { ...a, status } : a)
  })),
  deleteAppointment: (id) => set((state) => ({
    appointments: state.appointments.filter(a => a.id !== id)
  })),
  setSettings: (settings) => set({ settings }),
  setRegistrationSettings: (registrationSettings) => set({ registrationSettings })
}));
