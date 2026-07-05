/**
 * Mobile-optimised page views for POMO.
 * Visual tokens are kept identical to App.tsx so both surfaces look the same.
 */
import { useState } from "react";
import {
  ArrowLeft, Fuel, MapPin, Clock, Car, Activity, History,
  Gauge, Filter, Calendar, Navigation, Map as MapIcon,
  ChevronRight, CheckCircle2, X, Bell,
  UserCircle2, Mail, Phone, Settings, HelpCircle,
  Star, LogOut, Radar, Sparkles,
} from "lucide-react";
import { MC, MFONT } from "./MobilePetaView";

/* ── Shared micro-components ─────────────────────────────────────────── */
function MBadge({ color, bg, children }: { color: string; bg: string; children: React.ReactNode }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      background: bg, color, fontSize: 11, fontWeight: 700,
      padding: "4px 10px", borderRadius: 8,
    }}>{children}</span>
  );
}
function MDot({ color }: { color: string }) {
  return <span style={{ width: 7, height: 7, borderRadius: 99, background: color, display: "inline-block" }} />;
}
function MCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: "var(--pomo-white)", borderRadius: 18, padding: 18,
      boxShadow: "0 4px 16px rgba(12,50,74,.07)",
      border: `1px solid ${MC.line}`,
      ...style,
    }}>{children}</div>
  );
}

/* ── Section header ──────────────────────────────────────────────────── */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 700, color: MC.sub, letterSpacing: 1.1, marginBottom: 10 }}>
      {children}
    </div>
  );
}

/* ── Top App Bar ─────────────────────────────────────────────────────── */
export function MobileTopBar({
  title, subtitle, onBack,
}: {
  title: string; subtitle: string; onBack: () => void;
}) {
  return (
    <div style={{
      height: 64, flexShrink: 0,
      display: "flex", alignItems: "center",
      padding: "0 16px 0 4px",
      background: `linear-gradient(135deg, ${MC.navy}, ${MC.navyDeep})`,
      color: "var(--pomo-white)", fontFamily: MFONT,
    }}>
      <button onClick={onBack} style={{
        width: 48, height: 48, borderRadius: 24,
        border: "none", background: "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", color: "var(--pomo-white)",
      }}>
        <ArrowLeft size={22} />
      </button>
      <div style={{ flex: 1, paddingLeft: 4 }}>
        <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: .2 }}>{title}</div>
        <div style={{ fontSize: 10.5, opacity: .78, marginTop: 1 }}>{subtitle}</div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   MOBILE HISTORI
   ───────────────────────────────────────────────────────────────────── */
const VISITS = [
  { spbu: "34.405.02", addr: "Jl. Raya Barat Cimahi",          last: "Hari ini · 14:22", q: 4,  qStat: "Sepi",   stock: "Tersedia",  open: true  },
  { spbu: "34.405.05", addr: "Jl. Raya Gadobangkong",          last: "Hari ini · 09:11", q: 8,  qStat: "Sepi",   stock: "Tersedia",  open: true  },
  { spbu: "34.405.18", addr: "Jl. Cihanjuang Km. 07",          last: "Kemarin · 18:40",  q: 12, qStat: "Sedang", stock: "Menipis",   open: true  },
  { spbu: "34.405.10", addr: "Interchange Tol Baros",           last: "2 hari lalu",      q: 18, qStat: "Ramai",  stock: "Tersedia",  open: true  },
  { spbu: "34.405.20", addr: "Jl. Raya Barat Cimahi No. 689",  last: "3 hari lalu",      q: 6,  qStat: "Sepi",   stock: "Tersedia",  open: true  },
  { spbu: "34.405.11", addr: "Jl. Leuwi Gajah",                last: "5 hari lalu",      q: 0,  qStat: "Tutup",  stock: "Habis",     open: false },
  { spbu: "34.405.27", addr: "Tol Purbaleunyi Km. 125",        last: "1 minggu lalu",    q: 14, qStat: "Sedang", stock: "Tersedia",  open: true  },
];

