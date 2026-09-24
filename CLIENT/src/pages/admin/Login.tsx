import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { Lock, Loader2 } from "lucide-react";
import { api, setAuthSession } from "@/app/api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // 1. Authenticate against Backend API
      const res = await api.auth.login({ email, password });
      if (res?.data?.token && res?.data?.user) {
        setAuthSession(
          res.data.token,
          res.data.refreshToken,
          res.data.user.role,
          res.data.user
        );
        navigate("/admin");
        return;
      }
    } catch (err: any) {
      console.warn("Backend auth response/error:", err);

      // Check if it's an invalid credentials error from backend
      if (err.status === 401 || err.status === 400) {
        setErrorMessage(err.message || "Email atau kata sandi salah. Silakan periksa kembali.");
        setIsLoading(false);
        return;
      }

      // 2. Fallback for offline demo mode if backend is unreachable
      let role = "";
      if (email === "superadmin@sayangibu.co.id" && (password === "admin123" || password === "ChangeMe123!")) {
        role = "Super Admin";
      } else if (email === "admin@sayangibu.co.id" && password === "admin123") {
        role = "Admin";
      } else if (email === "editor@sayangibu.co.id" && password === "admin123") {
        role = "Editor";
      }

      if (role) {
        setAuthSession("demo_offline_token", undefined, role, {
          id: "1",
          name: `${role} Demo`,
          email,
          role,
        });
        navigate("/admin");
        return;
      }

      setErrorMessage(
        err.message || "Gagal menghubungi server. Periksa koneksi backend Anda."
      );
    } finally {
      setIsLoading(false);
    }
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
              Silakan login untuk mengakses dashboard CMS
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <Alert variant="destructive" className="mb-6">
                {errorMessage}
              </Alert>
            )}

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-xs text-slate-600 mb-6 space-y-1">
              <p className="font-semibold mb-2">Akun Default CMS:</p>
              <p>• <strong>superadmin@sayangibu.co.id</strong> (Password: admin123 / ChangeMe123!)</p>
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
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Memverifikasi...
                  </>
                ) : (
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
