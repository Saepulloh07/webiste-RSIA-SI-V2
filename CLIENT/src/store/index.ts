import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  shortDescription?: string;
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

const initialSettings: AppSettings = {
  hospitalName: "RSIA Sayang Ibu",
  slogan: "Pelayanan Medis Sepenuh Hati",
  aboutText: "RSIA Sayang Ibu Batusangkar berdedikasi menghadirkan pelayanan kesehatan ibu dan anak yang paripurna dengan standar keselamatan pasien tinggi dan tenaga medis profesional di Kabupaten Tanah Datar.",
  operationalHours: "UGD 24 Jam | Poli: Senin - Sabtu 08:00 - 20:00",
  logoUrl: "/logo-sayang-ibu-sm.png",
  phoneCs: "",
  phoneEmergency: "",
  whatsapp: "",
  email: "",
  address: "Batusangkar, Kab. Tanah Datar, Sumatera Barat",
  mapsUrl: "",
  mapsEmbed: "",
  instagram: "",
  facebook: "",
  youtube: "",
  tiktok: ""
};

const initialRegistrationSettings: RegistrationSettings = {
  isOpen: true,
  maxDailyQuota: 50,
  noticeMessage: ""
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      users: [],
      doctors: [],
      services: [],
      articles: [],
      ads: [],
      media: [],
      vacancies: [],
      appointments: [],
      settings: initialSettings,
      registrationSettings: initialRegistrationSettings,
      
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
    }),
    {
      name: 'rsia_sayang_ibu_store_v2',
    }
  )
);