function qBadgeColor(q: number, stat: string) {
  if (stat === "Tutup") return { c: MC.red,    bg: MC.redPale    };
  if (q <= 9)           return { c: MC.green,  bg: MC.greenPale  };
  if (q <= 15)          return { c: MC.yellow, bg: MC.yellowPale };
  return                       { c: MC.orange, bg: MC.orangePale };
}

export function MobileHistoriView({
  onBack, openMap, newSavedSpbu,
}: {
  onBack: () => void;
  openMap: () => void;
  newSavedSpbu?: string | null;   // l-code dari SPBU yang baru disimpan
}) {
  // Jika ada SPBU baru disimpan, tampilkan di paling atas
  const savedEntry = newSavedSpbu
    ? VISITS.find(v => v.spbu === newSavedSpbu) ?? null
    : null;
  const list = savedEntry
    ? [{ ...savedEntry, last: "Baru saja · " + new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }), isNew: true },
       ...VISITS.filter(v => v.spbu !== newSavedSpbu)]
    : VISITS.map(v => ({ ...v, isNew: false }));

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 30, background: MC.bg, display: "flex", flexDirection: "column", fontFamily: MFONT }}>
      <MobileTopBar
        title="Histori Kunjungan"
        subtitle="SPBU yang pernah Anda kunjungi atau pilih rutenya"
        onBack={onBack}
      />

      {/* Filter bar */}
      <div style={{ display: "flex", gap: 8, padding: "10px 16px 8px", background: MC.bg }}>
        <button style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "7px 14px", borderRadius: 10,
          background: "var(--pomo-white)", border: `1px solid ${MC.line}`,
          fontSize: 12, fontWeight: 700, color: MC.ink, cursor: "pointer",
        }}>
          <Filter size={13} />Filter
        </button>
        <button style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "7px 14px", borderRadius: 10,
          background: "var(--pomo-white)", border: `1px solid ${MC.line}`,
          fontSize: 12, fontWeight: 700, color: MC.ink, cursor: "pointer",
        }}>
          <Calendar size={13} />Periode
        </button>
      </div>

      {/* List */}
      <div className="pomo-scroll-hidden" style={{ flex: 1, overflowY: "auto", padding: "0 16px 24px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {list.map((v: any) => {
            const qb = qBadgeColor(v.q, v.qStat);
            const sc = v.stock === "Tersedia" ? MC.green : v.stock === "Menipis" ? MC.orange : MC.red;
            const scBg = v.stock === "Tersedia" ? MC.greenPale : v.stock === "Menipis" ? MC.orangePale : MC.redPale;
            return (
              <MCard key={v.spbu} style={{
                padding: 16,
                border: v.isNew ? `1.5px solid ${MC.green}` : `1px solid ${MC.line}`,
                background: v.isNew ? `linear-gradient(135deg, ${MC.greenPale}55, var(--pomo-white))` : "var(--pomo-white)",
              }}>
                {/* "Baru Disimpan" indicator */}
                {v.isNew && (
                  <div style={{
                    display: "flex", alignItems: "center", gap: 6,
                    fontSize: 11, fontWeight: 700, color: MC.green,
                    marginBottom: 10,
                    padding: "5px 10px", borderRadius: 8,
                    background: MC.greenPale,
                    width: "fit-content",
                  }}>
                    <CheckCircle2 size={12} />Baru Disimpan
                  </div>
                )}
                {/* Header row */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                    background: MC.bluePale, color: MC.navy,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}><MapPin size={20} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: MC.ink }}>SPBU {v.spbu}</div>
                    <div style={{ fontSize: 11.5, color: MC.sub, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.addr}</div>
                    <div style={{ fontSize: 11, color: MC.sub, marginTop: 4, display: "flex", alignItems: "center", gap: 5 }}>
                      <Clock size={10} />Terakhir: <b style={{ color: MC.ink }}>{v.last}</b>
                    </div>
                  </div>
                </div>
                {/* Status badges */}
                <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
                  <MBadge color={qb.c} bg={qb.bg}><Car size={10} />Antrean {v.q} · {v.qStat}</MBadge>
                  <MBadge color={sc} bg={scBg}><Fuel size={10} />Stok {v.stock}</MBadge>
                  <MBadge color={v.open ? MC.green : MC.red} bg={v.open ? MC.greenPale : MC.redPale}>
                    <MDot color={v.open ? MC.green : MC.red} />{v.open ? "Buka" : "Tutup"}
                  </MBadge>
                </div>
                {/* Actions */}
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <button onClick={openMap} style={{
                    flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    padding: "10px 0", borderRadius: 10,
                    background: `linear-gradient(135deg, ${MC.navy}, ${MC.blue})`,
                    color: "var(--pomo-white)", border: "none", cursor: "pointer",
                    fontSize: 12, fontWeight: 800,
                    boxShadow: `0 6px 14px ${MC.navy}30`,
                  }}>
                    <MapIcon size={13} />Buka di Peta
                  </button>
                  <button onClick={openMap} style={{
                    flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    padding: "10px 0", borderRadius: 10,
                    background: "var(--pomo-white)", color: MC.navy,
                    border: `1.5px solid ${MC.navy}`, cursor: "pointer",
                    fontSize: 12, fontWeight: 700,
                  }}>
                    <ChevronRight size={13} />Lihat Lagi
                  </button>
                </div>
              </MCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   MOBILE CEK STOK BBM
   ───────────────────────────────────────────────────────────────────── */
const FUELS = [
  { name: "Solar Subsidi",     price: 6800,  color: MC.green,    category: "Diesel · Subsidi"  },
  { name: "Pertalite",         price: 10000, color: MC.green,    category: "Gasoline · RON 90" },
  { name: "Pertamax",          price: 12300, color: MC.softBlue, category: "Gasoline · RON 92" },
  { name: "Pertamax Green 95", price: 12900, color: MC.green,    category: "Gasoline · RON 95" },
  { name: "Pertamax Turbo",    price: 20750, color: MC.red,      category: "Gasoline · RON 98" },
  { name: "Dexlite",           price: 23000, color: MC.orange,   category: "Diesel · CN 51"    },
  { name: "Pertamina Dex",     price: 24800, color: MC.maroon,   category: "Diesel · CN 53"    },
];
const rp = (n: number) => "Rp" + n.toLocaleString("id-ID");

const STATIONS = [
  { spbu: "34.405.02", addr: "Jl. Raya Barat Cimahi",          area: "Cimahi",        dist: "1.2 km", q: 4,  stock: "Tersedia", open: true,  pct: 82 },
  { spbu: "34.405.05", addr: "Jl. Raya Gadobangkong",          area: "Bandung Barat", dist: "2.4 km", q: 7,  stock: "Tersedia", open: true,  pct: 71 },
  { spbu: "34.405.18", addr: "Jl. Cihanjuang Km. 07",          area: "Cimahi",        dist: "2.8 km", q: 12, stock: "Menipis",  open: true,  pct: 28 },
  { spbu: "34.405.10", addr: "Interchange Tol Baros",           area: "Cimahi",        dist: "3.6 km", q: 18, stock: "Tersedia", open: true,  pct: 64 },
  { spbu: "34.405.20", addr: "Jl. Raya Barat Cimahi No. 689",  area: "Cimahi",        dist: "4.1 km", q: 9,  stock: "Tersedia", open: true,  pct: 90 },
  { spbu: "34.405.11", addr: "Jl. Leuwi Gajah",                area: "Cimahi",        dist: "5.0 km", q: 0,  stock: "Habis",    open: false, pct: 5  },
];

export function MobileBayarView({ onBack, openMap }: { onBack: () => void; openMap: () => void }) {
  const [fuelIdx, setFuelIdx] = useState(1);
  const [area,    setArea   ] = useState(0);
  const areas = ["Semua", "Cimahi", "Bandung Barat", "Padalarang"];

  const filtered = area === 0 ? STATIONS : STATIONS.filter(s => s.area === areas[area]);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 30, background: MC.bg, display: "flex", flexDirection: "column", fontFamily: MFONT }}>
      <MobileTopBar
        title="Cek Stok BBM"
        subtitle="Pilih jenis BBM dan temukan SPBU terdekat"
        onBack={onBack}
      />

      <div className="pomo-scroll-hidden" style={{ flex: 1, overflowY: "auto", padding: "12px 16px 24px" }}>
        {/* Fuel type picker */}
        <MCard style={{ marginBottom: 12 }}>
          <SectionTitle>JENIS BBM</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
            {FUELS.map((f, i) => (
              <div key={f.name} onClick={() => setFuelIdx(i)} style={{
                padding: "12px 12px", borderRadius: 12, cursor: "pointer",
                border: `1.5px solid ${i === fuelIdx ? MC.navy : MC.line}`,
                background: i === fuelIdx ? MC.bluePale : "var(--pomo-white)",
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                  background: f.color + "22", color: f.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}><Fuel size={15} /></div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: MC.ink, lineHeight: 1.3 }}>{f.name}</div>
                  <div style={{ fontSize: 10.5, color: MC.sub, marginTop: 1 }}>{rp(f.price)}/L</div>
                </div>
              </div>
            ))}
          </div>
        </MCard>

        {/* Area chips */}
        <div style={{ display: "flex", gap: 8, marginBottom: 12, overflowX: "auto", scrollbarWidth: "none" } as React.CSSProperties}>
          {areas.map((a, i) => (
            <button key={a} onClick={() => setArea(i)} style={{
              flexShrink: 0, height: 34, padding: "0 16px", borderRadius: 99,
              border: i === area ? "none" : `1px solid ${MC.line}`,
              background: i === area ? MC.navy : "var(--pomo-white)",
              color: i === area ? "var(--pomo-white)" : MC.ink,
              fontSize: 12.5, fontWeight: 700, cursor: "pointer",
              boxShadow: i === area ? `0 4px 12px ${MC.navy}30` : "none",
              fontFamily: MFONT,
            }}>{a}</button>
          ))}
        </div>

        {/* SPBU list */}
        <MCard>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: MC.ink }}>
              SPBU · <span style={{ color: MC.navy }}>{FUELS[fuelIdx].name}</span>
            </div>
            <MBadge color={MC.green} bg={MC.greenPale}><MDot color={MC.green} />Live</MBadge>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map((s) => {
              const sc = s.stock === "Tersedia" ? MC.green : s.stock === "Menipis" ? MC.orange : MC.red;
              const scBg = s.stock === "Tersedia" ? MC.greenPale : s.stock === "Menipis" ? MC.orangePale : MC.redPale;
              const qc = !s.open ? MC.red : s.q <= 9 ? MC.green : s.q <= 15 ? MC.yellow : MC.orange;
              const qBg = !s.open ? MC.redPale : s.q <= 9 ? MC.greenPale : s.q <= 15 ? MC.yellowPale : MC.orangePale;
              const qLab = !s.open ? "Tutup" : s.q <= 9 ? `Antrean ${s.q} · Sepi` : s.q <= 15 ? `Antrean ${s.q} · Sedang` : `Antrean ${s.q} · Ramai`;
              return (
                <div key={s.spbu} style={{
                  padding: 14, borderRadius: 14, border: `1px solid ${MC.line}`,
                  background: "#FAFAFA",
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                      background: MC.bluePale, color: MC.navy,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}><Fuel size={18} /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: MC.ink }}>SPBU {s.spbu}</div>
                      <div style={{ fontSize: 11, color: MC.sub, marginTop: 1 }}>{s.addr}</div>
                      <div style={{ display: "flex", gap: 5, alignItems: "center", marginTop: 4, fontSize: 11, color: MC.sub }}>
                        <MapPin size={10} />{s.dist}
                        <span>·</span>
                        <Clock size={10} />{s.open ? "Buka 24 Jam" : "Tutup"}
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div style={{ marginTop: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: MC.sub, marginBottom: 4 }}>
                      <span>Stok {s.stock}</span><span>{s.pct}%</span>
                    </div>
                    <div style={{ height: 6, background: MC.alabaster, borderRadius: 99, overflow: "hidden" }}>
                      <div style={{
                        width: `${s.pct}%`, height: "100%",
                        background: s.pct < 30 ? MC.orange : s.pct < 60 ? MC.yellow : MC.green,
                        borderRadius: 99,
                      }} />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
                    <MBadge color={sc} bg={scBg}><Gauge size={10} />Stok {s.stock}</MBadge>
                    <MBadge color={qc} bg={qBg}><Car size={10} />{qLab}</MBadge>
                  </div>

                  <button onClick={openMap} style={{
                    marginTop: 10, width: "100%",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    padding: "9px 0", borderRadius: 10,
                    background: `linear-gradient(135deg, ${MC.navy}, ${MC.blue})`,
                    color: "var(--pomo-white)", border: "none", cursor: "pointer",
                    fontSize: 12, fontWeight: 800,
                    boxShadow: `0 6px 14px ${MC.navy}30`,
                  }}>
                    <MapIcon size={13} />Lihat di Peta
                  </button>
                </div>
              );
            })}
          </div>
        </MCard>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   MOBILE UPDATE KONDISI
   ───────────────────────────────────────────────────────────────────── */
