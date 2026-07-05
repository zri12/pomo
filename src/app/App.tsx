import { useState } from "react";
import {
  Search, Mic, Map as MapIcon, History, Bell, User,
  Navigation, Fuel, ChevronRight,
  Droplets, Coffee, ShoppingBag, CreditCard, Wind, Bath,
  Sparkles, X, LogOut, Eye, EyeOff, ArrowRight,
  Mail, Lock, UserCircle2, Radar,
  Settings, HelpCircle, Phone, Calendar,
  Filter, Star, CheckCircle2, Clock, Car, Activity, Gauge, MapPin,
  Trash2, MessageSquare, BadgeCheck, RefreshCw, Megaphone, Video, Radio, AlertTriangle, Download, ChevronDown, Sun, Moon, Camera, Maximize
} from "lucide-react";
import { MobilePetaView } from "./components/MobilePetaView";
import {
  MobileMenuHome, MobileHistoriView, MobileBayarView,
  MobileNotifView, MobileProfilView,
} from "./components/MobileViews";
import { addReviewHistory, formatReviewDate, getReviewHistory, removeReviewHistory } from "./reviewHistory";

/* =========================================================
   POMO · Pom Monitor — Web Dashboard
   ========================================================= */

const C = {
  navy: "var(--pomo-navy)", navyDeep: "var(--pomo-navy-deep)", blue: "var(--pomo-blue)",
  softBlue: "var(--pomo-soft-blue)", lightBlue: "var(--pomo-light-blue)", bluePale: "var(--pomo-blue-pale)",
  tan: "#D8BA98", alabaster: "var(--pomo-alabaster)", cream: "var(--pomo-cream)",
  maroon: "var(--pomo-maroon)", red: "var(--pomo-red)", redPale: "var(--pomo-red-pale)",
  green: "var(--pomo-green)", greenPale: "var(--pomo-green-pale)",
  yellow: "var(--pomo-yellow)", yellowPale: "var(--pomo-yellow-pale)",
  orange: "var(--pomo-orange)", orangePale: "var(--pomo-orange-pale)",
  ink: "var(--pomo-ink)", sub: "var(--pomo-sub)", line: "var(--pomo-line)", bg: "var(--pomo-bg)",
};
const FONT = { fontFamily: "Montserrat, ui-sans-serif, system-ui" };


const FUELS = [
  { name: "Solar Subsidi",    price: 6800,  color: C.green,  category: "Diesel · Subsidi" },
  { name: "Pertalite",        price: 10000, color: C.green,  category: "Gasoline · RON 90" },
  { name: "Pertamax",         price: 12300, color: C.softBlue, category: "Gasoline · RON 92" },
  { name: "Pertamax Green 95",price: 12900, color: C.green,  category: "Gasoline · RON 95" },
  { name: "Pertamax Turbo",   price: 20750, color: C.red,    category: "Gasoline · RON 98" },
  { name: "Dexlite",          price: 23000, color: C.orange, category: "Diesel · CN 51" },
  { name: "Pertamina Dex",    price: 24800, color: C.maroon, category: "Diesel · CN 53" },
];
const rp = (n: number) => "Rp" + n.toLocaleString("id-ID");

type Screen =
  | "landing" | "signin" | "register"
  | "peta" | "histori" | "bayar" | "notif" | "profil"
  | "logout" | "admin";

const NAV: { id: Screen; label: string; icon: any }[] = [
  { id: "peta",    label: "Peta SPBU",        icon: MapIcon },
  { id: "bayar",   label: "Cek Stok BBM",     icon: Fuel },
  { id: "histori", label: "Histori Kunjungan",icon: History },
  { id: "notif",   label: "Update Kondisi",   icon: Activity },
  { id: "profil",  label: "Profil",           icon: User },
];

/* ---------- Helpers ---------- */
function Badge({ color, bg, children }: any) {
  return (
    <span style={{
      background: bg, color, fontSize: 11, fontWeight: 700, padding: "5px 10px",
      borderRadius: 999, display: "inline-flex", alignItems: "center", gap: 5,
    }}>{children}</span>
  );
}
const Dot = ({ color }: any) => (
  <span style={{ width: 8, height: 8, borderRadius: 99, background: color, display: "inline-block" }} />
);
function Card({ children, style }: any) {
  return (
    <div style={{
      background: "var(--pomo-white)", borderRadius: 18, padding: 20,
      boxShadow: "0 8px 24px rgba(12,50,74,.06)", border: `1px solid ${C.line}`,
      ...style,
    }}>{children}</div>
  );
}
function PrimaryBtn({ onClick, children, style }: any) {
  return (
    <button onClick={onClick} style={{
      background: `linear-gradient(135deg, ${C.navy}, ${C.blue})`, color: "var(--pomo-white)",
      padding: "12px 22px", borderRadius: 12, fontWeight: 700, fontSize: 13,
      border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8,
      boxShadow: `0 10px 22px ${C.navy}40`, ...style,
    }}>{children}</button>
  );
}
function GhostBtn({ onClick, children, style }: any) {
  return (
    <button onClick={onClick} style={{
      background: "var(--pomo-white)", color: C.navy, padding: "11px 20px", borderRadius: 12,
      fontWeight: 700, fontSize: 13, border: `1.5px solid ${C.navy}`, cursor: "pointer",
      display: "inline-flex", alignItems: "center", gap: 8, ...style,
    }}>{children}</button>
  );
}

/* =========================================================
   LANDING PAGE
   ========================================================= */
function Landing({ go }: { go: (s: Screen) => void }) {
  const bg = "https://images.unsplash.com/photo-1761513599002-433d167becc1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=2000&q=85";
  return (
    <div style={{
      ...FONT, position: "relative", minHeight: "100vh", overflow: "hidden",
      color: "var(--pomo-white)",
    }}>
      {/* Background photo */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover", backgroundPosition: "center",
        filter: "saturate(1.05)",
      }} />
      {/* Color wash */}
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(120deg, ${C.navyDeep}EE 0%, ${C.navy}C8 35%, ${C.blue}80 65%, rgba(6,33,47,.55) 100%)`,
      }} />
      {/* Warm canopy glow bottom-right */}
      <div style={{
        position: "absolute", right: "-10%", bottom: "-20%", width: "55%", height: "70%",
        background: "radial-gradient(circle, rgba(248,195,1,.22) 0%, rgba(239,132,36,.10) 35%, transparent 70%)",
        filter: "blur(12px)", pointerEvents: "none",
      }} />
      {/* Cool tech glow top-left */}
      <div style={{
        position: "absolute", left: "-12%", top: "-18%", width: "60%", height: "65%",
        background: `radial-gradient(circle, ${C.lightBlue}40 0%, ${C.softBlue}20 40%, transparent 70%)`,
        filter: "blur(10px)", pointerEvents: "none",
      }} />
      {/* Tech grid overlay */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: .18, pointerEvents: "none" }}>
        <defs>
          <pattern id="techgrid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M48 0H0V48" fill="none" stroke="var(--pomo-white)" strokeWidth="0.5" />
          </pattern>
          <pattern id="techgridfine" width="12" height="12" patternUnits="userSpaceOnUse">
            <path d="M12 0H0V12" fill="none" stroke="var(--pomo-white)" strokeWidth="0.25" opacity=".5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#techgridfine)" />
        <rect width="100%" height="100%" fill="url(#techgrid)" />
      </svg>
      <style>{`
        @keyframes pomoGlow {
          0%,100% { box-shadow: 0 12px 36px rgba(0,167,143,.45), 0 0 0 0 rgba(0,167,143,.5); }
          50%     { box-shadow: 0 18px 52px rgba(0,167,143,.65), 0 0 0 10px rgba(0,167,143,0); }
        }
        .pomo-cta-primary {
          display: inline-flex; align-items: center; justify-content: center; gap: 10px;
          padding: 20px 44px; border-radius: 16px; border: none; cursor: pointer;
          font-weight: 800; font-size: 17px; letter-spacing: .5px; color: var(--pomo-white);
          background: linear-gradient(135deg, #00A78F 0%, #0F414A 60%, #0C324A 100%);
          animation: pomoGlow 2.6s ease-in-out infinite;
          transition: transform .2s ease;
        }
        .pomo-cta-primary:hover { transform: translateY(-2px); }
        .pomo-cta-ghost {
          display: inline-flex; align-items: center; justify-content: center; gap: 10px;
          padding: 20px 44px; border-radius: 16px; cursor: pointer;
          font-weight: 700; font-size: 17px; letter-spacing: .5px; color: var(--pomo-white);
          background: rgba(255,255,255,.08); backdropFilter: blur(10px);
          border: 1.5px solid rgba(255,255,255,.5);
          box-shadow: 0 8px 24px rgba(0,0,0,.25);
          transition: transform .2s ease, background .2s ease;
        }
        .pomo-cta-ghost:hover { transform: translateY(-2px); background: rgba(255,255,255,.16); }
        .pomo-cta-row { display: flex; gap: 18px; justify-content: center; align-items: center; }
        .pomo-logo-wrap { display: flex; flex-direction: column; align-items: center; gap: 14px; margin-bottom: 48px; }
        .pomo-logo-badge { width: 84px; height: 84px; border-radius: 22px; background: rgba(255,255,255,.14); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,.3); position: relative; }
        .pomo-logo-text { font-weight: 800; font-size: 32px; letter-spacing: 4px; }
        .pomo-logo-sub { font-size: 11px; opacity: .8; letter-spacing: 3px; }
        @media (max-width: 640px) {
          .pomo-cta-row { flex-direction: column; gap: 16px; width: 100%; }
          .pomo-cta-primary, .pomo-cta-ghost { width: 100%; padding: 22px 24px; font-size: 18px; }
          .pomo-logo-badge { width: 72px; height: 72px; border-radius: 20px; }
          .pomo-logo-text { font-size: 28px; }
        }
      `}</style>

      {/* Centered hero with two CTAs only */}
      <section style={{
        position: "relative", zIndex: 5, minHeight: "100vh",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "40px 24px", textAlign: "center",
      }}>
        <div className="pomo-logo-wrap">
          <div className="pomo-logo-badge">
            <Fuel size={38} />
            <div style={{ position: "absolute", top: -6, right: -6, padding: 6, borderRadius: 99, background: C.green }}>
              <Radar size={12} color="var(--pomo-white)" />
            </div>
          </div>
          <div className="pomo-logo-text">POMO</div>
          <div className="pomo-logo-sub">POM · MONITOR</div>
        </div>

        <div className="pomo-cta-row" style={{ maxWidth: 520, width: "100%" }}>
          <button className="pomo-cta-primary" onClick={() => go("signin")}>
            <User size={18} /> Login
          </button>
          <button className="pomo-cta-ghost" onClick={() => go("register")}>
            Daftar <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   AUTH PAGES (full-screen)
   ========================================================= */
function AuthShell({ children, title, subtitle, go }: any) {
  const bg = "https://images.unsplash.com/photo-1761513599002-433d167becc1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=2000&q=85";
  return (
    <div style={{ ...FONT, minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <style>{`
        .pomo-auth-card {
          position: relative; z-index: 2;
          width: 100%; max-width: 420px;
          background: var(--pomo-white); border-radius: 22px;
          padding: 36px 36px 30px;
          box-shadow: 0 30px 80px rgba(0,0,0,.45), 0 8px 24px rgba(0,0,0,.25);
          display: flex; flex-direction: column; gap: 16px;
        }
        .pomo-input-row {
          display: flex; align-items: center; gap: 10px;
          padding: 0 14px; height: 48px;
          border-radius: 12px; background: ${C.cream}; border: 1px solid ${C.line};
        }
        .pomo-input-row input { flex: 1; background: transparent; outline: none; border: none; font-size: 14px; color: ${C.ink}; }
        .pomo-auth-btn {
          height: 48px; border: none; border-radius: 12px; cursor: pointer;
          font-weight: 800; font-size: 15px; color: var(--pomo-white); letter-spacing: .3px;
          background: linear-gradient(135deg, #00A78F 0%, #0F414A 60%, #0C324A 100%);
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 10px 24px rgba(0,167,143,.35);
          transition: transform .15s ease;
        }
        .pomo-auth-btn:hover { transform: translateY(-1px); }
        @media (max-width: 640px) {
          .pomo-auth-card { max-width: calc(100% - 32px); padding: 28px 22px 24px; border-radius: 20px; }
        }
      `}</style>

      {/* Background photo + dimmed overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url(${bg})`, backgroundSize: "cover", backgroundPosition: "center",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(135deg, rgba(6,33,47,.85), rgba(12,50,74,.78))`,
        backdropFilter: "blur(4px)",
      }} />

      {/* Centered card */}
      <div style={{
        position: "relative", zIndex: 2, minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px 16px",
      }}>
        <div className="pomo-auth-card">
          {/* Logo */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: `linear-gradient(135deg, ${C.green}, ${C.navy})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative", boxShadow: "0 8px 20px rgba(0,167,143,.35)",
            }}>
              <Fuel size={26} color="var(--pomo-white)" />
              <div style={{ position: "absolute", top: -4, right: -4, padding: 4, borderRadius: 99, background: C.green, border: "2px solid var(--pomo-white)" }}>
                <Radar size={9} color="var(--pomo-white)" />
              </div>
            </div>
            <div style={{ fontWeight: 800, fontSize: 20, letterSpacing: 2.5, color: C.ink }}>POMO</div>
          </div>

          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.ink, textAlign: "center" }}>{title}</div>
            <div style={{ fontSize: 13, color: C.sub, marginTop: 6, textAlign: "center" }}>{subtitle}</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 4 }}>
            {children}
          </div>

          {go && (
            <div style={{ textAlign: "center", fontSize: 12, color: C.sub, marginTop: 4 }}>
              <span onClick={() => go("landing")} style={{ cursor: "pointer", textDecoration: "underline" }}>
                Kembali ke beranda
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ icon, label, placeholder, trailing, type }: any) {
  return (
    <div>
      <div style={{ fontSize: 12, color: C.sub, fontWeight: 600, marginBottom: 6 }}>{label}</div>
      <div className="pomo-input-row">
        <span style={{ color: C.navy, display: "flex" }}>{icon}</span>
        <input type={type || "text"} placeholder={placeholder} />
        {trailing}
      </div>
    </div>
  );
}

function SignIn({ go }: { go: (s: Screen) => void }) {
  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState("Pengendara");

  return (
    <AuthShell go={go} title="Selamat Datang" subtitle="Masuk untuk memantau SPBU favoritmu.">
      {/* Role Switcher */}
      <div style={{
        display: "flex", background: C.alabaster, borderRadius: 99, padding: 4, marginBottom: 8
      }}>
        <div 
          onClick={() => setRole("Pengendara")}
          style={{
            flex: 1, textAlign: "center", padding: "10px 0", fontSize: 13, fontWeight: 700,
            borderRadius: 99, cursor: "pointer", transition: "all .2s",
            background: role === "Pengendara" ? "var(--pomo-white)" : "transparent",
            color: role === "Pengendara" ? C.navy : C.sub,
            boxShadow: role === "Pengendara" ? "0 2px 8px rgba(0,0,0,.08)" : "none"
          }}
        >
          Pengendara
        </div>
        <div 
          onClick={() => setRole("Petugas SPBU")}
          style={{
            flex: 1, textAlign: "center", padding: "10px 0", fontSize: 13, fontWeight: 700,
            borderRadius: 99, cursor: "pointer", transition: "all .2s",
            background: role === "Petugas SPBU" ? "var(--pomo-white)" : "transparent",
            color: role === "Petugas SPBU" ? C.navy : C.sub,
            boxShadow: role === "Petugas SPBU" ? "0 2px 8px rgba(0,0,0,.08)" : "none"
          }}
        >
          Petugas SPBU
        </div>
      </div>

      <Field 
        icon={role === "Pengendara" ? <Mail size={16} /> : <BadgeCheck size={16} />} 
        label={role === "Pengendara" ? "Email / Username" : "ID Petugas / Kode SPBU"} 
        placeholder={role === "Pengendara" ? "nama@email.com" : "Contoh: 34.405.10"} 
      />
      <Field
        icon={<Lock size={16} />}
        label={role === "Pengendara" ? "Password" : "PIN Keamanan (6 Digit)"}
        type={showPass ? "text" : "password"}
        placeholder={role === "Pengendara" ? "••••••••" : "••••••"}
        trailing={
          <span onClick={() => setShowPass(v => !v)} style={{ cursor: "pointer", display: "flex" }}>
            {showPass ? <Eye size={16} color={C.sub} /> : <EyeOff size={16} color={C.sub} />}
          </span>
        }
      />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.sub }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 14, height: 14, borderRadius: 4, background: C.navy }} />
          Ingat saya
        </span>
        <span style={{ color: C.navy, fontWeight: 700, cursor: "pointer" }}>Lupa password?</span>
      </div>
      
      <button className="pomo-auth-btn" onClick={() => go(role === "Petugas SPBU" ? "admin" : "peta")}>
        {role === "Pengendara" ? (
          <>Masuk <ArrowRight size={16} /></>
        ) : (
          "Masuk Sistem"
        )}
      </button>

      {role === "Pengendara" ? (
        <div style={{ textAlign: "center", fontSize: 13, color: C.sub }}>
          Belum punya akun?{" "}
          <span onClick={() => go("register")} style={{ color: C.navy, fontWeight: 700, cursor: "pointer" }}>
            Daftar di sini
          </span>
        </div>
      ) : (
        <div style={{ textAlign: "center", fontSize: 11, color: C.sub, opacity: 0.8, lineHeight: 1.5, marginTop: 4 }}>
          Akses khusus pegawai. Akun didaftarkan oleh Admin Pusat Pertamina.
        </div>
      )}
    </AuthShell>
  );
}

