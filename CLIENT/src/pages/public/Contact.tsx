import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Clock, Send, Sparkles, CheckCircle2, MessageSquare } from "lucide-react";
import { useStore } from "@/store";

export default function Contact() {
  const { settings } = useStore();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", contact: "", subject: "", message: "" });
    }, 4000);
  };

  return (
    <div className="pb-24 bg-gradient-to-b from-rose-50/20 via-white to-amber-50/20 min-h-screen">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary via-rose-600 to-amber-600 text-white pt-16 pb-28 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="container mx-auto max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-200 text-xs font-semibold mb-4 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Layanan Pelanggan & Informasi</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-heading mb-4 tracking-tight">Hubungi Kami</h1>
          <p className="text-white/90 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Pusat bantuan dan komunikasi resmi {settings.hospitalName || "RSIA Sayang Ibu Batusangkar"}. Kami siap mendengar dan melayani kebutuhan kesehatan Anda.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-10 max-w-5xl">
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Contact Info Cards */}
          <div className="md:col-span-1 space-y-4">
            <Card className="border border-amber-100/80 shadow-md rounded-3xl bg-white overflow-hidden">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-rose-50 text-primary flex items-center justify-center shrink-0 border border-rose-100">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold font-heading text-xs text-amber-800 uppercase tracking-wider mb-1">Alamat Resmi</h3>
                  <p className="text-xs md:text-sm font-medium text-slate-700 leading-relaxed">
                    {settings.address || "Jl. Soekarno Hatta No.123, Batusangkar, Kab. Tanah Datar, Sumatera Barat"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-amber-100/80 shadow-md rounded-3xl bg-white overflow-hidden">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold font-heading text-xs text-amber-800 uppercase tracking-wider mb-1">Telepon & CS</h3>
                  <p className="text-xs md:text-sm font-medium text-slate-700">{settings.phoneCs || "(0752) 123456"}</p>
                  <p className="text-xs md:text-sm font-medium text-emerald-700 mt-0.5">WA: {settings.whatsapp || "+62 811 2345 6789"}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-amber-100/80 shadow-md rounded-3xl bg-white overflow-hidden">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold font-heading text-xs text-amber-800 uppercase tracking-wider mb-1">Email Resmi</h3>
                  <p className="text-xs md:text-sm font-medium text-slate-700">{settings.email || "info@sayangibu.co.id"}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-amber-100/80 shadow-md rounded-3xl bg-white overflow-hidden">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold font-heading text-xs text-amber-800 uppercase tracking-wider mb-1">Jam Operasional</h3>
                  <p className="text-xs md:text-sm font-medium text-slate-700">IGD & Rawat Inap: 24 Jam Nonstop</p>
                  <p className="text-xs md:text-sm text-slate-500">Poliklinik: Sesuai Jadwal Dokter</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form & Maps */}
          <div className="md:col-span-2 space-y-6">
            <Card className="border border-amber-100/80 shadow-xl rounded-3xl bg-white overflow-hidden">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-6 border-b border-amber-100 pb-4">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold font-heading text-slate-900">Kirim Pesan atau Masukan</h2>
                    <p className="text-xs md:text-sm text-slate-500 mt-1">Tim kami akan merespons melalui nomor telepon atau email yang Anda sertakan.</p>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                </div>

                {submitted ? (
                  <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center py-10">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                    <h4 className="font-bold text-emerald-900 text-lg mb-1">Terima Kasih, Pesan Anda Terkirim!</h4>
                    <p className="text-xs md:text-sm text-emerald-700">
                      Pesan Anda telah diteruskan ke tim hubungan masyarakat {settings.hospitalName}. Kami akan segera menindaklanjuti.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-xs font-bold text-slate-700">Nama Lengkap *</Label>
                        <Input 
                          id="name" 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="Masukkan nama Anda" 
                          className="rounded-xl border-amber-200 h-11 text-sm focus-visible:ring-primary"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs font-bold text-slate-700">Nomor WhatsApp / Email *</Label>
                        <Input 
                          id="email" 
                          required
                          value={formData.contact}
                          onChange={(e) => setFormData({...formData, contact: e.target.value})}
                          placeholder="0812xxxx atau email@domain.com" 
                          className="rounded-xl border-amber-200 h-11 text-sm focus-visible:ring-primary"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="subject" className="text-xs font-bold text-slate-700">Perihal / Subjek</Label>
                      <Input 
                        id="subject" 
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        placeholder="Contoh: Informasi Jadwal Dokter, Fasilitas Rawat Inap" 
                        className="rounded-xl border-amber-200 h-11 text-sm focus-visible:ring-primary"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="message" className="text-xs font-bold text-slate-700">Pesan Anda *</Label>
                      <textarea 
                        id="message" 
                        required
                        rows={5} 
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="flex w-full rounded-2xl border border-amber-200 bg-white p-3 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        placeholder="Tuliskan pertanyaan, saran, atau kendala Anda..."
                      />
                    </div>
                    <Button type="submit" className="w-full sm:w-auto h-12 px-8 rounded-2xl bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 text-white font-bold shadow-md shadow-primary/20">
                      <Send className="w-4 h-4 mr-2" /> Kirim Pesan Sekarang
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Direct WhatsApp CTA Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold font-heading text-base md:text-lg">Butuh Bantuan Segera Melalui WhatsApp?</h4>
                <p className="text-xs text-emerald-100 mt-1">Konsultasi cepat dengan layanan pelanggan via chat WhatsApp resmi.</p>
              </div>
              <a 
                href={`https://wa.me/${(settings.whatsapp || "").replace(/[^0-9]/g, '')}`} 
                target="_blank" 
                rel="noreferrer"
                className="px-6 py-3 rounded-full text-xs font-bold bg-white text-emerald-800 hover:bg-emerald-50 transition-colors shadow-sm shrink-0"
              >
                Chat WhatsApp Sekarang
              </a>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