const NOTIFS = [
  { cat: "Stok BBM",   spbu: "34.405.02", addr: "Jl. Raya Barat Cimahi",     t: "Pertalite & Pertamax stok aman",        d: "Stok Pertalite 82%, Pertamax 74%. Aman.",          time: "Baru saja",    level: "aman"   as const, ic: <Fuel size={16} />        },
  { cat: "Antrean",    spbu: "34.405.10", addr: "Interchange Tol Baros",      t: "Antrean ramai terdeteksi",              d: "18 kendaraan. Estimasi ±25 mnt.",                  time: "5 mnt lalu",   level: "bahaya" as const, ic: <Car size={16} />         },
  { cat: "Stok BBM",   spbu: "34.405.18", addr: "Jl. Cihanjuang Km. 07",      t: "Stok Pertalite menipis",                d: "Sisa 22%. Habis dalam ±30 mnt.",                   time: "12 mnt lalu",  level: "sedang" as const, ic: <Gauge size={16} />       },
  { cat: "Operasional",spbu: "34.405.11", addr: "Jl. Leuwi Gajah",            t: "SPBU sedang tutup",                     d: "Pemeliharaan sampai pukul 16:00.",                 time: "1 jam lalu",   level: "bahaya" as const, ic: <X size={16} />           },
  { cat: "Kondisi",    spbu: "34.405.05", addr: "Jl. Raya Gadobangkong",       t: "Kondisi sepi · cocok untuk isi cepat", d: "Antrean 3 kendaraan. Semua BBM tersedia.",         time: "1 jam lalu",   level: "aman"   as const, ic: <CheckCircle2 size={16} /> },
  { cat: "Antrean",    spbu: "34.405.13", addr: "Jl. Raya Caringin",           t: "Antrean sedang meningkat",              d: "14 kendaraan, tren naik.",                         time: "2 jam lalu",   level: "sedang" as const, ic: <Activity size={16} />    },
];