function Register({ go }: { go: (s: Screen) => void }) {
  const [showPass, setShowPass] = useState(false);
  return (
    <AuthShell go={go} title="Buat Akun POMO" subtitle="Mulai pantau SPBU di sekitarmu hari ini.">
      <Field icon={<UserCircle2 size={16} />} label="Nama Lengkap" placeholder="Budi Hartono" />
      <Field icon={<Mail size={16} />} label="Email / Username" placeholder="nama@email.com" />
      <Field
        icon={<Lock size={16} />}
        label="Password"
        type={showPass ? "text" : "password"}
        placeholder="Min. 8 karakter"
        trailing={
          <span onClick={() => setShowPass(v => !v)} style={{ cursor: "pointer", display: "flex" }}>
            {showPass ? <Eye size={16} color={C.sub} /> : <EyeOff size={16} color={C.sub} />}
          </span>
        }
      />
      <div style={{ display: "flex", gap: 8, fontSize: 11, color: C.sub, lineHeight: 1.6 }}>
        <span style={{ width: 16, height: 16, borderRadius: 4, background: C.navy, marginTop: 1, flexShrink: 0 }} />
        <span>Saya menyetujui <b style={{ color: C.navy }}>Syarat & Ketentuan</b> serta <b style={{ color: C.navy }}>Kebijakan Privasi</b> POMO.</span>
      </div>
      <button className="pomo-auth-btn" onClick={() => go("peta")}>
        Daftar Sekarang <ArrowRight size={16} />
      </button>
      <div style={{ textAlign: "center", fontSize: 13, color: C.sub }}>
        Sudah punya akun?{" "}
        <span onClick={() => go("signin")} style={{ color: C.navy, fontWeight: 700, cursor: "pointer" }}>
          Masuk
        </span>
      </div>
    </AuthShell>
  );
}

/* =========================================================
   MAP CANVAS (web wide)
   ========================================================= */
type Pin = {
  x: number; y: number; q: number; l: string; addr: string;
  stock: string; open: boolean; fuel: string; fasilitas: string[];
};
const PINS: Pin[] = [
  { x: 80,   y: 130, q: 4,  l: "34.405.02", addr: "Jl. Raya Barat Cimahi",        stock: "Tersedia", open: true,  fuel: "Pertalite, Pertamax", fasilitas: ["Toilet", "Musholla", "ATM", "Kafe"] },
  { x: 260,  y: 220, q: 12, l: "34.405.10", addr: "Interchange Tol Baros",        stock: "Tersedia", open: true,  fuel: "Pertalite, Pertamax, Dex", fasilitas: ["Toilet", "Musholla", "ATM"] },
  { x: 150,  y: 430, q: 18, l: "34.405.18", addr: "Jl. Cihanjuang Km. 07",        stock: "Menipis",  open: true,  fuel: "Pertalite, Turbo", fasilitas: ["Toilet", "Musholla", "Tambal Ban"] },
  { x: 380,  y: 140, q: 7,  l: "34.405.05", addr: "Jl. Raya Gadobangkong",        stock: "Tersedia", open: true,  fuel: "Pertalite, Dexlite", fasilitas: ["Toilet", "Kafe"] },
  { x: 460,  y: 380, q: 13, l: "34.405.20", addr: "Jl. Raya Barat Cimahi No. 689",stock: "Tersedia", open: true,  fuel: "Pertalite, Pertamax", fasilitas: ["Toilet", "Musholla", "ATM", "Tambal Ban"] },
  { x: 600,  y: 200, q: 5,  l: "34.405.11", addr: "Jl. Leuwi Gajah",              stock: "Tersedia", open: true,  fuel: "Pertalite, Solar", fasilitas: ["Toilet"] },
  { x: 700,  y: 500, q: 19, l: "34.405.13", addr: "Caringin Padalarang",          stock: "Menipis",  open: true,  fuel: "Pertalite, Pertamax", fasilitas: ["Toilet", "Musholla", "Kafe"] },
  { x: 820,  y: 160, q: 11, l: "34.405.17", addr: "Encep Kartawiria Citeureup",   stock: "Tersedia", open: true,  fuel: "Pertalite, Pertamax", fasilitas: ["Toilet", "Musholla", "ATM"] },
  { x: 920,  y: 420, q: 3,  l: "34.405.19", addr: "Jl. Jend. H. Amir Mahmud",     stock: "Tersedia", open: true,  fuel: "Pertalite, Pertamax, Turbo", fasilitas: ["Toilet", "Musholla", "Kafe", "Tambal Ban"] },
  { x: 340,  y: 540, q: 6,  l: "34.405.21", addr: "Jl. Raya Barat Cimahi No. 560",stock: "Tersedia", open: true,  fuel: "Pertalite, Pertamax", fasilitas: ["Toilet", "Musholla", "ATM"] },
  { x: 560,  y: 560, q: 22, l: "34.405.22", addr: "Jl. Raya Baros No. E 47",      stock: "Menipis",  open: true,  fuel: "Pertalite, Dexlite", fasilitas: ["Toilet", "Tambal Ban"] },
  { x: 760,  y: 340, q: 8,  l: "34.405.24", addr: "Jl. Raya Sangkuriang No. 45",  stock: "Tersedia", open: true,  fuel: "Pertalite, Pertamax", fasilitas: ["Toilet", "Musholla", "Kafe"] },
  { x: 1050, y: 540, q: 14, l: "34.405.27", addr: "Tol Purbaleunyi Km. 125",      stock: "Tersedia", open: true,  fuel: "Pertamax, Dexlite", fasilitas: ["Toilet", "Musholla", "ATM", "Kafe", "Tambal Ban"] },
];
const USER_X = 220, USER_Y = 320;

const SPBU_STOCK: Record<string, { fuelIdx: number; pct: number }[]> = {
  "34.405.02": [{ fuelIdx: 1, pct: 82 }, { fuelIdx: 2, pct: 65 }, { fuelIdx: 0, pct: 78 }],
  "34.405.10": [{ fuelIdx: 1, pct: 55 }, { fuelIdx: 2, pct: 70 }, { fuelIdx: 6, pct: 40 }],
  "34.405.18": [{ fuelIdx: 1, pct: 22 }, { fuelIdx: 4, pct: 90 }, { fuelIdx: 6, pct: 45 }],
  "34.405.05": [{ fuelIdx: 1, pct: 88 }, { fuelIdx: 5, pct: 60 }],
  "34.405.20": [{ fuelIdx: 1, pct: 74 }, { fuelIdx: 2, pct: 58 }],
  "34.405.11": [{ fuelIdx: 1, pct: 12 }, { fuelIdx: 0, pct: 5  }],
  "34.405.13": [{ fuelIdx: 1, pct: 30 }, { fuelIdx: 2, pct: 44 }],
  "34.405.17": [{ fuelIdx: 1, pct: 67 }, { fuelIdx: 2, pct: 71 }],
  "34.405.19": [{ fuelIdx: 1, pct: 91 }, { fuelIdx: 2, pct: 85 }, { fuelIdx: 4, pct: 60 }],
  "34.405.21": [{ fuelIdx: 1, pct: 63 }, { fuelIdx: 2, pct: 50 }],
  "34.405.22": [{ fuelIdx: 1, pct: 18 }, { fuelIdx: 5, pct: 35 }],
  "34.405.24": [{ fuelIdx: 1, pct: 76 }, { fuelIdx: 2, pct: 62 }],
  "34.405.27": [{ fuelIdx: 2, pct: 55 }, { fuelIdx: 5, pct: 48 }],
};
const queueColor = (q: number) => q <= 9 ? C.green : q <= 15 ? C.yellow : C.orange;
const queueLabel = (q: number) => q <= 9 ? "Sepi" : q <= 15 ? "Sedang" : "Ramai";
const pixelDist = (p: Pin) => Math.hypot(p.x - USER_X, p.y - USER_Y);
const kmOf = (p: Pin) => +(pixelDist(p) / 80).toFixed(1);
const etaOf = (p: Pin) => Math.max(2, Math.round(kmOf(p) * 2.4));
const sortedByDist = () => [...PINS].sort((a, b) => pixelDist(a) - pixelDist(b));

function WebMap({ onPin, filter, selectedFacilities }: { onPin: (p: Pin) => void; filter: string; selectedFacilities?: string[] }) {
  const W = 1200, H = 620;
  const [hover, setHover] = useState<number | null>(null);
  
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: any) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };
  const handleMouseMove = (e: any) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const handleMouseUp = () => setIsDragging(false);

  const pins = PINS;
  const userX = USER_X, userY = USER_Y;
  const sorted = sortedByDist();
  const nearest = sorted[0];

  const visiblePins = pins.filter(p => {
    let passDropdown = true;
    if (filter === "Stok Ada") passDropdown = p.stock === "Tersedia";
    else if (filter === "Antrean Sepi") passDropdown = p.q <= 9;
    else if (filter === "Buka 24 Jam") passDropdown = p.open;
    else if (filter === "Terdekat") passDropdown = sorted.slice(0, 5).includes(p);

    let passFacilities = true;
    if (selectedFacilities && selectedFacilities.length > 0) {
      passFacilities = selectedFacilities.every(f => p.fasilitas.includes(f));
    }

    return passDropdown && passFacilities;
  });
  return (
    <div 
      style={{ position: "relative", width: "100%", height: H, borderRadius: 18, overflow: "hidden", cursor: isDragging ? "grabbing" : "grab" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <style>{`
        @keyframes pomoPulse { 0%{transform:translate(-50%,-50%) scale(.6);opacity:.5} 80%{opacity:0} 100%{transform:translate(-50%,-50%) scale(2.2);opacity:0} }
        @keyframes pomoBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes mpulse { 0%{r:15;opacity:0.35} 100%{r:30;opacity:0} }
        .mpulse { animation: mpulse 2s ease-out infinite; }
      `}</style>
      <div style={{
        position: "absolute", left: "50%", top: "50%", width: W, height: H,
        marginLeft: -W / 2, marginTop: -H / 2,
        transform: `translate(${pan.x}px, ${pan.y}px)`,
        transition: isDragging ? "none" : "transform 0.1s ease-out"
      }}>
      <svg width={W} height={H} style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#00E5FF" />
            <stop offset="1" stopColor="#3399FF" />
          </linearGradient>
          <pattern id="mapPattern" x="-200" y="-200" width={1600} height={1020} patternUnits="userSpaceOnUse">
            <image href="/map-bg.png" x="0" y="0" width={1600} height={1020} preserveAspectRatio="xMidYMid slice" />
          </pattern>
        </defs>
        
        {/* Infinite Background Tile */}
        <rect x="-10000" y="-10000" width="20000" height="20000" fill="url(#mapPattern)" />

        {/* User location */}
        <circle className="mpulse" cx={userX} cy={userY} r={15} fill={C.blue} opacity={0.3} />
        <circle cx={userX} cy={userY} r={10} fill={C.blue} stroke="white" strokeWidth={3.5} />

        {/* Draw the pins inside SVG like in mobile view */}
        {visiblePins.map((p, i) => {
          const c = queueColor(p.q);
          const isHover = hover === i;
          const isNearest = filter === "Terdekat" && p.l === nearest.l;
          const text = `Antrean ${p.q} · ${queueLabel(p.q)}`;
          
          const pw = Math.max(96, text.length * 5.8 + 22); 
          const ph = 22;
          const px = p.x - pw / 2;
          const py = p.y - ph - 26;

          return (
            <g 
              key={p.l} 
              onClick={() => onPin(p)}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: "pointer" }}
            >
              {isNearest && (
                <>
                  <circle className="mpulse" cx={p.x} cy={p.y} r={15} fill={C.orange} opacity={0.5} />
                  <circle className="mpulse" cx={p.x} cy={p.y} r={15} fill={C.orange} opacity={0.5} style={{ animationDelay: '1s' }} />
                </>
              )}
              
              <g style={{ animation: isNearest ? "pomoBounce 1.6s ease-in-out infinite" : undefined }}>
                <g 
                  style={{ transition: "transform .18s" }}
                  transform={isHover ? `translate(${p.x}, ${p.y}) scale(1.08) translate(-${p.x}, -${p.y})` : undefined}
                >
                {/* Pill shadow */}
                <rect x={px + 1} y={py + 2} width={pw} height={ph} rx={11} fill={c} opacity={0.35} />
                
                {/* Pill body */}
                <rect x={px} y={py} width={pw} height={ph} rx={11} fill={c} stroke="white" strokeWidth={1.5} />
                
                {/* Label */}
                <text x={p.x} y={py + 15} textAnchor="middle" fill="white" fontSize="10" fontWeight="800" fontFamily="sans-serif">{text}</text>
                
                {/* Map Pin Marker Tail */}
                <path
                  d={`M ${p.x} ${p.y} C ${p.x + 6} ${p.y - 8} ${p.x + 8} ${p.y - 11} ${p.x + 8} ${p.y - 15} A 8 8 0 1 0 ${p.x - 8} ${p.y - 15} C ${p.x - 8} ${p.y - 11} ${p.x - 6} ${p.y - 8} ${p.x} ${p.y} Z`}
                  fill={c} stroke="white" strokeWidth={1.5} strokeLinejoin="round"
                />
                <circle cx={p.x} cy={p.y - 15} r={3} fill="white" />
                
                {/* Nearest Label Badge */}
                {isNearest && (
                  <g transform={`translate(0, -32)`} style={{ filter: `drop-shadow(0px 6px 12px rgba(224,122,31,0.4))` }}>
                    <rect x={p.x - 75} y={py} width={150} height={26} rx={13} fill={C.orange} stroke="var(--pomo-white)" strokeWidth={2.5} />
                    <text x={p.x} y={py + 17} textAnchor="middle" fill="var(--pomo-white)" fontSize="10" fontWeight="800" fontFamily="sans-serif" letterSpacing={0.5}>
                      PALING DEKAT ({kmOf(p)} km)
                    </text>
                    </g>
                  )}
                </g>
              </g>
            </g>
          );
        })}
      </svg>
      
      {/* Tooltip Overlay (HTML) */}
      {visiblePins.map((p, i) => {
        const c = queueColor(p.q);
        const isHover = hover === i;
        if (!isHover) return null;

        return (
          <div key={`tooltip-${p.l}`} style={{ position: "absolute", left: p.x, top: p.y, pointerEvents: "none", zIndex: 30 }}>
              <div style={{
                position: "absolute", left: "50%", top: -56,
                transform: "translate(-50%,-100%)",
                background: "var(--pomo-white)", color: C.ink,
                borderRadius: 12, padding: "12px 14px", minWidth: 220,
                boxShadow: "0 18px 36px rgba(12,50,74,.22)",
                border: `1px solid ${C.line}`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <Fuel size={13} color={C.navy} />
                  <span style={{ fontSize: 12, fontWeight: 800, color: C.navy }}>SPBU {p.l}</span>
                </div>
                <div style={{ fontSize: 11, color: C.sub, marginBottom: 8 }}>{p.addr}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 6 }}>
                  <Badge color={c} bg={c + "22"}><Car size={10} />Antrean {p.q} · {queueLabel(p.q)}</Badge>
                  <Badge
                    color={p.stock === "Tersedia" ? C.green : C.orange}
                    bg={p.stock === "Tersedia" ? C.greenPale : C.orangePale}
                  ><Gauge size={10} />Stok {p.stock}</Badge>
                  <Badge color={p.open ? C.green : C.red} bg={p.open ? C.greenPale : C.redPale}>
                    <Dot color={p.open ? C.green : C.red} />{p.open ? "Buka" : "Tutup"}
                  </Badge>
                </div>
                <div style={{ fontSize: 10, color: C.sub, lineHeight: 1.5 }}>
                  <b style={{ color: C.ink }}>BBM:</b> {p.fuel}
                </div>
                <div style={{
                  position: "absolute", left: "50%", bottom: -6, transform: "translateX(-50%) rotate(45deg)",
                  width: 12, height: 12, background: "var(--pomo-white)",
                  borderRight: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}`,
                }} />
              </div>
          </div>
        );
      })}
      
      </div>
    </div>
  );
}

/* =========================================================
   PETA (Dashboard Home)
   ========================================================= */
function NearestCard({ openSheet }: { openSheet: (p: Pin) => void }) {
  const sorted = sortedByDist();
  const nearest = sorted[0];
  return (
    <Card>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10, background: C.greenPale, color: C.green,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}><Navigation size={18} /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 10, color: C.sub, fontWeight: 700, letterSpacing: 1 }}>SPBU TERDEKAT DARI LOKASIMU</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.navy }}>SPBU {nearest.l}</div>
        </div>
        <Badge color={queueColor(nearest.q)} bg={queueColor(nearest.q) + "22"}>
          <Car size={11} />Antrean {nearest.q} · {queueLabel(nearest.q)}
        </Badge>
      </div>
      <div style={{ fontSize: 12, color: C.sub, marginBottom: 14 }}>{nearest.addr}</div>

      <div className="pomo-nearest-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 14 }}>
        {[
          { l: "Jarak", v: kmOf(nearest) + " km", c: C.navy },
          { l: "ETA", v: etaOf(nearest) + " menit", c: C.navy },
          { l: "Stok", v: nearest.stock, c: nearest.stock === "Tersedia" ? C.green : C.orange },
          { l: "Status", v: nearest.open ? "Buka" : "Tutup", c: nearest.open ? C.green : C.red },
        ].map(s => (
          <div key={s.l} style={{ padding: 12, borderRadius: 12, background: C.alabaster, textAlign: "center" }}>
            <div style={{ fontSize: 10, color: C.sub }}>{s.l}</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: s.c, marginTop: 2 }}>{s.v}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 10, color: C.sub, fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>ALTERNATIF TERDEKAT LAINNYA</div>
      <div className="pomo-alt-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
        {sorted.slice(1, 5).map(p => (
          <div key={p.l} onClick={() => openSheet(p)} className="pomo-alt-card" style={{
            padding: 12, borderRadius: 12, background: "var(--pomo-white)", border: `1px solid ${C.line}`,
            cursor: "pointer",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: 99, background: queueColor(p.q) }} />
              <span style={{ fontSize: 12, fontWeight: 800, color: C.ink }}>{p.l}</span>
            </div>
            <div style={{ fontSize: 10, color: C.sub, marginBottom: 6 }}>{p.addr}</div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
              <span style={{ color: C.sub }}>{kmOf(p)} km · {etaOf(p)} mnt</span>
              <span style={{ fontWeight: 700, color: queueColor(p.q) }}>{p.q}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function PetaPage({ go, openSheet, closeSheet, sheetOpen, selectedPin }: {
  go: (s: Screen) => void;
  openSheet: (p: Pin) => void;
  closeSheet: () => void;
  sheetOpen: boolean;
  selectedPin: Pin | null;
}) {
  const [filter, setFilter] = useState("Terdekat");
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [fuelOpen, setFuelOpen] = useState(true);
  const chips = ["Terdekat", "Stok Ada", "Antrean Sepi", "Buka 24 Jam"];
  return (
    <div style={{ display: "grid", gridTemplateColumns: sheetOpen ? "1fr 380px" : "1fr", gap: 20 }} className="pomo-peta">
      <style>{`
        .pomo-filter-row { display: flex; gap: 12px; align-items: center; }
        .pomo-chip-scroll { display: contents; }
        .pomo-stat-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
        .pomo-fuel-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; }
        .pomo-fuel-toggle { display: none; }
        @media (max-width: 900px) {
          .pomo-peta { grid-template-columns: 1fr !important; }
          .pomo-filter-row { flex-direction: column; align-items: stretch; gap: 10px; }
          .pomo-chip-scroll {
            display: flex !important; gap: 8px; overflow-x: auto;
            margin: 0 -14px; padding: 2px 14px 4px;
            scrollbar-width: none;
          }
          .pomo-chip-scroll::-webkit-scrollbar { display: none; }
          .pomo-chip-scroll > span { flex-shrink: 0; white-space: nowrap; }
          .pomo-nearest-grid { grid-template-columns: repeat(2,1fr) !important; }
          .pomo-alt-grid {
            display: flex !important; gap: 10px; overflow-x: auto;
            margin: 0 -16px; padding: 2px 16px 6px;
            scroll-snap-type: x mandatory;
            scrollbar-width: none;
          }
          .pomo-alt-grid::-webkit-scrollbar { display: none; }
          .pomo-alt-card { flex: 0 0 160px; scroll-snap-align: start; }
          .pomo-stat-row { grid-template-columns: repeat(2,1fr) !important; gap: 10px; }
          .pomo-fuel-grid { grid-template-columns: 1fr !important; gap: 8px; }
          .pomo-fuel-toggle { display: flex !important; }
          .pomo-fuel-grid.pomo-collapsed { display: none !important; }
          .pomo-fuel-item-mobile {
            flex-direction: row !important; align-items: center !important; gap: 12px;
            padding: 10px 12px !important;
          }
          .pomo-fuel-item-mobile .pomo-fuel-price { margin-top: 0 !important; margin-left: auto; font-size: 15px !important; }
        }
      `}</style>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Top filters */}
        <Card style={{ padding: 14 }}>
          <div className="pomo-filter-row">
            <div style={{
              flex: 1, display: "flex", alignItems: "center", gap: 10, padding: "0 14px",
              height: 44, borderRadius: 12, background: C.cream, border: `1px solid ${C.line}`,
              width: "100%",
            }}>
              <Search size={16} color={C.navy} />
              <input placeholder="Cari SPBU di Bandung & Cimahi..." style={{
                flex: 1, minWidth: 0, background: "transparent", outline: "none", fontSize: 13, color: C.ink, border: "none",
              }} />
              <Mic size={16} color={C.navy} />
            </div>
            <div style={{ position: "relative", minWidth: 160 }}>
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{
                  width: "100%", padding: "10px 14px", paddingRight: 36, borderRadius: 99, fontSize: 13, fontWeight: 700,
                  background: C.navy, color: "var(--pomo-white)", border: "none", outline: "none", cursor: "pointer",
                  appearance: "none", WebkitAppearance: "none", boxShadow: `0 6px 14px ${C.navy}30`
                }}
              >
                {chips.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                  <path d="M1 1L5 5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.line}` }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: C.ink, marginBottom: 10 }}>Filter Fasilitas SPBU</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["Toilet", "Musholla", "ATM", "Kafe", "Tambal Ban"].map((fasilitas) => {
                const isActive = selectedFacilities.includes(fasilitas);
                return (
                  <label key={fasilitas} style={{
                    display: "flex", alignItems: "center", gap: 6, cursor: "pointer",
                    padding: "6px 10px", borderRadius: 8,
                    background: isActive ? C.bluePale : C.alabaster,
                    border: `1px solid ${isActive ? C.navy : C.line}`,
                    transition: "all .2s", margin: 0
                  }}>
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedFacilities(prev => [...prev, fasilitas]);
                        } else {
                          setSelectedFacilities(prev => prev.filter(f => f !== fasilitas));
                        }
                      }}
                      style={{ accentColor: C.navy, width: 14, height: 14, cursor: "pointer", margin: 0 }}
                    />
                    <span style={{ fontSize: 11, fontWeight: isActive ? 700 : 500, color: isActive ? C.navy : C.sub }}>
                      {fasilitas}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Map */}
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <WebMap onPin={(p) => openSheet(p)} filter={filter} selectedFacilities={selectedFacilities} />
        </Card>

        {filter === "Terdekat" && <NearestCard openSheet={openSheet} />}

        {/* Stat row */}
        <div className="pomo-stat-row">
          {[
            { label: "SPBU Stok Ada", v: "9", c: C.green, ic: <CheckCircle2 size={18} /> },
            { label: "Antrean Sedang", v: "3", c: C.yellow, ic: <Clock size={18} /> },
            { label: "Antrean Panjang", v: "1", c: C.orange, ic: <Car size={18} /> },
            { label: "Total Terhubung", v: "13", c: C.navy, ic: <Radar size={18} /> },
          ].map(s => (
            <Card key={s.label} style={{ padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: s.c + "20", color: s.c,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{s.ic}</div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: C.ink }}>{s.v}</div>
                  <div style={{ fontSize: 11, color: C.sub }}>{s.label}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Fuel prices panel */}
        <Card>
          <div
            onClick={() => setFuelOpen(v => !v)}
            className="pomo-fuel-toggle"
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, cursor: "pointer" }}
          >
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>Harga BBM Pertamina</div>
              <div style={{ fontSize: 11, color: C.sub, marginTop: 2 }}>Update resmi · Juni 2026</div>
            </div>
            <div style={{
              width: 32, height: 32, borderRadius: 99, background: C.alabaster,
              display: "flex", alignItems: "center", justifyContent: "center",
              transform: fuelOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform .2s",
            }}>
              <ChevronRight size={16} color={C.navy} />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }} className="pomo-fuel-header-desktop">
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: C.ink }}>Harga BBM Pertamina</div>
              <div style={{ fontSize: 11, color: C.sub, marginTop: 2 }}>Update resmi · Berlaku Juni 2026</div>
            </div>
            <Badge color={C.green} bg={C.greenPale}><Dot color={C.green} />Live</Badge>
          </div>
          <style>{`@media (max-width: 900px) { .pomo-fuel-header-desktop { display: none !important; } }`}</style>
          <div className={"pomo-fuel-grid" + (fuelOpen ? "" : " pomo-collapsed")}>
            {FUELS.map(f => (
              <div key={f.name} className="pomo-fuel-item-mobile" style={{
                padding: 14, borderRadius: 14, background: C.alabaster,
                border: `1px solid ${C.line}`,
                display: "flex", flexDirection: "column",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8, background: f.color + "22",
                    color: f.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}><Fuel size={14} /></div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.ink }}>{f.name}</div>
                    <div style={{ fontSize: 10, color: C.sub }}>{f.category}</div>
                  </div>
                </div>
                <div className="pomo-fuel-price" style={{ fontSize: 18, fontWeight: 800, color: C.navy, marginTop: 10 }}>
                  {rp(f.price)}<span style={{ fontSize: 10, color: C.sub, fontWeight: 500 }}>/L</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {sheetOpen && selectedPin && (
        <SpbuDetailSide go={go} close={closeSheet} pin={selectedPin} />
      )}
    </div>
  );
}

