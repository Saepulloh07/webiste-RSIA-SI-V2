import { useStore } from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, Clock, Sparkles, Send, CheckCircle2 } from "lucide-react";

export default function Vacancies() {
  const { vacancies, settings } = useStore();
  
  const activeVacancies = vacancies.filter(v => v.status === "Published");

  return (
    <div className="pb-24 bg-gradient-to-b from-rose-50/20 via-white to-amber-50/20 min-h-screen">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary via-rose-600 to-amber-600 text-white pt-16 pb-28 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="container mx-auto max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-200 text-xs font-semibold mb-4 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Karir & Peluang Bergabung</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-heading mb-4 tracking-tight">
            Tumbuh & Berkarya Bersama Kami
          </h1>
          <p className="text-white/90 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Bergabunglah bersama keluarga besar tenaga medis dan staf profesional {settings.hospitalName || "RSIA Sayang Ibu Batusangkar"} dalam melayani dengan dedikasi penuh kasih.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-10 max-w-4xl">
        {activeVacancies.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-amber-100 shadow-sm p-8">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-100">
              <Briefcase className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-heading mb-2 text-slate-800">Belum Ada Lowongan Aktif</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Saat ini seluruh formasi telah terisi. Pantau terus halaman ini atau media sosial kami untuk pengumuman rekrutmen gelombang berikutnya.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {activeVacancies.map((vacancy) => (
              <Card key={vacancy.id} className="border border-amber-100 shadow-md hover:shadow-xl transition-all duration-300 rounded-3xl bg-white overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-amber-50/40 via-rose-50/20 to-white pb-4 border-b border-amber-100/60">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge className="bg-rose-50 text-primary border border-rose-200 text-xs font-bold px-2.5 py-0.5">
                          {vacancy.department}
                        </Badge>
                        <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-0.5">
                          Aktif
                        </Badge>
                      </div>
                      <CardTitle className="text-xl md:text-2xl font-bold font-heading text-slate-900 mb-2">
                        {vacancy.title}
                      </CardTitle>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-amber-600"/> {vacancy.type}</div>
                        <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-amber-600"/> {vacancy.location}</div>
                        {vacancy.experience && (
                          <div className="flex items-center gap-1.5 font-medium text-slate-700">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> {vacancy.experience}
                          </div>
                        )}
                        <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-amber-600"/> Dipublikasikan {vacancy.date}</div>
                        {vacancy.deadline && (
                          <div className="flex items-center gap-1.5 text-rose-600 font-semibold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                            Batas Lamaran: {vacancy.deadline}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                      {vacancy.contactEmail && (
                        <Button 
                          variant="outline"
                          className="rounded-2xl border-amber-200 text-slate-700 hover:bg-amber-50 font-semibold text-xs h-11 px-4"
                          onClick={() => window.open(`mailto:${vacancy.contactEmail}?subject=Lamaran Pekerjaan - ${encodeURIComponent(vacancy.title)}`, '_blank')}
                        >
                          Email CV
                        </Button>
                      )}
                      <Button 
                        className="rounded-2xl bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 text-white font-bold text-xs h-11 px-5 shadow-md shadow-primary/20"
                        onClick={() => {
                          const targetWa = (vacancy.contactWa || settings.whatsapp || "").replace(/\D/g, '');
                          window.open(`https://wa.me/${targetWa}?text=Halo%20Tim%20HRD%20RSIA%20Sayang%20Ibu,%20saya%20tertarik%20melamar%20posisi%20${encodeURIComponent(vacancy.title)}`, '_blank');
                        }}
                      >
                        <Send className="w-3.5 h-3.5 mr-1.5" /> Lamar via WA
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 p-6 md:p-8">
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-amber-800 mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Deskripsi Pekerjaan
                    </h4>
                    <div className="prose prose-sm text-slate-600 max-w-none text-xs md:text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: vacancy.description }} />
                  </div>
                  <div className="pt-4 border-t border-slate-100">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-amber-800 mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Kualifikasi & Persyaratan
                    </h4>
                    <div className="prose prose-sm text-slate-600 max-w-none text-xs md:text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: vacancy.requirements }} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