type Level = "aman" | "sedang" | "bahaya";
function notifMeta(l: Level) {
  if (l === "aman")   return { c: MC.green,  bg: MC.greenPale,  label: "Aman"   };
  if (l === "sedang") return { c: MC.yellow, bg: MC.yellowPale, label: "Sedang" };
  return                     { c: MC.red,    bg: MC.redPale,    label: "Bahaya" };
}

export function MobileNotifView({ onBack }: { onBack: () => void }) {
  const summary = [
    { l: "Aman",   c: MC.green,  n: NOTIFS.filter(i => i.level === "aman").length   },
    { l: "Sedang", c: MC.yellow, n: NOTIFS.filter(i => i.level === "sedang").length },
    { l: "Bahaya", c: MC.red,    n: NOTIFS.filter(i => i.level === "bahaya").length },
  ];
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 30, background: MC.bg, display: "flex", flexDirection: "column", fontFamily: MFONT }}>
      <MobileTopBar
        title="Update Kondisi SPBU"
        subtitle="Status real-time stok, antrean & operasional"
        onBack={onBack}
      />

      <div className="pomo-scroll-hidden" style={{ flex: 1, overflowY: "auto", padding: "12px 16px 24px" }}>
        {/* Summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 14 }}>
          {summary.map(s => (
            <MCard key={s.l} style={{ padding: 14, textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: s.c }}>{s.n}</div>
              <div style={{ fontSize: 10, color: MC.sub, marginTop: 2 }}>{s.l}</div>
            </MCard>
          ))}
        </div>

        {/* Notification list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {NOTIFS.map((n, i) => {
            const m = notifMeta(n.level);
            return (
              <div key={i} style={{
                background: "var(--pomo-white)", borderRadius: 16,
                border: `1px solid ${MC.line}`,
                borderLeft: `4px solid ${m.c}`,
                padding: 14,
                boxShadow: "0 2px 8px rgba(12,50,74,.05)",
                display: "flex", gap: 12, alignItems: "flex-start",
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                  background: m.bg, color: m.c,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{n.ic}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <div>
                      <MBadge color={m.c} bg={m.bg}><MDot color={m.c} />{n.cat}</MBadge>
                      <span style={{ marginLeft: 6, fontSize: 12, fontWeight: 800, color: MC.navy }}>SPBU {n.spbu}</span>
                    </div>
                    <span style={{ fontSize: 10, color: MC.sub, flexShrink: 0, marginTop: 1 }}>{n.time}</span>
                  </div>
                  <div style={{ fontSize: 12.5, fontWeight: 800, color: MC.ink, marginTop: 6 }}>{n.t}</div>
                  <div style={{ fontSize: 11.5, color: MC.sub, marginTop: 3, lineHeight: 1.5 }}>{n.d}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   MOBILE PROFIL
   ───────────────────────────────────────────────────────────────────── */
export function MobileProfilView({
  onBack, askLogout,
}: {
  onBack: () => void;
  askLogout: () => void;
}) {
  const stats = [
    { label: "Transaksi", v: "47" },
    { label: "BBM Terisi", v: "284 L" },
  ];
  const infoRows = [
    { l: "Nama Lengkap",  v: "Budi Hartono",             i: <UserCircle2 size={14} /> },
    { l: "Email",          v: "budi.hartono@email.com",   i: <Mail size={14} /> },
    { l: "No. Telepon",   v: "+62 812-3456-7890",         i: <Phone size={14} /> },
    { l: "Kota",           v: "Cimahi, Jawa Barat",       i: <MapPin size={14} /> },
  ];
  const prefRows = [
    { l: "Notifikasi AI Smart Alert", i: <Bell size={14} />,       on: true  },
    { l: "Lokasi & Rekomendasi",      i: <MapPin size={14} />,     on: true  },
    { l: "Mode Hemat BBM",            i: <Fuel size={14} />,       on: false },
    { l: "Bantuan & Layanan",         i: <HelpCircle size={14} />, link: true },
    { l: "Pengaturan Akun",           i: <Settings size={14} />,   link: true },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 30, background: MC.bg, display: "flex", flexDirection: "column", fontFamily: MFONT }}>
      <MobileTopBar title="Profil" subtitle="Akun, preferensi, dan pengaturan" onBack={onBack} />

      <div className="pomo-scroll-hidden" style={{ flex: 1, overflowY: "auto", padding: "16px 16px 32px" }}>
        {/* Avatar card */}
        <MCard style={{ textAlign: "center", marginBottom: 12 }}>
          <div style={{
            width: 80, height: 80, borderRadius: 99, margin: "0 auto",
            background: `linear-gradient(135deg, ${MC.navy}, ${MC.blue})`,
            color: "var(--pomo-white)", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, fontWeight: 800,
            boxShadow: `0 10px 24px ${MC.navy}40`,
          }}>BH</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: MC.ink, marginTop: 12 }}>Budi Hartono</div>
          <div style={{ fontSize: 12, color: MC.sub, marginTop: 3 }}>budi.hartono@email.com</div>
          <div style={{ marginTop: 8 }}>
            <MBadge color={MC.green} bg={MC.greenPale}><Star size={10} />POMO Member · Gold</MBadge>
          </div>
          {/* Stats */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(2,1fr)",
            gap: 8, marginTop: 16, paddingTop: 14,
            borderTop: `1px solid ${MC.line}`,
          }}>
            {stats.map(s => (
              <div key={s.label}>
                <div style={{ fontSize: 18, fontWeight: 800, color: MC.ink }}>{s.v}</div>
                <div style={{ fontSize: 10, color: MC.sub, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <button style={{
            marginTop: 14, width: "100%", padding: "11px 0", borderRadius: 10,
            background: `linear-gradient(135deg, ${MC.navy}, ${MC.blue})`,
            color: "var(--pomo-white)", border: "none", cursor: "pointer",
            fontSize: 13, fontWeight: 800,
            boxShadow: `0 6px 14px ${MC.navy}30`,
          }}>Edit Profil</button>
        </MCard>

        {/* AI hint */}
        <div style={{
          display: "flex", alignItems: "flex-start", gap: 10, padding: 14,
          borderRadius: 14, marginBottom: 12,
          background: `linear-gradient(135deg, ${MC.navy}F2, ${MC.blue})`,
          color: "var(--pomo-white)",
        }}>
          <Sparkles size={18} color={MC.lightBlue} style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 700 }}>AI Smart Alert</div>
            <div style={{ fontSize: 11, opacity: .82, lineHeight: 1.55, marginTop: 3 }}>
              POMO memprediksi stok SPBU dan menyarankan rute optimal otomatis.
            </div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
            <Radar size={20} color={MC.lightBlue} />
          </div>
        </div>

        {/* Info akun */}
        <MCard style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: MC.ink, marginBottom: 10 }}>Informasi Akun</div>
          {infoRows.map(r => (
            <div key={r.l} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "11px 0", borderBottom: `1px solid ${MC.line}`,
            }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8, color: MC.sub, fontSize: 12 }}>
                <span style={{ color: MC.navy }}>{r.i}</span>{r.l}
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, color: MC.ink }}>{r.v}</span>
            </div>
          ))}
        </MCard>

        {/* Preferensi */}
        <MCard style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: MC.ink, marginBottom: 10 }}>Preferensi & Pengaturan</div>
          {prefRows.map((r: any) => (
            <div key={r.l} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "12px 0", borderBottom: `1px solid ${MC.line}`,
            }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: MC.ink, fontWeight: 600 }}>
                <span style={{ color: MC.navy }}>{r.i}</span>{r.l}
              </span>
              {r.link
                ? <ChevronRight size={14} color={MC.sub} />
                : <div style={{ width: 36, height: 20, borderRadius: 99, background: r.on ? MC.green : MC.line, position: "relative" }}>
                    <div style={{ position: "absolute", top: 2, left: r.on ? 18 : 2, width: 16, height: 16, borderRadius: 99, background: "var(--pomo-white)" }} />
                  </div>
              }
            </div>
          ))}
        </MCard>

        {/* Riwayat Ulasan */}
        <MCard style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: MC.ink, marginBottom: 12 }}>Riwayat Ulasan</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { spbu: "SPBU Pertamina Pasteur", date: "24 Jun 2026", rating: 5, comment: "Toilet sangat bersih dan antrean tidak terlalu panjang saat malam hari." },
              { spbu: "SPBU Pertamina Cibeureum", date: "15 Jun 2026", rating: 4, comment: "Pelayanan cepat, tapi sayang stok Pertamax Turbo sedang kosong." },
            ].map((u, i) => (
              <div key={i} style={{
                paddingBottom: i === 1 ? 0 : 12,
                borderBottom: i === 1 ? "none" : `1px solid ${MC.line}`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: MC.navy }}>{u.spbu}</div>
                    <div style={{ fontSize: 10, color: MC.sub, marginTop: 2 }}>{u.date}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 800, color: MC.ink }}>
                    <Star size={12} fill="#FFD700" color="#FFD700" /> {u.rating}
                  </div>
                </div>
                <div style={{ fontSize: 11.5, color: MC.sub, lineHeight: 1.5 }}>
                  {u.comment}
                </div>
              </div>
            ))}
          </div>
        </MCard>

        {/* Logout */}
        <MCard style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: `linear-gradient(135deg, ${MC.cream}, var(--pomo-white))` }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: MC.ink }}>Keluar dari akun</div>
            <div style={{ fontSize: 11, color: MC.sub, marginTop: 3 }}>Pastikan aktivitas sudah selesai.</div>
          </div>
          <button onClick={askLogout} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "10px 16px", borderRadius: 10,
            background: `linear-gradient(135deg, ${MC.maroon}, ${MC.red})`,
            color: "var(--pomo-white)", border: "none", cursor: "pointer",
            fontSize: 12, fontWeight: 800,
            boxShadow: `0 8px 18px ${MC.red}40`,
          }}>
            <LogOut size={13} />Logout
          </button>
        </MCard>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   MOBILE MENU HOME (main menu screen)
   ───────────────────────────────────────────────────────────────────── */