export type ReviewData = { id: string; n: string; r: number; c: string; isMine?: boolean };
const DEFAULT_REVIEWS: ReviewData[] = [
  { id: "1", n: "Budi Santoso", r: 5, c: "Pelayanan sangat cepat, stok bensin selalu ada. Toiletnya juga bersih dan wangi, mantap!" },
  { id: "2", n: "Rina A.", r: 4, c: "Antrean cukup rapi dan teratur. Hanya saja kadang angin ban mesinnya suka mati." },
  { id: "3", n: "Deni", r: 5, c: "Bagus banget, petugasnya ramah dan 24 jam jadi gampang buat isi malam-malam." }
];
const REVIEWS_STORE: Record<string, ReviewData[]> = {};

/* =========================================================
   SPBU Detail (side panel)
   ========================================================= */
function SpbuDetailSide({ go, close, pin }: { go: (s: Screen) => void; close: () => void; pin: Pin }) {
  const [reviews, setReviews] = useState<ReviewData[]>(() => {
    if (!REVIEWS_STORE[pin.l]) REVIEWS_STORE[pin.l] = [...DEFAULT_REVIEWS];
    return REVIEWS_STORE[pin.l];
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formText, setFormText] = useState("");
  const [formRating, setFormRating] = useState(5);

  const qc     = queueColor(pin.q);
  const ql     = queueLabel(pin.q);
  const sc     = pin.stock === "Tersedia" ? C.green  : pin.stock === "Menipis" ? C.orange : C.red;
  const scBg   = pin.stock === "Tersedia" ? C.greenPale : pin.stock === "Menipis" ? C.orangePale : C.redPale;
  const stocks = SPBU_STOCK[pin.l] ?? [{ fuelIdx: 1, pct: 65 }, { fuelIdx: 2, pct: 50 }];
  
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.r, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <Card style={{ padding: 0, overflow: "hidden", height: "fit-content" }}>
      <div style={{
        padding: "18px 20px",
        background: `linear-gradient(135deg, ${C.navy}, ${C.blue})`,
        color: "var(--pomo-white)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 11, opacity: .85 }}>SPBU {pin.l}</div>
            <div style={{ fontSize: 17, fontWeight: 800, marginTop: 2 }}>{pin.addr.split(",")[0]}</div>
            <div style={{ fontSize: 11, opacity: .85, marginTop: 4 }}>{pin.addr}</div>
          </div>
          <X size={18} style={{ cursor: "pointer" }} onClick={close} />
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 14, fontSize: 11 }}>
          <div><div style={{ opacity: .8 }}>Jarak</div><b style={{ fontSize: 14 }}>{kmOf(pin)} km</b></div>
          <div><div style={{ opacity: .8 }}>ETA</div><b style={{ fontSize: 14 }}>~{etaOf(pin)} mnt</b></div>
          <div><div style={{ opacity: .8 }}>Rating</div><b style={{ fontSize: 14 }}>{avgRating} ★</b></div>
        </div>
      </div>

      <div style={{ padding: 20 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <Badge color={sc} bg={scBg}><Dot color={sc} />Stok {pin.stock}</Badge>
          <Badge color={qc} bg={qc + "22"}><Car size={10} />Antrean {pin.q} · {ql}</Badge>
          <Badge color={pin.open ? C.green : C.red} bg={pin.open ? C.greenPale : C.redPale}>
            <Dot color={pin.open ? C.green : C.red} />{pin.open ? "Buka 24 Jam" : "Tutup"}
          </Badge>
        </div>

        <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, marginTop: 18, marginBottom: 8 }}>
          Ketersediaan BBM
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {stocks.map(({ fuelIdx, pct }) => {
            const f   = FUELS[fuelIdx];
            const bar = pct < 30 ? C.orange : pct < 60 ? C.yellow : C.green;
            return (
              <div key={f.name} style={{
                padding: 12, borderRadius: 12, background: C.alabaster,
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <Fuel size={16} color={f.color} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.ink }}>{f.name}</div>
                  <div style={{ fontSize: 11, color: C.sub }}>{rp(f.price)}/L</div>
                </div>
                <div style={{ width: 80 }}>
                  <div style={{ height: 6, background: "var(--pomo-white)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: bar, borderRadius: 99 }} />
                  </div>
                  <div style={{ fontSize: 10, color: pct < 30 ? C.orange : C.sub, marginTop: 4, textAlign: "right", fontWeight: pct < 30 ? 700 : 400 }}>{pct}%</div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, marginTop: 18, marginBottom: 8 }}>Fasilitas</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 8 }}>
          {[
            { i: <Coffee size={14} />, l: "Mushola" },
            { i: <Bath size={14} />, l: "WC" },
            { i: <ShoppingBag size={14} />, l: "Market" },
            { i: <CreditCard size={14} />, l: "ATM" },
            { i: <Wind size={14} />, l: "Angin" },
            { i: <Droplets size={14} />, l: "Cuci" },
          ].map(f => (
            <div key={f.l} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, background: C.bluePale, color: C.navy,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>{f.i}</div>
              <span style={{ fontSize: 9, color: C.sub, fontWeight: 600 }}>{f.l}</span>
            </div>
          ))}
        </div>

        {/* ── Ulasan Pengguna ───────────────────────────────────── */}
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.line}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: C.ink }}>Ulasan Pengguna</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 800, color: C.ink }}>
              <Star size={14} fill="#FFD700" color="#FFD700" /> {avgRating}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {reviews.map((u, idx) => (
              <div key={u.id} style={{
                paddingBottom: 12,
                borderBottom: idx === reviews.length - 1 ? "none" : `1px solid ${C.line}`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 14,
                    background: C.bluePale,
                    color: C.navy, display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <User size={16} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.ink }}>{u.n}</div>
                    <div style={{ display: "flex", gap: 2, marginTop: 2 }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={10} fill={i < u.r ? "#FFD700" : "#E0E0E0"} color={i < u.r ? "#FFD700" : "#E0E0E0"} />
                      ))}
                    </div>
                  </div>
                  {u.isMine && (
                    <>
                      <button onClick={() => {
                        const newReviews = reviews.filter(r => r.id !== u.id);
                        REVIEWS_STORE[pin.l] = newReviews;
                        setReviews(newReviews);
                        removeReviewHistory(u.id);
                      }} style={{ background: "none", border: "none", color: C.red, cursor: "pointer", padding: 4 }}>
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                </div>
                <div style={{ fontSize: 11, color: C.sub, lineHeight: 1.4, paddingLeft: 36 }}>
                  {u.c}
                </div>
              </div>
            ))}
          </div>

          {isFormOpen ? (
            <div style={{ marginTop: 16, padding: 16, borderRadius: 12, border: `1px solid ${C.line}`, background: C.alabaster }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.ink }}>{editId ? "Edit Ulasan" : "Tulis Ulasan Baru"}</div>
                <button onClick={() => setIsFormOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: C.sub }}><X size={16} /></button>
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <button key={i} onClick={() => setFormRating(i + 1)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                    <Star size={24} fill={i < formRating ? "#FFD700" : "#E0E0E0"} color={i < formRating ? "#FFD700" : "#E0E0E0"} />
                  </button>
                ))}
              </div>
              <textarea
                value={formText}
                onChange={e => setFormText(e.target.value)}
                placeholder="Tulis komentar Anda..."
                style={{ width: "100%", height: 80, padding: 12, borderRadius: 8, border: `1px solid ${C.line}`, resize: "none", fontSize: 12 }}
              />
              <button onClick={() => {
                if (!formText.trim()) return;
                let newReviews = [...reviews];
                if (editId) {
                  newReviews = newReviews.map(r => r.id === editId && r.isMine ? { ...r, c: formText, r: formRating } : r);
                } else {
                  const newReview = { id: Date.now().toString(), n: "Anda", r: formRating, c: formText, isMine: true };
                  newReviews.unshift(newReview);
                  addReviewHistory({
                    id: newReview.id,
                    spbu: `SPBU ${pin.l}`,
                    date: formatReviewDate(),
                    rating: formRating,
                    comment: formText,
                  });
                }
                REVIEWS_STORE[pin.l] = newReviews;
                setReviews(newReviews);
                setIsFormOpen(false);
              }} style={{ marginTop: 12, width: "100%", padding: "10px 0", borderRadius: 8, background: `linear-gradient(135deg, ${C.navy}, ${C.blue})`, color: "var(--pomo-white)", border: "none", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>
                Simpan Ulasan
              </button>
            </div>
          ) : (
            <button onClick={() => { setEditId(null); setFormText(""); setFormRating(5); setIsFormOpen(true); }} style={{
              marginTop: 16, width: "100%",
              padding: "12px 0", borderRadius: 10,
              background: "var(--pomo-white)", color: C.navy,
              border: `1.5px solid ${C.navy}`,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              fontSize: 13, fontWeight: 700, cursor: "pointer",
            }}>
              <MessageSquare size={16} /> Tulis Ulasan
            </button>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 20 }}>
          <PrimaryBtn style={{ width: "100%", justifyContent: "center", padding: "12px 0" }}>
            <Navigation size={14} />Navigasi
          </PrimaryBtn>
          <GhostBtn onClick={() => go("histori")} style={{ width: "100%", justifyContent: "center", padding: "11px 0" }}>
            <History size={14} />Simpan Kunjungan
          </GhostBtn>
        </div>
      </div>
    </Card>
  );
}

