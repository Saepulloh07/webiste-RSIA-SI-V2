import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { HeartPulse, Lock } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);

    setTimeout(() => {
      let role = "";
      if (email === "superadmin@sayangibu.co.id" && password === "admin123") {
        role = "Super Admin";
      } else if (email === "admin@sayangibu.co.id" && password === "admin123") {
        role = "Admin";
      } else if (email === "editor@sayangibu.co.id" && password === "admin123") {
        role = "Editor";
      }

      if (role) {
        localStorage.setItem("isAdminLoggedIn", "true");
        localStorage.setItem("adminRole", role);
        navigate("/admin");
      } else {
        setError(true);
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-18 bg-white rounded-full p-1.5 border-2 border-amber-300 ring-4 ring-primary/20 flex items-center justify-center shadow-lg aspect-square overflow-hidden">
              <img
                src="/logo-sayang-ibu-sm.png"
                alt="Logo RSIA Sayang Ibu"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => { (e.target as HTMLImageElement).src = "/logo.png"; }}
              />
            </div>
            <span className="font-heading font-bold text-2xl text-slate-900 mt-1">RSIA Sayang Ibu</span>
            <span className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-0.5 rounded-full">Sistem Manajemen & Konten</span>
          </div>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-1 pb-6 text-center">
            <CardTitle className="text-2xl font-bold font-heading">Selamat Datang</CardTitle>
            <CardDescription>
              Silakan login untuk mengakses dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                Kredensial tidak valid. Gunakan password "admin123" dengan email superadmin/admin/editor@sayangibu.co.id
              </Alert>
            )}

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-xs text-slate-600 mb-6 space-y-1">
              <p className="font-semibold mb-2">Akun Demo (Password: admin123):</p>
              <p>• <strong>superadmin</strong>@sayangibu.co.id</p>
              <p>• <strong>admin</strong>@sayangibu.co.id</p>
              <p>• <strong>editor</strong>@sayangibu.co.id</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Alamat Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="superadmin@sayangibu.co.id"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Kata Sandi</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full mt-6 h-11" disabled={isLoading}>
                {isLoading ? "Memverifikasi..." : (
                  <>
                    <Lock className="w-4 h-4 mr-2" /> Masuk ke Dashboard
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-slate-500 mt-8">
          &copy; {new Date().getFullYear()} RSIA Sayang Ibu Batusangkar. Hak Cipta Dilindungi.
        </p>
      </div>
    </div>
  );
}
