import { useState, useEffect } from "react";
import { DoctorCard } from "@/components/cards/DoctorCard";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/select";
import { Search, Sparkles, UserCheck } from "lucide-react";
import { useStore } from "@/store";

export default function Doctors() {
  const { doctors, settings, fetchDoctors } = useStore();
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("Semua Spesialisasi");

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const specialties = ["Semua Spesialisasi", ...Array.from(new Set(doctors.map(d => d.specialty)))];

  const filteredDoctors = doctors.filter(doctor => {
    const matchSearch = doctor.name.toLowerCase().includes(search.toLowerCase()) || 
      doctor.specialty.toLowerCase().includes(search.toLowerCase());
    const matchSpecialty = specialty === "Semua Spesialisasi" || doctor.specialty === specialty;
    return matchSearch && matchSpecialty;
  });

  return (
    <div className="pb-24 bg-gradient-to-b from-rose-50/20 via-white to-amber-50/20 min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary via-rose-600 to-amber-600 text-white pt-16 pb-28 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="container mx-auto max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-200 text-xs font-semibold mb-4 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Dokter Spesialis & Tenaga Medis</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-heading mb-4 tracking-tight">
            Direktori Dokter Spesialis
          </h1>
          <p className="text-white/90 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Temukan dokter spesialis {settings.hospitalName || "RSIA Sayang Ibu Batusangkar"} yang siap melayani dengan kompetensi klinis tinggi dan kehangatan empati.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="container mx-auto px-4 -mt-10 relative z-10 max-w-5xl">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-xl border border-amber-100 p-4 md:p-6 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600" />
            <Input 
              placeholder="Cari nama dokter atau spesialisasi..." 
              className="pl-12 h-12 rounded-2xl border-amber-200/80 focus-visible:ring-primary text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-full md:w-72">
            <NativeSelect 
              className="h-12 rounded-2xl border-amber-200/80 focus:ring-primary text-sm bg-white"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
            >
              {specialties.map(sp => (
                <option key={sp} value={sp}>{sp}</option>
              ))}
            </NativeSelect>
          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="container mx-auto px-4 pt-12 max-w-6xl">
        <div className="flex justify-between items-center mb-8 border-b border-amber-100 pb-4">
          <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
            <UserCheck className="w-4 h-4 text-primary" />
            <span>Menampilkan {filteredDoctors.length} Dokter Terdaftar</span>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline">Pembaruan jadwal real-time</span>
        </div>

        {filteredDoctors.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-amber-100 p-8">
            <p className="text-slate-500 text-base mb-2">
              {doctors.length === 0 
                ? "Belum ada data dokter yang dipublikasikan saat ini."
                : `Tidak ditemukan dokter dengan kriteria pencarian "${search}".`}
            </p>
            {doctors.length > 0 && (
              <button 
                onClick={() => { setSearch(""); setSpecialty("Semua Spesialisasi"); }}
                className="text-xs font-bold text-primary underline"
              >
                Reset Filter Pencarian
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredDoctors.map(doctor => (
              <DoctorCard 
                key={doctor.id} 
                doctor={{
                  id: doctor.id,
                  name: doctor.name,
                  degree: doctor.specialty.includes("Sp.") ? doctor.specialty : "Spesialis " + doctor.specialty,
                  specialty: doctor.specialty,
                  status: doctor.status === "Aktif" ? "active" : "inactive",
                  slug: doctor.slug || doctor.id,
                  schedule: doctor.schedule,
                  image: doctor.image
                }} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
