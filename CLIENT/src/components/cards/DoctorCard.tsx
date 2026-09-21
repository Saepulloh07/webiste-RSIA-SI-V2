import { Doctor } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, Clock, UserRound } from "lucide-react";
import { MediaWatermark } from "@/components/common/MediaWatermark";

interface DoctorCardProps {
  doctor: {
    id: string;
    name: string;
    specialty: string;
    degree?: string;
    image?: string;
    schedule?: any;
    status?: string;
    slug?: string;
  };
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 border-border/70 hover:border-amber-200 group bg-white">
      <div className="aspect-[4/3] bg-gradient-to-b from-slate-100 to-slate-200/50 relative overflow-hidden flex items-end justify-center pt-6">
        {doctor.image ? (
          <img
            src={doctor.image}
            alt={doctor.name}
            loading="lazy"
            decoding="async"
            className="object-cover object-top w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <UserRound className="w-24 h-24 text-muted-foreground/30 mb-[-1rem]" />
        )}

        {/* Specialty badge on Top-Left */}
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-white/95 text-slate-800 shadow-sm border border-amber-200/80 font-semibold text-xs backdrop-blur-sm">
            {doctor.specialty}
          </Badge>
        </div>

        {/* Proportional Hospital Logo Watermark on Top-Right */}
        <MediaWatermark size="sm" />
      </div>
      <CardHeader className="pb-3 text-center">
        <h3 className="font-heading font-bold text-lg leading-tight line-clamp-1 text-slate-800 group-hover:text-primary transition-colors" title={doctor.name}>
          {doctor.name}
        </h3>
        <p className="text-sm text-primary font-medium">{doctor.degree || "Dokter Spesialis"}</p>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <div className="bg-slate-50/80 rounded-xl p-3 text-sm text-muted-foreground flex flex-col gap-2 border border-slate-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-tertiary" />
            <span className="font-medium text-slate-700 text-xs">Jadwal Praktik:</span>
          </div>
          <div className="flex items-start gap-2 text-xs text-slate-600">
            <Clock className="w-4 h-4 mt-0.5 text-secondary shrink-0" />
            <div className="leading-relaxed">
              {doctor.schedule || "Hubungi admin untuk jadwal terkini."}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex gap-2">
        <Button variant="outline" className="w-full text-xs h-9 border-slate-200 hover:border-primary hover:text-primary" asChild>
          <Link to={`/dokter/${doctor.slug}`}>Profil Lengkap</Link>
        </Button>
        <Button className="w-full text-xs h-9 bg-primary hover:bg-primary-hover text-white shadow-sm" asChild>
          <Link to={`/pendaftaran?dokter=${doctor.slug}`}>Buat Janji</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