export function MobileMenuHome({
  onNavigate,
  onNotif,
}: {
  onNavigate: (id: string) => void;
  onNotif: () => void;
}) {
  const menuItems = [
    { id: "peta",    icon: <MapIcon size={22} />,    label: "Peta SPBU",         sub: "Pantau lokasi & antrean"       },
    { id: "bayar",   icon: <Fuel size={22} />,       label: "Cek Stok BBM",      sub: "Harga & ketersediaan BBM"      },
    { id: "histori", icon: <History size={22} />,    label: "Histori Kunjungan", sub: "SPBU yang pernah dikunjungi"   },
    { id: "notif",   icon: <Activity size={22} />,   label: "Update Kondisi",    sub: "Alert stok & antrean"          },
    { id: "profil",  icon: <UserCircle2 size={22} />,label: "Profil",            sub: "Akun & pengaturan"             },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100dvh", background: MC.bg, fontFamily: MFONT }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${MC.navy}, ${MC.navyDeep})`,
        color: "var(--pomo-white)", padding: "20px 20px 0",
      }}>
        {/* Top row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 11,
              background: "rgba(255,255,255,.15)",
              border: "1px solid rgba(255,255,255,.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative",
            }}>
              <Fuel size={19} />
              <div style={{ position: "absolute", top: -3, right: -3, padding: 3, borderRadius: 99, background: MC.green }}>
                <Radar size={7} color="var(--pomo-white)" />
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: 1.5 }}>POMO</div>
              <div style={{ fontSize: 9, opacity: .7, letterSpacing: 1.6 }}>POM · MONITOR</div>
            </div>
          </div>
          <button onClick={onNotif} style={{
            width: 40, height: 40, borderRadius: 10,
            background: "rgba(255,255,255,.12)",
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", color: "var(--pomo-white)",
          }}>
            <Bell size={18} />
            <span style={{
              position: "absolute", top: 8, right: 9, width: 7, height: 7,
              borderRadius: 99, background: MC.red, border: `2px solid ${MC.navyDeep}`,
            }} />
          </button>
        </div>

        {/* Greeting */}
        <div style={{ paddingBottom: 20 }}>
          <div style={{ fontSize: 11, opacity: .7, fontWeight: 700, letterSpacing: 1.1, marginBottom: 4 }}>HALO, BUDI HARTONO</div>
          <div style={{ fontSize: 19, fontWeight: 800, lineHeight: 1.3 }}>Pilih menu untuk mulai pantau SPBU</div>
        </div>

        {/* AI Smart Alert chip */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "10px 14px", borderRadius: 12,
          background: "rgba(255,255,255,.1)",
          border: "1px solid rgba(255,255,255,.18)",
          marginBottom: 20,
        }}>
          <Sparkles size={15} color={MC.lightBlue} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700 }}>AI Smart Alert aktif</div>
            <div style={{ fontSize: 10, opacity: .75, marginTop: 1 }}>Stok SPBU diprediksi otomatis</div>
          </div>
          <div style={{ width: 7, height: 7, borderRadius: 99, background: MC.green }} />
        </div>
      </div>

      {/* Menu grid */}
      <div style={{ padding: "16px 16px 32px", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
        {menuItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              background: "var(--pomo-white)", borderRadius: 18, padding: 18,
              border: `1px solid ${MC.line}`,
              boxShadow: "0 4px 14px rgba(12,50,74,.07)",
              cursor: "pointer", minHeight: 100,
              display: "flex", flexDirection: "column", justifyContent: "space-between",
              transition: "transform .12s",
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: MC.bluePale, color: MC.navy,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{item.icon}</div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 800, color: MC.ink, marginBottom: 3 }}>{item.label}</div>
              <div style={{ fontSize: 11, color: MC.sub, lineHeight: 1.4 }}>{item.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