/* =========================================================
   HISTORI
   ========================================================= */
function HistoriPage({ go, openSheet }: { go: (s: Screen) => void; openSheet: () => void }) {
  const visits = [
    { spbu: "SPBU 34.405.02", addr: "Jl. Raya Barat Cimahi",        last: "Hari ini · 14:22", queue: 4,  qStat: "Sepi",   stock: "Tersedia",   stockC: C.green,  open: true,  fuel: "Pertalite, Pertamax" },
    { spbu: "SPBU 34.405.05", addr: "Jl. Raya Gadobangkong",        last: "Hari ini · 09:11", queue: 8,  qStat: "Sepi",   stock: "Tersedia",   stockC: C.green,  open: true,  fuel: "Pertalite, Dexlite" },
    { spbu: "SPBU 34.405.18", addr: "Jl. Cihanjuang Km. 07",        last: "Kemarin · 18:40",  queue: 12, qStat: "Sedang", stock: "Menipis",    stockC: C.yellow, open: true,  fuel: "Pertalite, Pertamax Turbo" },
    { spbu: "SPBU 34.405.10", addr: "Jl. Interchange Tol Baros",    last: "2 hari lalu",      queue: 18, qStat: "Ramai",  stock: "Tersedia",   stockC: C.green,  open: true,  fuel: "Pertalite, Pertamax, Dex" },
    { spbu: "SPBU 34.405.20", addr: "Jl. Raya Barat Cimahi No. 689",last: "3 hari lalu",      queue: 6,  qStat: "Sepi",   stock: "Tersedia",   stockC: C.green,  open: true,  fuel: "Pertalite, Pertamax" },
    { spbu: "SPBU 34.405.11", addr: "Jl. Leuwi Gajah",              last: "5 hari lalu",      queue: 0,  qStat: "Tutup",  stock: "Habis",      stockC: C.orange, open: false, fuel: "—" },
    { spbu: "SPBU 34.405.27", addr: "Tol Purbaleunyi Km. 125",      last: "1 minggu lalu",    queue: 14, qStat: "Sedang", stock: "Tersedia",   stockC: C.green,  open: true,  fuel: "Pertamax, Dexlite" },
  ];
  const queueBadge = (q: number, s: string) => {
    if (s === "Tutup") return { c: C.red, bg: C.redPale };
    if (q <= 9)  return { c: C.green,  bg: C.greenPale };
    if (q <= 15) return { c: C.yellow, bg: C.yellowPale };
    return { c: C.orange, bg: C.orangePale };
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: C.ink }}>Histori Kunjungan SPBU</div>
            <div style={{ fontSize: 11, color: C.sub, marginTop: 2 }}>Daftar SPBU yang pernah Anda buka, kunjungi, atau pilih rutenya.</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <GhostBtn style={{ padding: "9px 14px", fontSize: 12 }}><Filter size={14} />Filter</GhostBtn>
            <GhostBtn style={{ padding: "9px 14px", fontSize: 12 }}><Calendar size={14} />Periode</GhostBtn>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {visits.map(v => {
            const qb = queueBadge(v.queue, v.qStat);
            return (
              <div key={v.spbu} style={{
                padding: 16, borderRadius: 14, border: `1px solid ${C.line}`,
                background: "var(--pomo-white)", display: "grid",
                gridTemplateColumns: "auto 1.4fr 1fr auto", gap: 16, alignItems: "center",
              }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 12, background: C.bluePale, color: C.navy,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}><MapPin size={20} /></div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: C.ink }}>{v.spbu}</div>
                  <div style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>{v.addr}</div>
                  <div style={{ fontSize: 11, color: C.sub, marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
                    <Clock size={11} />Terakhir dikunjungi: <b style={{ color: C.ink }}>{v.last}</b>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <Badge color={qb.c} bg={qb.bg}><Car size={11} />Antrean {v.queue} · {v.qStat}</Badge>
                  <Badge color={v.stockC} bg={v.stockC + "22"}><Fuel size={11} />Stok {v.stock}</Badge>
                  <Badge color={v.open ? C.green : C.red} bg={v.open ? C.greenPale : C.redPale}>
                    <Dot color={v.open ? C.green : C.red} />{v.open ? "Buka" : "Tutup"}
                  </Badge>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <PrimaryBtn onClick={() => { go("peta"); openSheet(); }} style={{ padding: "9px 14px", fontSize: 12 }}>
                    <MapIcon size={13} />Buka di Peta
                  </PrimaryBtn>
                  <GhostBtn onClick={() => { go("peta"); openSheet(); }} style={{ padding: "8px 14px", fontSize: 12 }}>
                    <ChevronRight size={13} />Lihat Lagi
                  </GhostBtn>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

/* =========================================================
   CEK STOK BBM
   ========================================================= */
function BayarPage({ go, openSheet }: { go: (s: Screen) => void; openSheet: () => void }) {
  const [fuelIdx, setFuelIdx] = useState(1);
  const [area, setArea] = useState(0);
  const areas = ["Semua Wilayah", "Cimahi", "Bandung Barat", "Padalarang", "Cibeber"];

  const stations = [
    { spbu: "SPBU 34.405.02", addr: "Jl. Raya Barat Cimahi",         area: "Cimahi",        dist: "1.2 km", queue: 4,  stock: "Tersedia",  stockC: C.green,  open: true,  pct: 82 },
    { spbu: "SPBU 34.405.05", addr: "Jl. Raya Gadobangkong",         area: "Bandung Barat", dist: "2.4 km", queue: 7,  stock: "Tersedia",  stockC: C.green,  open: true,  pct: 71 },
    { spbu: "SPBU 34.405.18", addr: "Jl. Cihanjuang Km. 07",         area: "Cimahi",        dist: "2.8 km", queue: 12, stock: "Menipis",   stockC: C.yellow, open: true,  pct: 28 },
    { spbu: "SPBU 34.405.10", addr: "Jl. Interchange Tol Baros",     area: "Cimahi",        dist: "3.6 km", queue: 18, stock: "Tersedia",  stockC: C.green,  open: true,  pct: 64 },
    { spbu: "SPBU 34.405.20", addr: "Jl. Raya Barat Cimahi No. 689", area: "Cimahi",        dist: "4.1 km", queue: 9,  stock: "Tersedia",  stockC: C.green,  open: true,  pct: 90 },
    { spbu: "SPBU 34.405.11", addr: "Jl. Leuwi Gajah",               area: "Cimahi",        dist: "5.0 km", queue: 0,  stock: "Habis",     stockC: C.orange, open: false, pct: 5 },
    { spbu: "SPBU 34.405.13", addr: "Jl. Raya Caringin Padalarang",  area: "Padalarang",    dist: "6.8 km", queue: 16, stock: "Menipis",   stockC: C.yellow, open: true,  pct: 22 },
    { spbu: "SPBU 34.405.27", addr: "Tol Purbaleunyi Km. 125",       area: "Cibeber",       dist: "8.4 km", queue: 14, stock: "Tersedia",  stockC: C.green,  open: true,  pct: 58 },
  ];

  const filtered = area === 0 ? stations : stations.filter(s => s.area === areas[area]);
  const queueBadge = (q: number, open: boolean) => {
    if (!open) return { c: C.red, bg: C.redPale, label: "Tutup" };
    if (q <= 9)  return { c: C.green,  bg: C.greenPale,  label: `Antrean ${q} · Sepi` };
    if (q <= 15) return { c: C.yellow, bg: C.yellowPale, label: `Antrean ${q} · Sedang` };
    return { c: C.orange, bg: C.orangePale, label: `Antrean ${q} · Ramai` };
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card>
        <div style={{ fontSize: 16, fontWeight: 800, color: C.ink }}>Cek Stok BBM</div>
        <div style={{ fontSize: 13, color: C.sub, marginTop: 6, lineHeight: 1.6, maxWidth: 640 }}>
          Pilih jenis BBM yang ingin dicek, lalu pilih wilayah terdekat. POMO akan menampilkan
          daftar SPBU yang menyediakan BBM tersebut beserta status stok, antrean, dan operasionalnya secara real-time.
        </div>

        <div style={{ fontSize: 11, color: C.sub, fontWeight: 700, marginTop: 18, letterSpacing: 1 }}>JENIS BBM</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginTop: 10 }}>
          {FUELS.map((f, i) => (
            <div key={f.name} onClick={() => setFuelIdx(i)} style={{
              padding: 12, borderRadius: 12, cursor: "pointer",
              border: `1.5px solid ${i === fuelIdx ? C.navy : C.line}`,
              background: i === fuelIdx ? C.bluePale : "var(--pomo-white)",
            }}>
              <Fuel size={16} color={f.color} />
              <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, marginTop: 6 }}>{f.name}</div>
              <div style={{ fontSize: 10, color: C.sub, marginTop: 2 }}>{f.category}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 11, color: C.sub, fontWeight: 700, marginTop: 18, letterSpacing: 1 }}>WILAYAH / LOKASI</div>
        <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
          {areas.map((a, i) => (
            <span key={a} onClick={() => setArea(i)} style={{
              padding: "9px 16px", borderRadius: 99, fontSize: 12, fontWeight: 700, cursor: "pointer",
              background: i === area ? C.navy : "var(--pomo-white)",
              color: i === area ? "var(--pomo-white)" : C.ink,
              border: i === area ? "none" : `1px solid ${C.line}`,
            }}>
              {i === 0 ? <MapPin size={12} style={{ display: "inline", marginRight: 5 }} /> : null}
              {a}
            </span>
          ))}
        </div>
      </Card>

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>
              SPBU dengan <span style={{ color: C.navy }}>{FUELS[fuelIdx].name}</span>
            </div>
            <div style={{ fontSize: 11, color: C.sub, marginTop: 2 }}>{filtered.length} SPBU di {areas[area]}</div>
          </div>
          <Badge color={C.green} bg={C.greenPale}><Dot color={C.green} />Live</Badge>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map(s => {
            const qb = queueBadge(s.queue, s.open);
            return (
              <div key={s.spbu} style={{
                padding: 16, borderRadius: 14, border: `1px solid ${C.line}`,
                display: "grid", gridTemplateColumns: "auto 1.4fr 1fr auto", gap: 16, alignItems: "center",
              }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 12, background: C.bluePale, color: C.navy,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}><Fuel size={20} /></div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: C.ink }}>{s.spbu}</div>
                  <div style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>{s.addr}</div>
                  <div style={{ fontSize: 11, color: C.sub, marginTop: 6, display: "flex", alignItems: "center", gap: 10 }}>
                    <span><MapPin size={11} style={{ display: "inline", marginRight: 3 }} />{s.dist}</span>
                    <span>·</span>
                    <span><Clock size={11} style={{ display: "inline", marginRight: 3 }} />{s.open ? "Buka 24 Jam" : "Tutup sementara"}</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <Badge color={s.stockC} bg={s.stockC + "22"}>
                    <Gauge size={11} />Stok {s.stock} · {s.pct}%
                  </Badge>
                  <Badge color={qb.c} bg={qb.bg}><Car size={11} />{qb.label}</Badge>
                  <Badge color={s.open ? C.green : C.red} bg={s.open ? C.greenPale : C.redPale}>
                    <Dot color={s.open ? C.green : C.red} />{s.open ? "Operasional" : "Tutup"}
                  </Badge>
                </div>
                <PrimaryBtn onClick={() => { go("peta"); openSheet(); }} style={{ padding: "10px 16px", fontSize: 12 }}>
                  <MapIcon size={13} />Lihat di Peta
                </PrimaryBtn>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

/* =========================================================
   NOTIFIKASI
   ========================================================= */
function NotifPage() {
  type Level = "aman" | "sedang" | "bahaya";
  const items: {
    cat: string; spbu: string; addr: string; t: string; d: string;
    time: string; level: Level; ic: any;
  }[] = [
    {
      cat: "Stok BBM", spbu: "SPBU 34.405.02", addr: "Jl. Raya Barat Cimahi",
      t: "Pertalite & Pertamax stok aman",
      d: "Stok Pertalite 82%, Pertamax 74%. Aman untuk antrean reguler.",
      time: "Baru saja", level: "aman", ic: <Fuel size={18} />,
    },
    {
      cat: "Antrean", spbu: "SPBU 34.405.10", addr: "Interchange Tol Baros",
      t: "Antrean ramai terdeteksi",
      d: "18 kendaraan mengantre. Estimasi tunggu ±25 menit. Pertimbangkan rute alternatif.",
      time: "5 menit lalu", level: "bahaya", ic: <Car size={18} />,
    },
    {
      cat: "Stok BBM", spbu: "SPBU 34.405.18", addr: "Jl. Cihanjuang Km. 07",
      t: "Stok Pertalite menipis",
      d: "Sisa stok 22%. Diprediksi habis dalam 30 menit ke depan.",
      time: "12 menit lalu", level: "sedang", ic: <Gauge size={18} />,
    },
    {
      cat: "Operasional", spbu: "SPBU 34.405.11", addr: "Jl. Leuwi Gajah",
      t: "SPBU sedang tutup",
      d: "Pemeliharaan dispenser sampai pukul 16:00. Tidak menerima pembelian.",
      time: "1 jam lalu", level: "bahaya", ic: <X size={18} />,
    },
    {
      cat: "Kondisi", spbu: "SPBU 34.405.05", addr: "Jl. Raya Gadobangkong",
      t: "Kondisi sepi · cocok untuk isi cepat",
      d: "Antrean hanya 3 kendaraan. Semua jenis BBM tersedia.",
      time: "1 jam lalu", level: "aman", ic: <CheckCircle2 size={18} />,
    },
    {
      cat: "Antrean", spbu: "SPBU 34.405.13", addr: "Jl. Raya Caringin Padalarang",
      t: "Antrean sedang meningkat",
      d: "Saat ini 14 kendaraan, tren naik. Pertimbangkan SPBU terdekat lainnya.",
      time: "2 jam lalu", level: "sedang", ic: <Activity size={18} />,
    },
    {
      cat: "Operasional", spbu: "SPBU 34.405.27", addr: "Tol Purbaleunyi Km. 125",
      t: "Operasional normal 24 jam",
      d: "Semua jenis BBM tersedia, antrean stabil di kisaran 10–14 kendaraan.",
      time: "3 jam lalu", level: "aman", ic: <Clock size={18} />,
    },
  ];
  const meta = (l: Level) => {
    if (l === "aman") return { c: C.green, bg: C.greenPale, label: "Aman / Tersedia" };
    if (l === "sedang") return { c: C.yellow, bg: C.yellowPale, label: "Terbatas / Sedang" };
    return { c: C.red, bg: C.redPale, label: "Habis / Ramai / Tutup" };
  };

  const summary = [
    { l: "Aman / Tersedia", c: C.green, n: items.filter(i => i.level === "aman").length },
    { l: "Terbatas / Sedang", c: C.yellow, n: items.filter(i => i.level === "sedang").length },
    { l: "Habis / Ramai", c: C.red, n: items.filter(i => i.level === "bahaya").length },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        {summary.map(s => (
          <Card key={s.l} style={{ padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: s.c + "22", color: s.c,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}><Activity size={20} /></div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.ink }}>{s.n}</div>
              <div style={{ fontSize: 11, color: C.sub }}>{s.l}</div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: C.ink }}>Update Kondisi SPBU</div>
            <div style={{ fontSize: 11, color: C.sub, marginTop: 2 }}>Update real-time stok, antrean, dan status operasional.</div>
          </div>
          <GhostBtn style={{ padding: "8px 14px", fontSize: 12 }}>Tandai sudah dibaca</GhostBtn>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map((n, i) => {
            const m = meta(n.level);
            return (
              <div key={i} style={{
                padding: 16, borderRadius: 14, border: `1px solid ${C.line}`,
                borderLeft: `4px solid ${m.c}`, background: "var(--pomo-white)",
                display: "flex", gap: 14, alignItems: "flex-start",
              }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: m.bg, color: m.c,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>{n.ic}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <Badge color={m.c} bg={m.bg}><Dot color={m.c} />{n.cat}</Badge>
                      <span style={{ fontSize: 12, fontWeight: 800, color: C.navy }}>{n.spbu}</span>
                      <span style={{ fontSize: 11, color: C.sub }}>· {n.addr}</span>
                    </div>
                    <div style={{ fontSize: 11, color: C.sub, whiteSpace: "nowrap" }}>{n.time}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: C.ink, marginTop: 8 }}>{n.t}</div>
                  <div style={{ fontSize: 12, color: C.sub, marginTop: 4, lineHeight: 1.55 }}>{n.d}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

/* =========================================================
   PROFIL
   ========================================================= */
function ProfilPage({ go, askLogout }: any) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 20 }}>
      <Card>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <div style={{
            width: 100, height: 100, borderRadius: 99,
            background: `linear-gradient(135deg, ${C.navy}, ${C.blue})`,
            color: "var(--pomo-white)", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 36, fontWeight: 800, boxShadow: `0 12px 24px ${C.navy}40`,
          }}>BH</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.ink, marginTop: 14 }}>Budi Hartono</div>
          <div style={{ fontSize: 12, color: C.sub, marginTop: 4 }}>budi.hartono@email.com</div>
          <Badge color={C.green} bg={C.greenPale}><Star size={11} />POMO Member · Gold</Badge>
        </div>

        <div style={{ borderTop: `1px solid ${C.line}`, marginTop: 18, paddingTop: 16, display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8, textAlign: "center" }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.ink }}>47</div>
            <div style={{ fontSize: 10, color: C.sub }}>Transaksi</div>
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.ink }}>284 L</div>
            <div style={{ fontSize: 10, color: C.sub }}>BBM Terisi</div>
          </div>
        </div>

        <PrimaryBtn style={{ width: "100%", justifyContent: "center", marginTop: 18, padding: "12px 0" }}>
          Edit Profil
        </PrimaryBtn>
      </Card>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Card>
          <div style={{ fontSize: 14, fontWeight: 800, color: C.ink, marginBottom: 12 }}>Informasi Akun</div>
          {[
            { l: "Nama Lengkap", v: "Budi Hartono", i: <UserCircle2 size={14} /> },
            { l: "Email", v: "budi.hartono@email.com", i: <Mail size={14} /> },
            { l: "No. Telepon", v: "+62 812-3456-7890", i: <Phone size={14} /> },
            { l: "Tanggal Lahir", v: "15 Agustus 1994", i: <Calendar size={14} /> },
            { l: "Kota", v: "Cimahi, Jawa Barat", i: <MapIcon size={14} /> },
          ].map(r => (
            <div key={r.l} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "12px 0", borderBottom: `1px solid ${C.line}`,
            }}>
              <span style={{ display: "flex", alignItems: "center", gap: 10, color: C.sub, fontSize: 12 }}>
                <span style={{ color: C.navy }}>{r.i}</span>{r.l}
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{r.v}</span>
            </div>
          ))}
        </Card>

        <Card>
          <div style={{ fontSize: 14, fontWeight: 800, color: C.ink, marginBottom: 12 }}>Preferensi & Pengaturan</div>
          {[
            { l: "Notifikasi AI Smart Alert", i: <Bell size={14} />, on: true },
            { l: "Lokasi & Rekomendasi", i: <MapIcon size={14} />, on: true },
            { l: "Mode Hemat BBM", i: <Fuel size={14} />, on: false },
            { l: "Bantuan & Pusat Layanan", i: <HelpCircle size={14} />, link: true },
            { l: "Pengaturan Akun", i: <Settings size={14} />, link: true },
          ].map(r => (
            <div key={r.l} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "12px 0", borderBottom: `1px solid ${C.line}`,
            }}>
              <span style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: C.ink, fontWeight: 600 }}>
                <span style={{ color: C.navy }}>{r.i}</span>{r.l}
              </span>
              {r.link
                ? <ChevronRight size={14} color={C.sub} />
                : <div style={{
                    width: 34, height: 20, borderRadius: 99, background: r.on ? C.green : C.line,
                    position: "relative", transition: "all .2s",
                  }}>
                    <div style={{
                      position: "absolute", top: 2, left: r.on ? 16 : 2,
                      width: 16, height: 16, borderRadius: 99, background: "var(--pomo-white)",
                    }} />
                  </div>}
            </div>
          ))}
        </Card>

        <Card>
          <div style={{ fontSize: 14, fontWeight: 800, color: C.ink, marginBottom: 16 }}>Riwayat Ulasan</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {getReviewHistory().map((u, i, list) => (
              <div key={i} style={{
                paddingBottom: i === list.length - 1 ? 0 : 14,
                borderBottom: i === list.length - 1 ? "none" : `1px solid ${C.line}`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: C.navy }}>{u.spbu}</div>
                    <div style={{ fontSize: 11, color: C.sub, marginTop: 2 }}>{u.date}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 800, color: C.ink }}>
                    <Star size={13} fill="#FFD700" color="#FFD700" /> {u.rating}
                  </div>
                </div>
                <div style={{ fontSize: 12, color: C.sub, lineHeight: 1.5 }}>
                  {u.comment}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{
          background: `linear-gradient(135deg, ${C.cream}, var(--pomo-white))`,
          border: `1px solid ${C.line}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: C.ink }}>Keluar dari akun</div>
            <div style={{ fontSize: 12, color: C.sub, marginTop: 4 }}>
              Pastikan aktivitas pemesanan sudah selesai sebelum logout.
            </div>
          </div>
          <button onClick={askLogout} style={{
            background: `linear-gradient(135deg, ${C.maroon}, ${C.red})`, color: "var(--pomo-white)",
            padding: "10px 18px", borderRadius: 12, fontWeight: 700, fontSize: 13,
            border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8,
            boxShadow: `0 10px 22px ${C.red}40`,
          }}>
            <LogOut size={14} />Logout
          </button>
        </Card>
      </div>
    </div>
  );
}

/* =========================================================
   LOGOUT MODAL
   ========================================================= */
function LogoutModal({ close, confirm }: any) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(12,33,47,.55)",
      backdropFilter: "blur(4px)", zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center",
    }} onClick={close}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "var(--pomo-white)", borderRadius: 22, padding: 28, width: 420,
        boxShadow: "0 30px 60px rgba(0,0,0,.4)", textAlign: "center",
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: 99, background: C.redPale, color: C.red,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
        }}><LogOut size={28} /></div>
        <div style={{ fontSize: 20, fontWeight: 800, color: C.ink, marginTop: 16 }}>Keluar dari akun?</div>
        <div style={{ fontSize: 13, color: C.sub, marginTop: 8, lineHeight: 1.6 }}>
          Pastikan aktivitas pemesanan sudah selesai sebelum logout.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 22 }}>
          <GhostBtn onClick={close} style={{ justifyContent: "center", padding: "12px 0" }}>Batal</GhostBtn>
          <button onClick={confirm} style={{
            background: `linear-gradient(135deg, ${C.maroon}, ${C.red})`, color: "var(--pomo-white)",
            padding: "12px 0", borderRadius: 12, fontWeight: 700, fontSize: 13,
            border: "none", cursor: "pointer",
            boxShadow: `0 10px 22px ${C.red}40`,
          }}>Ya, Logout</button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   DASHBOARD SHELL
   ========================================================= */
function Dashboard({ current, go }: { current: Screen; go: (s: Screen) => void }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [mobileInPage, setMobileInPage] = useState(false);
  const [savedSpbu, setSavedSpbu] = useState<string | null>(null);

  const heading: Record<string, { t: string; s: string }> = {
    peta:    { t: "Peta SPBU",            s: "Pantau stok & antrean real-time di Bandung & Cimahi." },
    bayar:   { t: "Cek Stok BBM",         s: "Cari SPBU yang menyediakan BBM pilihanmu di wilayah terdekat." },
    histori: { t: "Histori Kunjungan",    s: "SPBU yang pernah Anda buka, kunjungi, atau pilih rutenya." },
    notif:   { t: "Update Kondisi SPBU",  s: "Update real-time stok, antrean, dan status operasional." },
    profil:  { t: "Profil",               s: "Detail akun, preferensi, dan pengaturan." },
  };
  const h = heading[current] ?? heading.peta;

  const openPage = (id: Screen) => { go(id); setMobileInPage(true); };
  const backToMenu = () => setMobileInPage(false);

  return (
    <div style={{ ...FONT, minHeight: "100vh", display: "flex", background: C.bg }} className={"pomo-shell" + (mobileInPage ? " pomo-in-page" : " pomo-in-menu")}>
      {/* MARKER-MAKE-KIT-INVOKED */}
      <style>{`
        /* Mobile-only menu wrapper: hidden on desktop, shown only on small screens */
        .pomo-mobile-only-menu { display: none; }
        @media (max-width: 900px) {
          /* Desktop chrome hidden on mobile */
          .pomo-shell { flex-direction: column; }
          .pomo-sidebar { display: none !important; }
          .pomo-topbar  { display: none !important; }
          /* Hide desktop main content when in menu mode */
          .pomo-shell.pomo-in-menu main { display: none !important; }
          /* Hide desktop main content when in page mode (overlay handles it) */
          .pomo-shell.pomo-in-page main { display: none !important; }
          /* Show mobile menu home */
          .pomo-shell.pomo-in-menu .pomo-mobile-only-menu { display: block; }
        }
      `}</style>

      {/* ── MOBILE: menu home (hidden via CSS on desktop) ── */}
      <div className="pomo-mobile-only-menu">
        {!mobileInPage && (
          <MobileMenuHome
            onNavigate={openPage as (id: string) => void}
            onNotif={() => openPage("notif")}
          />
        )}
      </div>

      {/* Sidebar */}
      <aside className="pomo-sidebar" style={{
        width: 250, background: `linear-gradient(180deg, ${C.navy}, ${C.navyDeep})`,
        color: "var(--pomo-white)", padding: "26px 18px", display: "flex", flexDirection: "column",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 6px 22px" }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: "rgba(255,255,255,.15)", display: "flex",
            alignItems: "center", justifyContent: "center",
            border: "1px solid rgba(255,255,255,.25)", position: "relative",
          }}>
            <Fuel size={22} />
            <div style={{ position: "absolute", top: -3, right: -3, padding: 3, borderRadius: 99, background: C.green }}>
              <Radar size={9} color="var(--pomo-white)" />
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 800, letterSpacing: 1.5, fontSize: 18 }}>POMO</div>
            <div style={{ fontSize: 9, opacity: .75, letterSpacing: 1.6 }}>POM · MONITOR</div>
          </div>
        </div>

        <div style={{ fontSize: 10, opacity: .55, letterSpacing: 1.5, padding: "8px 12px" }}>MENU</div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV.map(n => {
            const Icon = n.icon;
            const active = n.id === current;
            return (
              <div key={n.id} onClick={() => go(n.id)} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "11px 14px", borderRadius: 10, cursor: "pointer",
                background: active ? "rgba(255,255,255,.16)" : "transparent",
                fontSize: 13, fontWeight: active ? 700 : 500,
                position: "relative",
              }}>
                <Icon size={17} />
                <span>{n.label}</span>
                {active && <span style={{
                  position: "absolute", left: 0, top: 8, bottom: 8, width: 3,
                  background: C.lightBlue, borderRadius: 3,
                }} />}
              </div>
            );
          })}
        </nav>

        <div style={{ marginTop: "auto", padding: 14, borderRadius: 12, background: "rgba(255,255,255,.07)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <Sparkles size={14} color={C.lightBlue} />
            <span style={{ fontSize: 12, fontWeight: 700 }}>AI Smart Alert</span>
          </div>
          <div style={{ fontSize: 10, opacity: .8, lineHeight: 1.55 }}>
            POMO memprediksi stok SPBU dan menyarankan rute optimal otomatis.
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Mobile page heading */}
        <div className="pomo-page-head" style={{ display: "none" }}>
          <div className="t">{h.t}</div>
          <div className="s">{h.s}</div>
        </div>
        {/* Top bar */}
        <header className="pomo-topbar" style={{
          height: 72, padding: "0 32px", display: "flex", alignItems: "center",
          justifyContent: "space-between", background: "var(--pomo-white)",
          borderBottom: `1px solid ${C.line}`,
        }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.ink }}>{h.t}</div>
            <div style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>{h.s}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 280, display: "flex", alignItems: "center", gap: 8,
              padding: "0 14px", height: 42, borderRadius: 12,
              background: C.alabaster, border: `1px solid ${C.line}`,
            }}>
              <Search size={15} color={C.navy} />
              <input placeholder="Cari SPBU, BBM..." style={{
                flex: 1, background: "transparent", outline: "none", fontSize: 13, color: C.ink, border: "none",
              }} />
            </div>
            <div onClick={() => {
              document.documentElement.classList.toggle('dark');
              window.dispatchEvent(new Event('themechange'));
            }} style={{
              width: 42, height: 42, borderRadius: 12, background: C.alabaster,
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            }}>
              <Moon size={17} color={C.navy} />
            </div>
            <div onClick={() => go("notif")} style={{
              width: 42, height: 42, borderRadius: 12, background: C.alabaster,
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative",
            }}>
              <Bell size={17} color={C.navy} />
              <span style={{
                position: "absolute", top: 8, right: 9, width: 8, height: 8, borderRadius: 99,
                background: C.red, border: "2px solid " + C.alabaster,
              }} />
            </div>
            <div onClick={() => go("profil")} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "5px 14px 5px 5px",
              borderRadius: 999, background: C.alabaster, cursor: "pointer",
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: 99,
                background: `linear-gradient(135deg, ${C.navy}, ${C.blue})`,
                color: "var(--pomo-white)", display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 800, fontSize: 13,
              }}>BH</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.ink }}>Budi Hartono</div>
                <div style={{ fontSize: 10, color: C.sub }}>Gold Member</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="pomo-content" style={{ padding: 32, flex: 1, overflowY: "auto" }}>
          {current === "peta" && (
            <PetaPage
              go={go}
              openSheet={(p: Pin) => { setSelectedPin(p); setSheetOpen(true); }}
              closeSheet={() => { setSheetOpen(false); setSelectedPin(null); }}
              sheetOpen={sheetOpen}
              selectedPin={selectedPin}
            />
          )}
          {current === "histori" && <HistoriPage go={go} openSheet={() => setSheetOpen(true)} />}
          {current === "bayar" && <BayarPage go={go} openSheet={() => setSheetOpen(true)} />}
          {current === "notif" && <NotifPage />}
          {current === "profil" && <ProfilPage go={go} askLogout={() => setLogoutOpen(true)} />}
        </div>
      </main>

      {logoutOpen && (
        <LogoutModal close={() => setLogoutOpen(false)} confirm={() => { setLogoutOpen(false); go("signin"); }} />
      )}

      {/* ── MOBILE full-screen page overlays ── */}
      {mobileInPage && current === "peta"    && (
        <MobilePetaView
          onBack={backToMenu}
          onGoHistori={(spbuCode?: string) => {
            if (spbuCode) setSavedSpbu(spbuCode);
            openPage("histori");
          }}
        />
      )}
      {mobileInPage && current === "histori" && (
        <MobileHistoriView
          onBack={backToMenu}
          openMap={() => { backToMenu(); openPage("peta"); }}
          newSavedSpbu={savedSpbu}
        />
      )}
      {mobileInPage && current === "bayar"   && <MobileBayarView   onBack={backToMenu} openMap={() => { backToMenu(); openPage("peta"); }} />}
      {mobileInPage && current === "notif"   && <MobileNotifView   onBack={backToMenu} />}
      {mobileInPage && current === "profil"  && <MobileProfilView  onBack={backToMenu} askLogout={() => setLogoutOpen(true)} />}
    </div>
  );
}

const CCTV_CAMERAS = [
  {
    id: 1,
    label: "Cam 1: Jalur Antrean Motor (Cimahi Main Road)",
    overlayLabel: "CAM 1: Jalur Antrean Motor (Cimahi Main Road)",
    src: "/antrean_pom.gif",
  },
  {
    id: 2,
    label: "Cam 2: Jalur Dispenser Mobil",
    overlayLabel: "CAM 2: Jalur Dispenser Mobil",
    src: "/pemantauan_pom.gif",
  },
] as const;

type CctvCamId = (typeof CCTV_CAMERAS)[number]["id"];

function AdminPage({ go }: { go: (s: Screen) => void }) {
  const [buka, setBuka] = useState(true);
  const [cam, setCam] = useState<CctvCamId>(1);
  const [tab, setTab] = useState("dashboard");
  const [antrean, setAntrean] = useState("PANJANG");
  const [fasilitas, setFasilitas] = useState({ toilet: true, musholla: true, atm: true });
  const [katOpen, setKatOpen] = useState(false);
  const [kategori, setKategori] = useState("Semua Kategori");
  const [cctvDropdownOpen, setCctvDropdownOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("Semua Status");
  const [waktuOpen, setWaktuOpen] = useState(false);
  const [waktuFilter, setWaktuFilter] = useState("24 Jam Terakhir");
  
  // Settings Page States
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [pollingRate, setPollingRate] = useState(2);
  const [criticalStock, setCriticalStock] = useState(10);
  const [pressureLimit, setPressureLimit] = useState(150);
  const [maxTemp, setMaxTemp] = useState(35);
  const [autoSync, setAutoSync] = useState(true);
  const [shiftOpen, setShiftOpen] = useState(false);
  const [shift, setShift] = useState("Shift Pagi (06:00 - 14:00)");
  const activeCamera = CCTV_CAMERAS.find(camera => camera.id === cam) ?? CCTV_CAMERAS[0];
  const selectCctvCamera = (id: CctvCamId) => {
    setCam(id);
    setCctvDropdownOpen(false);
  };

  const historyData = [
    { k: "Sensor IoT (Tangki Bawah Tanah)", waktu: "08:15:22 WIB", kode: "ERR-TNK-01", sumber: "Sensor Tangki 1 (Pertalite)", desc: "Penurunan volume drastis 500L/menit (Indikasi Kebocoran / Error Sensor)", petugas: "Jojo Sucipto", status: "Critical" },
    { k: "Sensor IoT (Tangki Bawah Tanah)", waktu: "11:30:45 WIB", kode: "ERR-TMP-02", sumber: "Sensor Suhu Tangki 2 (Pertamax)", desc: "Suhu melebihi batas ambang kritis (>35°C)", petugas: "Jojo Sucipto", status: "Critical" },
    { k: "Sensor IoT (Tangki Bawah Tanah)", waktu: "14:10:05 WIB", kode: "WRN-LVL-03", sumber: "Sensor Level Tangki 3 (Dexlite)", desc: "Level BBM mendekati batas minimum (15%)", petugas: "Siti Rahma", status: "Warning" },
    { k: "Mesin Dispenser / Pompa", waktu: "09:05:12 WIB", kode: "ERR-DSP-04", sumber: "Dispenser 4 (Pulau 2)", desc: "Flowmeter tidak merespons (Pompa macet)", petugas: "Ahmad Faisal", status: "Critical" },
    { k: "Mesin Dispenser / Pompa", waktu: "10:20:33 WIB", kode: "INF-DSP-01", sumber: "Dispenser 1 (Pulau 1)", desc: "Reboot sistem pompa berhasil", petugas: "Ahmad Faisal", status: "Info" },
    { k: "Mesin Dispenser / Pompa", waktu: "15:45:00 WIB", kode: "WRN-DSP-02", sumber: "Dispenser 2 (Pulau 1)", desc: "Tegangan listrik tidak stabil pada nozzle", petugas: "Siti Rahma", status: "Warning" },
    { k: "Kamera CCTV & AI Antrean", waktu: "07:30:00 WIB", kode: "INF-CAM-01", sumber: "CCTV Cam 1", desc: "AI mendeteksi antrean panjang (>10 kendaraan)", petugas: "Sistem Otomatis", status: "Info" },
    { k: "Kamera CCTV & AI Antrean", waktu: "13:15:20 WIB", kode: "ERR-CAM-03", sumber: "CCTV Cam 2", desc: "Koneksi video feed terputus (No Signal)", petugas: "Jojo Sucipto", status: "Critical" },
    { k: "Kamera CCTV & AI Antrean", waktu: "16:00:10 WIB", kode: "INF-CAM-02", sumber: "CCTV Cam 2", desc: "Pergantian mode malam (IR aktif)", petugas: "Sistem Otomatis", status: "Info" },
    { k: "Operasional Manual (Petugas)", waktu: "06:00:00 WIB", kode: "OPR-SFT-01", sumber: "Terminal Kasir", desc: "Pergantian shift pagi (Siti Rahma login)", petugas: "Siti Rahma", status: "Info" },
    { k: "Operasional Manual (Petugas)", waktu: "12:00:00 WIB", kode: "OPR-MNT-01", sumber: "Area Toilet", desc: "Pembersihan rutin area fasilitas umum", petugas: "Jojo Sucipto", status: "Info" },
    { k: "Operasional Manual (Petugas)", waktu: "18:00:00 WIB", kode: "OPR-SFT-02", sumber: "Terminal Kasir", desc: "Pergantian shift malam (Ahmad Faisal login)", petugas: "Ahmad Faisal", status: "Info" },
  ];
  const filteredHistory = historyData.filter(d => {
    if (kategori !== "Semua Kategori" && d.k !== kategori) return false;
    if (statusFilter !== "Semua Status" && d.status !== statusFilter) return false;
    return true;
  });

  return (
    <div style={{ background: C.alabaster, height: "100vh", display: "flex", overflow: "hidden" }}>
      {/* Left Column: Sidebar */}
      <aside style={{
        width: 260, background: "var(--pomo-white)", borderRight: `1px solid ${C.line}`,
        display: "flex", flexDirection: "column", padding: "32px 24px"
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 48 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: `linear-gradient(135deg, ${C.green}, ${C.navy})`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Fuel size={20} color="var(--pomo-white)" />
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: C.ink, letterSpacing: 1 }}>POMO</div>
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
          <div 
            onClick={() => setTab("dashboard")}
            style={{ padding: "12px 16px", borderRadius: 12, background: tab === "dashboard" ? C.navy : "transparent", color: tab === "dashboard" ? "var(--pomo-white)" : C.sub, fontWeight: 700, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
          >
            <Activity size={18} /> Dashboard
          </div>
          <div 
            onClick={() => setTab("history")}
            style={{ padding: "12px 16px", borderRadius: 12, background: tab === "history" ? C.navy : "transparent", color: tab === "history" ? "var(--pomo-white)" : C.sub, fontWeight: 700, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
          >
            <History size={18} /> Riwayat
          </div>
          <div 
            onClick={() => setTab("iot")}
            style={{ padding: "12px 16px", borderRadius: 12, background: tab === "iot" ? C.navy : "transparent", color: tab === "iot" ? "var(--pomo-white)" : C.sub, fontWeight: 700, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
          >
            <Radio size={18} /> Data IoT
          </div>
          <div 
            onClick={() => setTab("settings")}
            style={{ padding: "12px 16px", borderRadius: 12, background: tab === "settings" ? C.navy : "transparent", color: tab === "settings" ? "var(--pomo-white)" : C.sub, fontWeight: 700, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
          >
            <Settings size={18} /> Pengaturan
          </div>
        </div>

        {/* Theme Toggle */}
        <div onClick={() => {
          document.documentElement.classList.toggle('dark');
          // Dispatch a custom event to notify other components if needed
          window.dispatchEvent(new Event('themechange'));
        }} style={{
          display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
          borderRadius: 12, color: C.ink, fontWeight: 700, cursor: "pointer",
          marginBottom: 8, background: C.alabaster
        }}>
          <Sun size={18} /> Ganti Tema
        </div>

        {/* Logout */}
        <div onClick={() => go("signin")} style={{
          display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
          borderRadius: 12, color: C.red, fontWeight: 700, cursor: "pointer",
          background: C.redPale
        }}>
          <LogOut size={18} /> Keluar
        </div>
      </aside>

      {/* Middle Column: Main Area */}
      <main style={{ flex: 1, padding: 32, overflowY: "auto", display: "flex", flexDirection: "column", gap: 24 }}>
        {tab === "dashboard" ? (
          <>
            <div style={{ fontSize: 24, fontWeight: 800, color: C.ink }}>Pemantauan Langsung</div>
            
            {/* Live CCTV Monitor */}
            <Card style={{ padding: 24, background: "#0D1117", border: "1px solid #21262D", display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Screen container */}
              <div style={{ position: "relative", width: "100%", height: 420, borderRadius: 12, overflow: "hidden", background: "#000", border: "1px solid #30363D" }}>
                {/* Grain Effect Overlay */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                  backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 0)",
                  backgroundSize: "4px 4px", opacity: 0.15, pointerEvents: "none", zIndex: 3
                }} />
                
                {/* Scanner/Scanline Effect */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: "100%",
                  background: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))",
                  backgroundSize: "100% 4px, 6px 100%", pointerEvents: "none", zIndex: 2
                }} />

                {/* CCTV Video feeds are preloaded and layered, so switching cameras is instant. */}
                {CCTV_CAMERAS.map(camera => {
                  const isActive = cam === camera.id;
                  return (
                    <img
                      key={camera.id}
                      src={camera.src}
                      alt={`${camera.label} CCTV Feed`}
                      loading="eager"
                      decoding="async"
                      draggable={false}
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        opacity: isActive ? 0.9 : 0,
                        visibility: isActive ? "visible" : "hidden",
                        transition: "opacity 80ms linear",
                        pointerEvents: "none",
                      }}
                    />
                  );
                })}

                {/* Timestamp & Label overlays */}
                <div style={{
                  position: "absolute", top: 16, left: 16, background: "rgba(0,0,0,0.6)", color: "#00FF66",
                  fontFamily: "'Courier New', Courier, monospace", fontSize: 13, padding: "4px 8px", borderRadius: 4, zIndex: 4
                }}>
                  REC • 2026-06-29 08:05:12
                </div>

                <div style={{
                  position: "absolute", top: 16, right: 16, background: "rgba(0,0,0,0.6)", color: "#fff",
                  fontSize: 12, fontWeight: 700, padding: "4px 8px", borderRadius: 4, letterSpacing: 0.5, zIndex: 4
                }}>
                  SPBU 34.405.05 - Cimahi
                </div>

                {/* Camera Name Indicator */}
                <div style={{
                  position: "absolute", bottom: 16, left: 16, background: "rgba(0,0,0,0.6)", color: "#fff",
                  fontSize: 13, fontWeight: 800, padding: "6px 12px", borderRadius: 6, zIndex: 4
                }}>
                  {activeCamera.overlayLabel}
                </div>
              </div>

              {/* Control Bar */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, zIndex: 10 }}>
                {/* Dropdown Pemilih Kamera */}
                <div style={{ position: "relative", width: 340 }}>
                  <div 
                    onClick={() => setCctvDropdownOpen(!cctvDropdownOpen)} 
                    style={{ 
                      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
                      padding: "12px 16px", background: "#161B22", border: "1px solid #30363D", borderRadius: 8,
                      cursor: "pointer", color: "#C9D1D9", fontSize: 13, fontWeight: 700, transition: "border .2s"
                    }}
                  >
                    <Video size={16} color="#8B949E" />
                    <span>Pilih Sudut Pandang Kamera</span>
                    <ChevronDown size={16} color="#8B949E" style={{ marginLeft: "auto", transform: cctvDropdownOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s" }} />
                  </div>

                  {cctvDropdownOpen && (
                    <div style={{
                      position: "absolute", bottom: "100%", left: 0, right: 0, marginBottom: 8,
                      background: "#161B22", border: "1px solid #30363D", borderRadius: 8, boxShadow: "0 10px 25px rgba(0,0,0,.5)",
                      padding: 6, zIndex: 50
                    }}>
                      {CCTV_CAMERAS.map(option => {
                        const isActive = cam === option.id;
                        return (
                          <div 
                            key={option.id}
                            onPointerDown={(event) => {
                              event.preventDefault();
                              selectCctvCamera(option.id);
                            }}
                            onClick={() => selectCctvCamera(option.id)}
                            style={{
                              display: "flex", alignItems: "center", justifyContent: "space-between",
                              padding: "10px 12px", borderRadius: 6, cursor: "pointer",
                              background: isActive ? "#21262D" : "transparent",
                              color: isActive ? "#58A6FF" : "#C9D1D9",
                              fontSize: 12, fontWeight: isActive ? 700 : 500, transition: "background .2s"
                            }}
                          >
                            <span>{option.label}</span>
                            {isActive && <CheckCircle2 size={14} color="#58A6FF" />}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Right side: Indicators & Action Buttons */}
                <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                  {/* Status Indicators */}
                  <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 11, fontWeight: 700, color: "#8B949E", borderRight: "1px solid #30363D", paddingRight: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 6, height: 6, borderRadius: 99, background: "#3FB950" }} />
                      <span>Sistem: <span style={{ color: "#3FB950" }}>Online</span></span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 6, height: 6, borderRadius: 99, background: C.red, animation: "mpulse 1.5s infinite" }} />
                      <span>Recording: <span style={{ color: C.red }}>Active</span></span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 6, height: 6, borderRadius: 99, background: "#58A6FF" }} />
                      <span>AI Detection: <span style={{ color: "#58A6FF" }}>Enabled</span></span>
                    </div>
                  </div>

                  {/* Actions (Screenshot & Fullscreen) */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button 
                      title="Ambil Tangkapan Layar"
                      style={{
                        background: "#161B22", border: "1px solid #30363D", color: "#C9D1D9",
                        width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", transition: "background .2s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#21262D"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "#161B22"}
                    >
                      <Camera size={16} />
                    </button>
                    <button 
                      title="Layar Penuh"
                      style={{
                        background: "#161B22", border: "1px solid #30363D", color: "#C9D1D9",
                        width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", transition: "background .2s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#21262D"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "#161B22"}
                    >
                      <Maximize size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Update Antrean & Analytics */}
            <div style={{ display: "flex", gap: 24, marginTop: "auto" }}>
              <Card style={{ flex: 1, padding: 24 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: C.ink, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                  <Activity size={20} color={C.navy} /> Manajemen Antrean
                </div>
                <div style={{ display: "flex", background: C.alabaster, borderRadius: 12, padding: 4 }}>
                  {["SEPI", "SEDANG", "PANJANG"].map(v => (
                    <div 
                      key={v}
                      onClick={() => setAntrean(v)}
                      style={{
                        flex: 1, textAlign: "center", padding: "10px 0", fontSize: 12, fontWeight: 800,
                        borderRadius: 8, cursor: "pointer", transition: "all .2s",
                        background: antrean === v ? "var(--pomo-white)" : "transparent",
                        color: antrean === v ? (v === "SEPI" ? C.green : v === "SEDANG" ? C.orange : C.red) : C.sub,
                        boxShadow: antrean === v ? "0 4px 12px rgba(0,0,0,.08)" : "none"
                      }}
                    >
                      {v}
                    </div>
                  ))}
                </div>
                <div style={{
                  marginTop: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: "10px", borderRadius: 10, background: C.redPale, color: C.red,
                  fontSize: 12, fontWeight: 800, cursor: "pointer", transition: "all .2s"
                }}>
                  <Megaphone size={16} /> Broadcast: Stok Menipis
                </div>
              </Card>
              
              <Card style={{ flex: 1.5, padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: C.ink }}>Traffic Density Heatmap (Last 12 Hrs)</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.sub }}>Avg: <span style={{color: C.navy}}>High</span></div>
                </div>
                <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 4, height: 40, borderBottom: `1px solid ${C.line}`, paddingBottom: 4 }}>
                  {[20, 35, 25, 40, 60, 85, 90, 75, 50, 45, 65, 80].map((h, idx) => (
                    <div key={idx} style={{ flex: 1, background: h > 70 ? C.red : h > 40 ? C.orange : C.green, height: `${h}%`, borderRadius: "4px 4px 0 0", opacity: 0.8 }} />
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 700, color: C.sub }}>
                  <div>Estimated Wait Time: <span style={{ color: C.red }}>4.5 Mins</span></div>
                  <div>Throughput: <span style={{ color: C.green }}>12 Cars/Hour</span></div>
                </div>
              </Card>
            </div>

            {/* Active Dispenser Terminal */}
            <Card style={{ padding: 16, background: C.ink, color: C.green }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <Activity size={16} color="var(--pomo-white)" />
                <span style={{ fontSize: 14, fontWeight: 800, color: "var(--pomo-white)" }}>Active Dispenser Terminal</span>
                <div style={{ marginLeft: "auto", fontSize: 11, color: C.sub, fontFamily: "'Courier New', Courier, monospace" }}>SYSLOG DAEMON RUNNING</div>
              </div>
              <div style={{ fontFamily: "'Courier New', Courier, monospace", fontSize: 12, display: "flex", justifyContent: "space-between", background: "#111827", padding: "12px 16px", borderRadius: 8, boxShadow: "inset 0 2px 8px rgba(0,0,0,0.5)" }}>
                <div><span style={{ color: C.sub }}>[PUMP 01]</span> <span style={{ color: C.green, fontWeight: "bold" }}>Flowing</span> - Pertamax</div>
                <div><span style={{ color: C.sub }}>[PUMP 02]</span> <span style={{ color: "#f59e0b", fontWeight: "bold" }}>Idle</span></div>
                <div><span style={{ color: C.sub }}>[PUMP 03]</span> <span style={{ color: C.red, fontWeight: "bold" }}>Offline/Error</span></div>
                <div><span style={{ color: C.sub }}>[PUMP 04]</span> <span style={{ color: C.green, fontWeight: "bold" }}>Flowing</span> - Pertalite</div>
              </div>
            </Card>
          </>
        ) : tab === "iot" ? (
          <>
            <div style={{ fontSize: 24, fontWeight: 800, color: C.ink }}>
              Monitoring Tangki Real-Time
              <div style={{ fontSize: 16, color: C.sub, marginTop: 4 }}>API Server Pertamina</div>
            </div>
            
            <div style={{ display: "flex", gap: 24 }}>
              {/* Visualisasi Tangki & Skema */}
              <Card style={{ flex: 1, padding: 32, display: "flex", flexDirection: "column", background: "var(--pomo-white)" }}>
                
                {/* Bagian Atas: Tangki & Metrik */}
                <div style={{ display: "flex", justifyContent: "center", gap: 32, position: "relative", zIndex: 2 }}>
                  
                  {/* Cylinder 1: Pertalite */}
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    {/* Metrik Kiri */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 12, textAlign: "right", fontSize: 11, fontWeight: 700, color: C.sub, width: 110 }}>
                      <div>Max Kapasitas:<br/><span style={{ color: C.ink, fontSize: 13 }}>32.000 L</span></div>
                      <div>Volume Saat Ini:<br/><span style={{ color: C.red, fontSize: 14 }}>6.400 L</span></div>
                      <div>Density:<br/><span style={{ color: C.ink, fontSize: 12 }}>730 kg/m³</span></div>
                      <div>Water Level:<br/><span style={{ color: C.ink, fontSize: 12 }}>2 mm</span></div>
                    </div>
                    
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                      <div style={{ position: "relative", width: 120, height: 260, borderRadius: 60, background: C.alabaster, boxShadow: "inset 0 4px 12px rgba(0,0,0,.08)", overflow: "hidden" }}>
                        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "20%", background: `linear-gradient(180deg, ${C.redPale}, ${C.red})`, transition: "height 1s ease" }} />
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(255,255,255,.5) 0%, rgba(255,255,255,0) 30%, rgba(0,0,0,.05) 100%)", pointerEvents: "none" }} />
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <div style={{ background: "var(--pomo-white)", padding: "6px 16px", borderRadius: 99, fontWeight: 800, color: C.red, boxShadow: "0 4px 16px rgba(0,0,0,.15)", fontSize: 16 }}>20%</div>
                        </div>
                      </div>
                      <div style={{ fontWeight: 800, color: C.ink, fontSize: 16 }}>Pertalite</div>
                    </div>
                  </div>
                  
                  {/* Cylinder 2: Pertamax */}
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                      <div style={{ position: "relative", width: 120, height: 260, borderRadius: 60, background: C.alabaster, boxShadow: "inset 0 4px 12px rgba(0,0,0,.08)", overflow: "hidden" }}>
                        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "85%", background: `linear-gradient(180deg, rgba(0,167,143,.4), ${C.green})`, transition: "height 1s ease" }} />
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(255,255,255,.5) 0%, rgba(255,255,255,0) 30%, rgba(0,0,0,.05) 100%)", pointerEvents: "none" }} />
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <div style={{ background: "var(--pomo-white)", padding: "6px 16px", borderRadius: 99, fontWeight: 800, color: C.green, boxShadow: "0 4px 16px rgba(0,0,0,.15)", fontSize: 16 }}>85%</div>
                        </div>
                      </div>
                      <div style={{ fontWeight: 800, color: C.ink, fontSize: 16 }}>Pertamax</div>
                    </div>

                    {/* Metrik Kanan */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 12, textAlign: "left", fontSize: 11, fontWeight: 700, color: C.sub, width: 110 }}>
                      <div>Max Kapasitas:<br/><span style={{ color: C.ink, fontSize: 13 }}>32.000 L</span></div>
                      <div>Volume Saat Ini:<br/><span style={{ color: C.green, fontSize: 14 }}>27.200 L</span></div>
                      <div>Density:<br/><span style={{ color: C.ink, fontSize: 12 }}>715 kg/m³</span></div>
                      <div>Water Level:<br/><span style={{ color: C.ink, fontSize: 12 }}>0 mm</span></div>
                    </div>
                  </div>

                </div>

                {/* Bagian Bawah: Skema Pipa / Circuit & Dispenser */}
                <div style={{ position: "relative", marginTop: -12, display: "flex", flexDirection: "column", alignItems: "center", zIndex: 1 }}>
                  {/* Vertical lines coming down from tanks */}
                  <div style={{ display: "flex", width: "100%", justifyContent: "center", gap: 266 }}>
                    <div style={{ width: 2, height: 32, background: C.line }}></div>
                    <div style={{ width: 2, height: 32, background: C.line }}></div>
                  </div>
                  {/* Horizontal manifold line */}
                  <div style={{ width: 440, height: 2, background: C.line }}></div>
                  {/* Vertical lines going to dispensers */}
                  <div style={{ display: "flex", width: 440, justifyContent: "space-between" }}>
                    <div style={{ width: 2, height: 24, background: C.line }}></div>
                    <div style={{ width: 2, height: 24, background: C.line }}></div>
                    <div style={{ width: 2, height: 24, background: C.line }}></div>
                  </div>
                  {/* Dispenser Boxes */}
                  <div style={{ display: "flex", width: 500, justifyContent: "space-between", marginTop: -2 }}>
                    {[1, 2, 3].map(i => (
                      <div key={i} style={{ width: 96, padding: "8px 0", background: "var(--pomo-white)", border: `2px solid ${C.line}`, borderRadius: 12, textAlign: "center", zIndex: 2, boxShadow: "0 4px 12px rgba(0,0,0,.05)" }}>
                        <div style={{ fontSize: 11, fontWeight: 800, color: C.sub }}>DISPENSER {i}</div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: C.ink, marginTop: 4, display: "flex", justifyContent: "center", alignItems: "center", gap: 6 }}>
                          <div style={{ width: 6, height: 6, borderRadius: 99, background: C.green }} /> Active
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Metrics Card */}
              <div style={{ width: 280, display: "flex", flexDirection: "column", gap: 16 }}>
                <Card style={{ padding: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.sub, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}><Radio size={16}/> Status API</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: C.green }}>Terhubung (Ping 12ms)</div>
                </Card>
                <Card style={{ padding: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.sub, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}><Wind size={16}/> Suhu Tangki</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: C.ink }}>28.5°C</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.sub, marginTop: 4 }}>Normal</div>
                </Card>
                <Card style={{ padding: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.sub, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}><Clock size={16}/> Estimasi Sisa Waktu</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: C.sub }}>Pertalite</span>
                      <span style={{ fontSize: 15, fontWeight: 800, color: C.red }}>4 Jam</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: C.sub }}>Pertamax</span>
                      <span style={{ fontSize: 15, fontWeight: 800, color: C.green }}>2 Hari</span>
                    </div>
                  </div>
                </Card>
                <Card style={{ padding: 20, background: "#fffbeb", border: "1px solid #fde047" }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#a16207", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}><AlertTriangle size={16}/> Sistem Alarm Aktif</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#854d0e", lineHeight: 1.5, display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <div style={{ width: 6, height: 6, background: "#eab308", borderRadius: 99, marginTop: 5, animation: "mpulse 1.5s infinite" }}></div>
                      <div>[Warning] Flow rate pompa 2 tidak stabil</div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <div style={{ width: 6, height: 6, background: "#eab308", borderRadius: 99, marginTop: 5, animation: "mpulse 1.5s infinite" }}></div>
                      <div>[Warning] Filter dispenser 3 perlu inspeksi</div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
            
            <div style={{ display: "flex", gap: 24, marginTop: 16 }}>
              {/* Left: Grafik Telemetri Flow Rate */}
              <Card style={{ flex: 2, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: C.ink }}>Grafik Telemetri Flow Rate</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.sub }}>Pump Pressure: <span style={{ color: C.navy }}>125 kPa</span></div>
                </div>
                <div style={{ flex: 1, background: C.alabaster, borderRadius: 12, position: "relative", overflow: "hidden", minHeight: 200, display: "flex" }}>
                  {/* Grid lines & Labels */}
                  <div style={{ width: 56, display: "flex", flexDirection: "column", justifyContent: "space-between", color: C.sub, fontSize: 11, fontWeight: 700, padding: "20px 0 32px 0", textAlign: "center", borderRight: `1px solid ${C.line}`, zIndex: 2, background: C.alabaster }}>
                    <span>100 L/s</span>
                    <span>50 L/s</span>
                    <span>0 L/s</span>
                  </div>
                  
                  <div style={{ flex: 1, position: "relative" }}>
                    {/* Horizontal Grid lines */}
                    <div style={{ position: "absolute", top: "24px", left: 0, right: 0, borderTop: `1px dashed ${C.line}` }}></div>
                    <div style={{ position: "absolute", top: "50%", left: 0, right: 0, borderTop: `1px dashed ${C.line}` }}></div>
                    <div style={{ position: "absolute", bottom: "36px", left: 0, right: 0, borderTop: `1px dashed ${C.line}` }}></div>
                    
                    <svg width="100%" height="100%" viewBox="0 0 400 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0 }}>
                      {/* Grid background */}
                      <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 20" fill="none" stroke={C.line} strokeWidth="0.5" />
                      </pattern>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                      {/* Soft pink gradient fill */}
                      <defs>
                        <linearGradient id="pinkGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#ffb6c1" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#ffb6c1" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path d="M0,80 Q20,20 60,60 T140,40 T220,70 T300,30 T360,50 L400,20 L400,100 L0,100 Z" fill="url(#pinkGrad)" />
                      {/* Secondary grey line (kemarin) */}
                      <path d="M0,60 Q20,30 60,50 T140,60 T220,40 T300,50 T360,70 L400,40" fill="none" stroke="#d1d5db" strokeWidth="2" strokeDasharray="4 4" />
                      {/* Soft blue line */}

                      <path d="M0,80 Q20,20 60,60 T140,40 T220,70 T300,30 T360,50 L400,20" fill="none" stroke="#60a5fa" strokeWidth="2.5" />
                      {/* Data points */}
                      <circle cx="60" cy="60" r="4.5" fill="#3b82f6" stroke="var(--pomo-white)" strokeWidth="2" />
                      <circle cx="140" cy="40" r="4.5" fill="#3b82f6" stroke="var(--pomo-white)" strokeWidth="2" />
                      <circle cx="220" cy="70" r="4.5" fill="#3b82f6" stroke="var(--pomo-white)" strokeWidth="2" />
                      <circle cx="300" cy="30" r="4.5" fill="#3b82f6" stroke="var(--pomo-white)" strokeWidth="2" />
                      <circle cx="360" cy="50" r="4.5" fill="#3b82f6" stroke="var(--pomo-white)" strokeWidth="2" />
                    </svg>

                    {/* X Axis Labels */}
                    <div style={{ position: "absolute", bottom: 8, left: 16, right: 16, display: "flex", justifyContent: "space-between", color: C.sub, fontSize: 10, fontWeight: 700 }}>
                      <span>10:40</span>
                      <span>10:41</span>
                      <span>10:42</span>
                      <span>10:43</span>
                      <span>10:44</span>
                      <span>10:45</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Right: Raw API Payload Log */}
              <Card style={{ flex: 1, padding: 24, display: "flex", flexDirection: "column", gap: 16, background: "var(--pomo-white)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: C.ink }}>Raw API Payload Log</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.sub }}>Sync: <span style={{ color: C.green }}>Real-time</span></div>
                </div>
                <div style={{ flex: 1, background: C.alabaster, borderRadius: 12, padding: 16, fontFamily: "'Courier New', Courier, monospace", fontSize: 13, overflow: "hidden", lineHeight: 1.6, position: "relative", color: C.ink, boxShadow: "inset 0 2px 8px rgba(0,0,0,.04)" }}>
                  <div style={{ color: C.sub }}>[10:45:01] <span style={{ color: C.green, fontWeight: "bold" }}>RECV</span> payload:</div>
                  <div style={{ paddingLeft: 8, marginTop: 4 }}>
                    {"{"}<br/>
                    &nbsp;&nbsp;<span style={{ color: C.orange }}>"sensor_id"</span>: <span style={{ color: C.navy }}>"TNK-01"</span>,<br/>
                    &nbsp;&nbsp;<span style={{ color: C.orange }}>"vol"</span>: <span style={{ color: C.red }}>2100.5</span>,<br/>
                    &nbsp;&nbsp;<span style={{ color: C.orange }}>"pressure"</span>: <span style={{ color: C.navy }}>"120kPa"</span>,<br/>
                    &nbsp;&nbsp;<span style={{ color: C.orange }}>"status"</span>: <span style={{ color: C.green }}>"OK"</span><br/>
                    {"}"}
                  </div>
                  <div style={{ color: C.sub, marginTop: 12 }}>[10:45:02] <span style={{ color: C.green, fontWeight: "bold" }}>RECV</span> heartbeat</div>
                  <div style={{ position: "absolute", bottom: 16, right: 16, width: 8, height: 8, background: C.green, borderRadius: 99, animation: "mpulse 1.5s infinite" }}></div>
                </div>
              </Card>
            </div>
          </>
        ) : tab === "history" ? (
          <>
            {/* HEADER */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 24, fontWeight: 900, color: C.ink }}>Riwayat Operasional</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.sub }}>Audit Log & System Events — Interchange Tol Baros</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: "var(--pomo-white)", borderRadius: 8, border: `1px solid ${C.line}`, cursor: "pointer", fontSize: 14, fontWeight: 800, color: C.navy, boxShadow: "0 2px 4px rgba(0,0,0,.02)" }}>
                <Download size={16} />
                Export CSV/PDF
              </div>
            </div>

            {/* AREA CONTROL BAR (FILTER DATA) */}
            <div style={{ display: "flex", gap: 16, position: "relative", zIndex: 10, marginBottom: 24, padding: "12px", background: "var(--pomo-white)", borderRadius: 16, border: `1px solid ${C.line}` }}>
              {/* Kategori Dropdown (Toggleable) */}
              <div style={{ position: "relative", flex: 1 }}>
                <div onClick={() => setKatOpen(!katOpen)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", background: C.alabaster, borderRadius: 12, cursor: "pointer" }}>
                  <Filter size={18} color={C.sub} />
                  <span style={{ fontSize: 14, color: C.ink, fontWeight: 700 }}>Kategori:</span>
                  <span style={{ fontSize: 14, color: C.navy, fontWeight: 800, marginLeft: "auto" }}>{kategori === "Semua Kategori" ? "Semua" : kategori.substring(0, 14) + "..."}</span>
                  <ChevronDown size={18} color={C.navy} style={{ transform: katOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s" }} />
                </div>
                {/* Pop-up Menu */}
                {katOpen && (
                  <div style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: 8, background: "var(--pomo-white)", borderRadius: 12, border: `1px solid ${C.line}`, boxShadow: "0 10px 25px rgba(0,0,0,.2)", padding: 8, zIndex: 50 }}>
                    {[
                      "Semua Kategori",
                      "Sensor IoT (Tangki Bawah Tanah)",
                      "Mesin Dispenser / Pompa",
                      "Kamera CCTV & AI Antrean",
                      "Operasional Manual (Petugas)"
                    ].map((item, i) => {
                      const isActive = kategori === item;
                      return (
                        <div key={i} onClick={() => { setKategori(item); setKatOpen(false); }} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 8, background: isActive ? C.bluePale : "transparent", cursor: "pointer" }}>
                          <span style={{ fontSize: 13, fontWeight: isActive ? 800 : 600, color: isActive ? C.navy : C.ink }}>{item}</span>
                          {isActive && <CheckCircle2 size={16} color={C.navy} />}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Status Dropdown (Toggleable) */}
              <div style={{ position: "relative", flex: 1 }}>
                <div onClick={() => setStatusOpen(!statusOpen)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", background: C.alabaster, borderRadius: 12, cursor: "pointer" }}>
                  <span style={{ fontSize: 14, color: C.ink, fontWeight: 700 }}>Status:</span>
                  <span style={{ fontSize: 14, color: C.navy, fontWeight: 800, marginLeft: "auto" }}>{statusFilter}</span>
                  <ChevronDown size={18} color={C.navy} style={{ transform: statusOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s" }} />
                </div>
                {statusOpen && (
                  <div style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: 8, background: "var(--pomo-white)", borderRadius: 12, border: `1px solid ${C.line}`, boxShadow: "0 10px 25px rgba(0,0,0,.2)", padding: 8, zIndex: 50 }}>
                    {["Semua Status", "Info", "Warning", "Critical"].map((item, i) => {
                      const isActive = statusFilter === item;
                      return (
                        <div key={i} onClick={() => { setStatusFilter(item); setStatusOpen(false); }} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 8, background: isActive ? C.bluePale : "transparent", cursor: "pointer" }}>
                          <span style={{ fontSize: 13, fontWeight: isActive ? 800 : 600, color: isActive ? C.navy : C.ink }}>{item}</span>
                          {isActive && <CheckCircle2 size={16} color={C.navy} />}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Waktu Dropdown (Toggleable) */}
              <div style={{ position: "relative", flex: 1 }}>
                <div onClick={() => setWaktuOpen(!waktuOpen)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", background: C.alabaster, borderRadius: 12, cursor: "pointer" }}>
                  <Clock size={18} color={C.sub} />
                  <span style={{ fontSize: 14, color: C.ink, fontWeight: 700 }}>Waktu:</span>
                  <span style={{ fontSize: 14, color: C.navy, fontWeight: 800, marginLeft: "auto" }}>{waktuFilter}</span>
                  <ChevronDown size={18} color={C.navy} style={{ transform: waktuOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s" }} />
                </div>
                {waktuOpen && (
                  <div style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: 8, background: "var(--pomo-white)", borderRadius: 12, border: `1px solid ${C.line}`, boxShadow: "0 10px 25px rgba(0,0,0,.2)", padding: 8, zIndex: 50 }}>
                    {["24 Jam Terakhir", "7 Hari Terakhir", "30 Hari Terakhir"].map((item, i) => {
                      const isActive = waktuFilter === item;
                      return (
                        <div key={i} onClick={() => { setWaktuFilter(item); setWaktuOpen(false); }} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 8, background: isActive ? C.bluePale : "transparent", cursor: "pointer" }}>
                          <span style={{ fontSize: 13, fontWeight: isActive ? 800 : 600, color: isActive ? C.navy : C.ink }}>{item}</span>
                          {isActive && <CheckCircle2 size={16} color={C.navy} />}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* AREA TABEL DATA (Hasil Filter) */}
            <Card style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--pomo-white)", padding: 0 }}>
              {/* Header Kolom */}
              <div style={{ padding: "16px 24px", borderBottom: `1px solid ${C.line}`, display: "grid", gridTemplateColumns: "1.2fr 1.2fr 1.5fr 3fr 1fr", gap: 16, fontSize: 13, fontWeight: 800, color: C.sub, letterSpacing: 0.5, textTransform: "uppercase" }}>
                <div>Waktu</div>
                <div>Kode Event</div>
                <div>Sumber Hardware</div>
                <div>Deskripsi</div>
                <div>Petugas</div>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", overflowY: "auto", fontSize: 13, color: C.ink }}>
                {filteredHistory.length === 0 ? (
                  <div style={{ padding: 48, textAlign: "center", color: C.sub }}>Tidak ada data untuk kategori ini.</div>
                ) : filteredHistory.map((row, i) => (
                  <div key={i} style={{ padding: "16px 24px", borderBottom: `1px solid ${C.line}`, display: "grid", gridTemplateColumns: "1.2fr 1.2fr 1.5fr 3fr 1fr", gap: 16, alignItems: "center", transition: "background .2s", cursor: "pointer", background: i % 2 === 0 ? "var(--pomo-white)" : C.alabaster }}>
                    <div style={{ color: C.sub, fontFamily: "'Courier New', Courier, monospace", fontWeight: 800 }}>{row.waktu}</div>
                    <div style={{ color: row.status === "Critical" ? C.red : row.status === "Warning" ? C.yellow : C.green, fontFamily: "'Courier New', Courier, monospace", fontWeight: 800 }}>{row.kode}</div>
                    <div style={{ fontWeight: 800 }}>{row.sumber}</div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}>{row.desc}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 24, height: 24, borderRadius: 12, background: C.navy, color: "var(--pomo-white)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800 }}>
                        {row.petugas.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span style={{ fontWeight: 700 }}>{row.petugas}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </>
        ) : tab === "settings" ? (
          <>
            <div style={{ fontSize: 24, fontWeight: 800, color: C.ink, flexShrink: 0 }}>
              Pengaturan Sistem
              <div style={{ fontSize: 16, color: C.sub, marginTop: 4 }}>System Configuration</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 24, flex: 1, overflowY: "auto", paddingBottom: 16 }}>
              {/* ROW 1 */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, alignItems: "stretch" }}>
                {/* Section 1: Konfigurasi IoT & API */}
                <Card style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: C.navy, display: "flex", alignItems: "center", gap: 8, borderBottom: `1px solid ${C.line}`, paddingBottom: 12 }}>
                    <Radio size={18} /> Technical Setup
                  </div>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <label style={{ fontSize: 13, fontWeight: 700, color: C.sub }}>API Endpoint URL</label>
                    <div style={{ background: C.alabaster, border: `1px solid ${C.line}`, padding: "12px 16px", borderRadius: 8, fontSize: 14, fontWeight: 600, color: C.ink }}>
                      server-pertamina-v2.api
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <label style={{ fontSize: 13, fontWeight: 700, color: C.sub }}>API Key</label>
                    <div style={{ background: C.alabaster, border: `1px solid ${C.line}`, padding: "12px 16px", borderRadius: 8, fontSize: 14, fontWeight: 600, color: C.ink, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      {apiKeyVisible ? "ptm-prod-ak923847-x" : "•••••••••••••••••••••"}
                      <div onClick={() => setApiKeyVisible(!apiKeyVisible)} style={{ cursor: "pointer", display: "flex" }}>
                        {apiKeyVisible ? <Eye size={16} color={C.navy} /> : <EyeOff size={16} color={C.sub} />}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <label style={{ fontSize: 13, fontWeight: 700, color: C.sub }}>Data Polling Rate</label>
                      <span style={{ fontSize: 13, fontWeight: 800, color: C.navy }}>{pollingRate}s / update</span>
                    </div>
                    <div style={{ position: "relative", height: 6, background: C.line, borderRadius: 99 }}>
                      <input type="range" min="1" max="10" value={pollingRate} onChange={(e) => setPollingRate(Number(e.target.value))} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, zIndex: 10, cursor: "pointer" }} />
                      <div style={{ position: "absolute", left: 0, width: `${(pollingRate / 10) * 100}%`, height: "100%", background: C.navy, borderRadius: 99 }}></div>
                      <div style={{ position: "absolute", left: `${(pollingRate / 10) * 100}%`, top: "50%", transform: "translate(-50%, -50%)", width: 16, height: 16, background: "var(--pomo-white)", border: `3px solid ${C.navy}`, borderRadius: 99, boxShadow: "0 2px 4px rgba(0,0,0,.1)" }}></div>
                    </div>
                  </div>
                </Card>

                {/* Section 2: Ambang Batas Peringatan */}
                <Card style={{ padding: 24, display: "flex", flexDirection: "column", gap: 24 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: C.navy, display: "flex", alignItems: "center", gap: 8, borderBottom: `1px solid ${C.line}`, paddingBottom: 12 }}>
                    <Activity size={18} /> Threshold Configuration
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <label style={{ fontSize: 13, fontWeight: 700, color: C.sub }}>Critical Stock Threshold</label>
                      <span style={{ fontSize: 13, fontWeight: 800, color: C.red }}>{criticalStock}%</span>
                    </div>
                    <div style={{ position: "relative", height: 6, background: C.line, borderRadius: 99 }}>
                      <input type="range" min="0" max="50" value={criticalStock} onChange={(e) => setCriticalStock(Number(e.target.value))} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, zIndex: 10, cursor: "pointer" }} />
                      <div style={{ position: "absolute", left: 0, width: `${(criticalStock / 50) * 100}%`, height: "100%", background: C.red, borderRadius: 99 }}></div>
                      <div style={{ position: "absolute", left: `${(criticalStock / 50) * 100}%`, top: "50%", transform: "translate(-50%, -50%)", width: 16, height: 16, background: "var(--pomo-white)", border: `3px solid ${C.red}`, borderRadius: 99, boxShadow: "0 2px 4px rgba(0,0,0,.1)" }}></div>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <label style={{ fontSize: 13, fontWeight: 700, color: C.sub }}>Pressure Safety Limit</label>
                      <span style={{ fontSize: 13, fontWeight: 800, color: C.orange }}>{pressureLimit} kPa</span>
                    </div>
                    <div style={{ position: "relative", height: 6, background: C.line, borderRadius: 99 }}>
                      <input type="range" min="0" max="250" step="5" value={pressureLimit} onChange={(e) => setPressureLimit(Number(e.target.value))} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, zIndex: 10, cursor: "pointer" }} />
                      <div style={{ position: "absolute", left: 0, width: `${(pressureLimit / 250) * 100}%`, height: "100%", background: C.orange, borderRadius: 99 }}></div>
                      <div style={{ position: "absolute", left: `${(pressureLimit / 250) * 100}%`, top: "50%", transform: "translate(-50%, -50%)", width: 16, height: 16, background: "var(--pomo-white)", border: `3px solid ${C.orange}`, borderRadius: 99, boxShadow: "0 2px 4px rgba(0,0,0,.1)" }}></div>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <label style={{ fontSize: 13, fontWeight: 700, color: C.sub }}>Suhu Tangki Maksimal</label>
                      <span style={{ fontSize: 13, fontWeight: 800, color: C.orange }}>{maxTemp}°C</span>
                    </div>
                    <div style={{ position: "relative", height: 6, background: C.line, borderRadius: 99 }}>
                      <input type="range" min="0" max="50" value={maxTemp} onChange={(e) => setMaxTemp(Number(e.target.value))} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, zIndex: 10, cursor: "pointer" }} />
                      <div style={{ position: "absolute", left: 0, width: `${(maxTemp / 50) * 100}%`, height: "100%", background: C.orange, borderRadius: 99 }}></div>
                      <div style={{ position: "absolute", left: `${(maxTemp / 50) * 100}%`, top: "50%", transform: "translate(-50%, -50%)", width: 16, height: 16, background: "var(--pomo-white)", border: `3px solid ${C.orange}`, borderRadius: 99, boxShadow: "0 2px 4px rgba(0,0,0,.1)" }}></div>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                    <label style={{ fontSize: 13, fontWeight: 700, color: C.sub, flex: 1, paddingRight: 16 }}>Auto-Sync Sensor Calibration</label>
                    <div onClick={() => setAutoSync(!autoSync)} style={{ width: 44, height: 24, borderRadius: 99, background: autoSync ? C.green : C.line, position: "relative", cursor: "pointer", transition: "background .2s" }}>
                      <div style={{ width: 18, height: 18, borderRadius: 99, background: "var(--pomo-white)", position: "absolute", top: 3, left: autoSync ? 23 : 3, boxShadow: "0 2px 4px rgba(0,0,0,.2)", transition: "left .2s" }} />
                    </div>
                  </div>
                </Card>

                {/* Section 3: Manajemen Profil & Shift */}
                <Card style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: C.navy, display: "flex", alignItems: "center", gap: 8, borderBottom: `1px solid ${C.line}`, paddingBottom: 12 }}>
                    <UserCircle2 size={18} /> Profil & Operasional
                  </div>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: 16, background: C.alabaster, padding: 16, borderRadius: 12 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 24, background: C.navy, color: "var(--pomo-white)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800 }}>JS</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <div style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>Jojo Sucipto</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.sub }}>ID: EMP-00824</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.sub }}>Operational Supervisor</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <label style={{ fontSize: 13, fontWeight: 700, color: C.sub }}>Shift Assignment</label>
                    <div style={{ position: "relative" }}>
                      <div onClick={() => setShiftOpen(!shiftOpen)} style={{ background: C.alabaster, border: `1px solid ${C.line}`, padding: "12px 16px", borderRadius: 8, fontSize: 14, fontWeight: 700, color: C.ink, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                        {shift}
                        <ChevronDown size={16} color={C.sub} style={{ transform: shiftOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s" }} />
                      </div>
                      {shiftOpen && (
                        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: 8, background: "var(--pomo-white)", borderRadius: 12, border: `1px solid ${C.line}`, boxShadow: "0 10px 25px rgba(0,0,0,.2)", padding: 8, zIndex: 50 }}>
                          {["Shift Pagi (06:00 - 14:00)", "Shift Sore (14:00 - 22:00)", "Shift Malam (22:00 - 06:00)"].map((item, i) => {
                            const isActive = shift === item;
                            return (
                              <div key={i} onClick={() => { setShift(item); setShiftOpen(false); }} style={{ padding: "12px 16px", borderRadius: 8, background: isActive ? C.bluePale : "transparent", cursor: "pointer", fontSize: 13, fontWeight: isActive ? 800 : 600, color: isActive ? C.navy : C.ink, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                {item}
                                {isActive && <CheckCircle2 size={16} color={C.navy} />}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
              
              {/* ROW 2: New Technical Status Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                {/* Connectivity & Network Status */}
                <Card style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: C.navy, display: "flex", alignItems: "center", gap: 8, borderBottom: `1px solid ${C.line}`, paddingBottom: 12 }}>
                    <Radio size={18} /> Connectivity & Network Status
                  </div>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.sub }}>Local IP Address</div>
                      <div style={{ fontFamily: "'Courier New', Courier, monospace", fontSize: 14, fontWeight: 800, color: C.ink }}>192.168.1.55</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.sub }}>Subnet Mask</div>
                      <div style={{ fontFamily: "'Courier New', Courier, monospace", fontSize: 14, fontWeight: 800, color: C.ink }}>255.255.255.0</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.sub }}>Gateway</div>
                      <div style={{ fontFamily: "'Courier New', Courier, monospace", fontSize: 14, fontWeight: 800, color: C.ink }}>192.168.1.1</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.sub }}>Signal Strength</div>
                      <div style={{ fontFamily: "'Courier New', Courier, monospace", fontSize: 14, fontWeight: 800, color: C.green }}>-45 dBm (Excellent)</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: C.alabaster, padding: "16px", borderRadius: 12, border: `1px solid ${C.line}`, marginTop: "auto" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 20 }}>
                        <div style={{ width: 4, height: 8, background: C.green, borderRadius: 2 }} />
                        <div style={{ width: 4, height: 12, background: C.green, borderRadius: 2 }} />
                        <div style={{ width: 4, height: 16, background: C.green, borderRadius: 2 }} />
                        <div style={{ width: 4, height: 20, background: C.green, borderRadius: 2 }} />
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>Connection Stable</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.sub }}>Packet Loss</div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: C.green }}>0.01%</div>
                    </div>
                  </div>
                </Card>

                {/* Hardware & Sensor Diagnostics */}
                <Card style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: C.navy, display: "flex", alignItems: "center", gap: 8, borderBottom: `1px solid ${C.line}`, paddingBottom: 12 }}>
                    <Activity size={18} /> Hardware & Sensor Diagnostics
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", background: C.greenPale, borderRadius: 8, border: `1px solid ${C.green}` }}>
                      <CheckCircle2 size={16} color={C.green} />
                      <span style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>Tank Sensor A</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", background: C.greenPale, borderRadius: 8, border: `1px solid ${C.green}` }}>
                      <CheckCircle2 size={16} color={C.green} />
                      <span style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>Tank Sensor B</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", background: C.yellowPale, borderRadius: 8, border: `1px solid ${C.yellow}` }}>
                      <AlertTriangle size={16} color={C.yellow} />
                      <span style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>Pump Controller Gateway</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: "auto", background: C.alabaster, padding: 16, borderRadius: 12, border: `1px solid ${C.line}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: C.sub }}>System Uptime</span>
                      <span style={{ fontFamily: "'Courier New', Courier, monospace", fontSize: 13, fontWeight: 800, color: C.ink }}>45 Days, 12 Hrs, 04 Mins</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px dashed ${C.line}`, paddingTop: 12 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: C.sub }}>Firmware Version</span>
                      <span style={{ fontSize: 13, fontWeight: 800, color: C.navy }}>v2.4.1-stable</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 16, marginTop: 12 }}>
                <div style={{ padding: "14px 24px", borderRadius: 12, border: `1px solid ${C.line}`, color: C.ink, fontSize: 14, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, background: "var(--pomo-white)", transition: "background .2s", boxShadow: "0 2px 4px rgba(0,0,0,.02)" }}>
                  <RefreshCw size={18} /> Update System Logs
                </div>
                <div style={{ padding: "14px 32px", borderRadius: 12, background: C.navy, color: "var(--pomo-white)", fontSize: 14, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "background .2s", boxShadow: "0 4px 12px rgba(27,43,72,.2)" }}>
                  <CheckCircle2 size={18} /> Simpan Konfigurasi
                </div>
              </div>
            </div>
          </>
        ) : null}
      </main>

      {/* Right Column: Side Panel */}
      <aside style={{ width: 380, background: "var(--pomo-white)", borderLeft: `1px solid ${C.line}`, padding: 32, overflowY: "auto", display: "flex", flexDirection: "column", gap: 24 }}>
        
        {/* Header Sapaan & Toggle Buka */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: C.alabaster, padding: 20, borderRadius: 20 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.ink }}>Halo, Jojo Sucipto</div>
            <div style={{ fontSize: 13, color: C.sub, marginTop: 4 }}>Shift Pagi • SPBU 34.405.10</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: buka ? C.green : C.red, letterSpacing: 1 }}>
              {buka ? "BUKA" : "TUTUP"}
            </span>
            <div 
              onClick={() => setBuka(!buka)}
              style={{
                width: 64, height: 36, borderRadius: 99, background: buka ? C.green : C.red,
                position: "relative", cursor: "pointer", transition: "background .2s",
                boxShadow: buka ? "0 4px 12px rgba(0,167,143,.3)" : "0 4px 12px rgba(255,59,48,.3)"
              }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: 99, background: "var(--pomo-white)",
                position: "absolute", top: 4, left: buka ? 32 : 4,
                transition: "left .2s", boxShadow: "0 2px 4px rgba(0,0,0,.1)"
              }} />
            </div>
          </div>
        </div>

        {/* Panel Stok BBM */}
        <Card style={{ padding: 24, boxShadow: "none", border: `1px solid ${C.line}` }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.ink, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <Gauge size={20} color={C.navy} /> Panel Stok BBM (IoT)
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 700, color: C.ink, marginBottom: 8 }}>
                <span>Pertalite</span>
                <span style={{ color: C.red }}>15%</span>
              </div>
              <div style={{ height: 16, borderRadius: 99, background: C.alabaster, overflow: "hidden", marginBottom: 8 }}>
                <div style={{ width: "15%", height: "100%", background: C.red, borderRadius: 99 }} />
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 12px", fontSize: 10, fontFamily: "'Courier New', Courier, monospace", color: C.sub, fontWeight: 800 }}>
                <span>Discharge Flow: <span style={{ color: C.ink }}>45 L/min</span></span>
                <span>Tank Temp: <span style={{ color: C.ink }}>28°C</span></span>
                <span>Pressure: <span style={{ color: C.ink }}>110 kPa</span></span>
                <span>Ullage Vol: <span style={{ color: C.ink }}>27.200 L</span></span>
              </div>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 700, color: C.ink, marginBottom: 8 }}>
                <span>Pertamax</span>
                <span style={{ color: C.green }}>80%</span>
              </div>
              <div style={{ height: 16, borderRadius: 99, background: C.alabaster, overflow: "hidden", marginBottom: 8 }}>
                <div style={{ width: "80%", height: "100%", background: C.green, borderRadius: 99 }} />
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 12px", fontSize: 10, fontFamily: "'Courier New', Courier, monospace", color: C.sub, fontWeight: 800 }}>
                <span>Discharge Flow: <span style={{ color: C.ink }}>0 L/min</span></span>
                <span>Tank Temp: <span style={{ color: C.ink }}>27.5°C</span></span>
                <span>Pressure: <span style={{ color: C.ink }}>105 kPa</span></span>
                <span>Ullage Vol: <span style={{ color: C.ink }}>6.400 L</span></span>
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: 24, paddingTop: 16, borderTop: `1px solid ${C.line}` }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.sub, display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
              <CheckCircle2 size={16} color={C.green} /> Terhubung dengan Sensor IoT
            </div>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "12px", borderRadius: 12, border: `1.5px solid ${C.navy}`, color: C.navy,
              fontSize: 14, fontWeight: 800, cursor: "pointer", transition: "all .2s"
            }}>
              <RefreshCw size={16} /> Sinkronisasi
            </div>
          </div>
        </Card>

        {/* Update Fasilitas */}
        <Card style={{ padding: 24, boxShadow: "none", border: `1px solid ${C.line}` }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.ink, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <Settings size={20} color={C.navy} /> Update Fasilitas
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[{ key: "toilet", label: "Toilet" }, { key: "musholla", label: "Musholla" }, { key: "atm", label: "ATM" }].map(f => {
              const on = fasilitas[f.key as keyof typeof fasilitas];
              return (
                <div key={f.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: C.alabaster, borderRadius: 16 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: C.ink }}>{f.label}</span>
                  <div 
                    onClick={() => setFasilitas(prev => ({ ...prev, [f.key]: !on }))}
                    style={{
                      width: 52, height: 28, borderRadius: 99, background: on ? C.green : C.line,
                      position: "relative", cursor: "pointer", transition: "background .2s"
                    }}
                  >
                    <div style={{
                      width: 22, height: 22, borderRadius: 99, background: "var(--pomo-white)",
                      position: "absolute", top: 3, left: on ? 27 : 3,
                      transition: "left .2s", boxShadow: "0 2px 4px rgba(0,0,0,.1)"
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
        
      </aside>
    </div>
  );
}

/* =========================================================
   ROOT
   ========================================================= */
export default function App() {
  const [current, setCurrent] = useState<Screen>("landing");
  const go = (s: Screen) => setCurrent(s);

  if (current === "landing") return <Landing go={go} />;
  if (current === "signin") return <SignIn go={go} />;
  if (current === "register") return <Register go={go} />;
  if (current === "admin") return <AdminPage go={go} />;
  
  return <Dashboard current={current} go={go} />;
}
