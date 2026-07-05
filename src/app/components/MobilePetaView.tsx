import { useState, useRef } from "react";
import {
  Search, Navigation, Car, Fuel, ArrowLeft,
  ChevronRight, MapPin, Gauge, Plus, Minus,
  Coffee, Bath, ShoppingBag, CreditCard, Wind, Droplets,
  History, Star, CheckCircle, Check, MessageSquare, User, Trash2, X, Moon
} from "lucide-react";
import { addReviewHistory, formatReviewDate, removeReviewHistory } from "../reviewHistory";

/* ── Token identik dengan App.tsx ─────────────────────────────────── */
export const MC = {
  navy: "var(--pomo-navy)", navyDeep: "var(--pomo-navy-deep)", blue: "var(--pomo-blue)",
  softBlue: "var(--pomo-soft-blue)", lightBlue: "var(--pomo-light-blue)", bluePale: "var(--pomo-blue-pale)",
  alabaster: "var(--pomo-alabaster)", cream: "var(--pomo-cream)",
  maroon: "var(--pomo-maroon)", red: "var(--pomo-red)", redPale: "var(--pomo-red-pale)",
  green: "var(--pomo-green)", greenPale: "var(--pomo-green-pale)",
  yellow: "var(--pomo-yellow)", yellowPale: "var(--pomo-yellow-pale)",
  orange: "var(--pomo-orange)", orangePale: "var(--pomo-orange-pale)",
  ink: "var(--pomo-ink)", sub: "var(--pomo-sub)", line: "var(--pomo-line)", bg: "var(--pomo-bg)",
};
export const MFONT = "Montserrat, ui-sans-serif, system-ui";
const rp = (n: number) => "Rp" + n.toLocaleString("id-ID");

/* ── Coordinate space: 400 × 700 (matches mobile portrait ratio) ── */
// All x coords = original_x * (400/1100) ≈ *0.364
// y coords unchanged
const MAP_W = 400, MAP_H = 700;
const USER_X = 80, USER_Y = 320;

export type Pin = {
  x: number; y: number; q: number; l: string; addr: string;
  stock: string; open: boolean; fuel: string; fasilitas: string[];
};

export const PINS: Pin[] = [
  { x: 29,  y: 130, q: 4,  l: "34.405.02", addr: "Jl. Raya Barat Cimahi",         stock: "Tersedia", open: true,  fuel: "Pertalite, Pertamax", fasilitas: ["Toilet", "Musholla", "ATM", "Kafe"] },
  { x: 95,  y: 220, q: 12, l: "34.405.10", addr: "Interchange Tol Baros",          stock: "Tersedia", open: true,  fuel: "Pertalite, Pertamax, Dex", fasilitas: ["Toilet", "Musholla", "ATM"] },
  { x: 55,  y: 430, q: 18, l: "34.405.18", addr: "Jl. Cihanjuang Km. 07",          stock: "Menipis",  open: true,  fuel: "Pertalite, Turbo", fasilitas: ["Toilet", "Musholla", "Tambal Ban"] },
  { x: 138, y: 140, q: 7,  l: "34.405.05", addr: "Jl. Raya Gadobangkong",          stock: "Tersedia", open: true,  fuel: "Pertalite, Dexlite", fasilitas: ["Toilet", "Kafe"] },
  { x: 167, y: 380, q: 13, l: "34.405.20", addr: "Jl. Raya Barat Cimahi No. 689", stock: "Tersedia", open: true,  fuel: "Pertalite, Pertamax", fasilitas: ["Toilet", "Musholla", "ATM", "Tambal Ban"] },
  { x: 238, y: 200, q: 5,  l: "34.405.11", addr: "Jl. Leuwi Gajah",               stock: "Tersedia", open: true,  fuel: "Pertalite, Solar", fasilitas: ["Toilet"] },
  { x: 255, y: 500, q: 19, l: "34.405.13", addr: "Caringin Padalarang",            stock: "Menipis",  open: true,  fuel: "Pertalite, Pertamax", fasilitas: ["Toilet", "Musholla", "Kafe"] },
  { x: 298, y: 160, q: 11, l: "34.405.17", addr: "Encep Kartawiria Citeureup",     stock: "Tersedia", open: true,  fuel: "Pertalite, Pertamax", fasilitas: ["Toilet", "Musholla", "ATM"] },
  { x: 335, y: 420, q: 3,  l: "34.405.19", addr: "Jl. Jend. H. Amir Mahmud",      stock: "Tersedia", open: true,  fuel: "Pertalite, Pertamax, Turbo", fasilitas: ["Toilet", "Musholla", "Kafe", "Tambal Ban"] },
  { x: 124, y: 540, q: 6,  l: "34.405.21", addr: "Jl. Raya Barat Cimahi No. 560", stock: "Tersedia", open: true,  fuel: "Pertalite, Pertamax", fasilitas: ["Toilet", "Musholla", "ATM"] },
  { x: 204, y: 560, q: 22, l: "34.405.22", addr: "Jl. Raya Baros No. E 47",       stock: "Menipis",  open: true,  fuel: "Pertalite, Dexlite", fasilitas: ["Toilet", "Tambal Ban"] },
  { x: 276, y: 340, q: 8,  l: "34.405.24", addr: "Jl. Raya Sangkuriang No. 45",   stock: "Tersedia", open: true,  fuel: "Pertalite, Pertamax", fasilitas: ["Toilet", "Musholla", "Kafe"] },
  { x: 382, y: 540, q: 14, l: "34.405.27", addr: "Tol Purbaleunyi Km. 125",       stock: "Tersedia", open: true,  fuel: "Pertamax, Dexlite", fasilitas: ["Toilet", "Musholla", "ATM", "Kafe", "Tambal Ban"] },
];

const FUELS_ALL = [
  { name: "Solar Subsidi",     price: 6800,  color: MC.green    },
  { name: "Pertalite",         price: 10000, color: MC.green    },
  { name: "Pertamax",          price: 12300, color: MC.softBlue },
  { name: "Pertamax Green 95", price: 12900, color: MC.green    },
  { name: "Pertamax Turbo",    price: 20750, color: MC.red      },
  { name: "Dexlite",           price: 23000, color: MC.orange   },
  { name: "Pertamina Dex",     price: 24800, color: MC.maroon   },
];

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

export const qColor = (q: number) => q <= 9 ? MC.green : q <= 15 ? MC.yellow : MC.orange;
export const qLabel = (q: number) => q <= 9 ? "Sepi"  : q <= 15 ? "Sedang" : "Ramai";
const pixDist = (p: Pin) => Math.hypot(p.x - USER_X, p.y - USER_Y);
const kmOf    = (p: Pin) => +(pixDist(p) / 29).toFixed(1); // scaled: 80/1100*400≈29px/km
const etaOf   = (p: Pin) => Math.max(2, Math.round(kmOf(p) * 2.4));
export const sortedByDist = () => [...PINS].sort((a, b) => pixDist(a) - pixDist(b));

/* ── Micro helpers ───────────────────────────────────────────────── */
function Chip({ color, bg, children }: { color: string; bg: string; children: React.ReactNode }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      background: bg, color, fontSize: 11, fontWeight: 700,
      padding: "4px 10px", borderRadius: 8,
    }}>{children}</span>
  );
}
function Dot({ color }: { color: string }) {
  return <span style={{ width: 7, height: 7, borderRadius: 99, background: color, display: "inline-block" }} />;
}

/* ── SVG map with all elements inside same coordinate space ──────── */
function MapSVG({
  pins, onPin, viewBox, nearestPin
}: {
  pins: Pin[];
  onPin: (p: Pin) => void;
  viewBox: string;
  nearestPin?: Pin | null;
}) {
  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <defs>
        <linearGradient id="mbg2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={MC.lightBlue} />
          <stop offset="1" stopColor={MC.softBlue} />
        </linearGradient>
        {/* Pulse animation for user location */}
        <style>{`
          @keyframes mpulse {
            0%   { r: 15; opacity: 0.35; }
            100% { r: 30; opacity: 0; }
          }
          .mpulse { animation: mpulse 2s ease-out infinite; }
        `}</style>
        <linearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#00E5FF" />
          <stop offset="1" stopColor="#3399FF" />
        </linearGradient>
      </defs>

      {/* ─── Background Image ─── */}
      <image 
        href="/map-bg.png" 
        x={-200} y={-200} width={MAP_W + 400} height={MAP_H + 400} 
        preserveAspectRatio="xMidYMid slice" 
      />

      {/* ─── User location ─── */}
      <circle className="mpulse" cx={USER_X} cy={USER_Y} r={15} fill={MC.blue} opacity={0.3} />
      <circle cx={USER_X} cy={USER_Y} r={10} fill={MC.blue} stroke="white" strokeWidth={3.5} />



      {/* ─── SPBU markers ─── */}
      {pins.map((p) => {
        const isNearest = nearestPin && p.l === nearestPin.l;
        const c    = qColor(p.q);
        const text = `Antrean ${p.q} · ${qLabel(p.q)}`;
        const pw   = Math.max(96, text.length * 5.8 + 22); // pill width
        const ph   = 22;                                     // pill height
        const px   = p.x - pw / 2;
        const py   = p.y - ph - 26;                         // pill top y

        return (
          <g key={p.l} onClick={() => onPin(p)} style={{ cursor: "pointer" }}>
            {/* Prominent Sonar Pulse for nearest */}
            {isNearest && (
              <>
                <circle className="mpulse" cx={p.x} cy={p.y} r={15} fill={MC.orange} opacity={0.5} />
                <circle className="mpulse" cx={p.x} cy={p.y} r={15} fill={MC.orange} opacity={0.5} style={{ animationDelay: '1s' }} />
              </>
            )}

            {/* Pill shadow */}
            <rect x={px + 1} y={py + 2} width={pw} height={ph} rx={11}
              fill={c} opacity={0.35} />
            
            {/* Highlight Glow for nearest */}
            {isNearest && (
              <rect x={px - 3} y={py - 3} width={pw + 6} height={ph + 6} rx={14}
                fill="none" stroke={MC.orange} strokeWidth={4} opacity={0.4} />
            )}

            {/* Pill body */}
            <rect x={px} y={py} width={pw} height={ph} rx={11}
              fill={c} stroke="white" strokeWidth={1.5} />
            {/* Label */}
            <text x={p.x} y={py + 14.5}
              textAnchor="middle" fill="white"
              fontSize="9" fontWeight="800"
              fontFamily={MFONT}
            >{text}</text>
            {/* Map Pin Marker */}
            <path
              d={`M ${p.x} ${p.y} C ${p.x + 6} ${p.y - 8} ${p.x + 8} ${p.y - 11} ${p.x + 8} ${p.y - 15} A 8 8 0 1 0 ${p.x - 8} ${p.y - 15} C ${p.x - 8} ${p.y - 11} ${p.x - 6} ${p.y - 8} ${p.x} ${p.y} Z`}
              fill={c} stroke="white" strokeWidth={1.5} strokeLinejoin="round"
            />
            <circle cx={p.x} cy={p.y - 15} r={3} fill="white" />
            
            {/* Nearest Label Badge */}
            {isNearest && (
              <g transform={`translate(0, -32)`} style={{ filter: `drop-shadow(0px 6px 12px rgba(224,122,31,0.4))` }}>
                <rect x={p.x - 75} y={py} width={150} height={26} rx={13} fill={MC.orange} stroke="var(--pomo-white)" strokeWidth={2.5} />
                <text x={p.x} y={py + 17} textAnchor="middle" fill="var(--pomo-white)" fontSize="10" fontWeight="800" fontFamily={MFONT} letterSpacing={0.5}>
                  PALING DEKAT ({kmOf(p)} km)
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ── Bottom sheet ─────────────────────────────────────────────────── */
function BottomSheet({ pin, onDetail, isNearest }: { pin: Pin; onDetail: () => void; isNearest?: boolean }) {
  const c    = qColor(pin.q);
  const sc   = pin.stock === "Tersedia" ? MC.green  : pin.stock === "Menipis" ? MC.orange : MC.red;
  const scBg = pin.stock === "Tersedia" ? MC.greenPale : pin.stock === "Menipis" ? MC.orangePale : MC.redPale;

  return (
    <div style={{
      position: "absolute", bottom: 16, left: 16, right: 16,
      background: "var(--pomo-white)",
      borderRadius: 24,
      boxShadow: `0 8px 32px ${MC.navy}22`,
      border: `1px solid ${MC.line}`,
      padding: "0 16px 20px",
      zIndex: 20,
    }}>
      {/* Handle */}
      <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 8px" }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: MC.line }} />
      </div>
      {/* Row */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14, flexShrink: 0,
          background: MC.bluePale,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Fuel size={22} color={MC.navy} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: MC.ink }}>SPBU {pin.l}</div>
            {isNearest && (
              <span style={{ 
                background: MC.orange, color: "var(--pomo-white)", 
                fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 6,
                letterSpacing: 0.5
              }}>LOKASI TERDEKAT</span>
            )}
          </div>
          <div style={{
            fontSize: 11.5, color: MC.sub, marginTop: 2,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>{pin.addr}</div>
          <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
            <Chip color={c} bg={c + "22"}><Car size={10} />Antrean {pin.q} · {qLabel(pin.q)}</Chip>
            <Chip color={sc} bg={scBg}><Gauge size={10} />Stok {pin.stock}</Chip>
            <Chip color={MC.sub} bg={MC.alabaster}><MapPin size={10} />{kmOf(pin)} km</Chip>
          </div>
        </div>
        <button onClick={onDetail} style={{
          flexShrink: 0, alignSelf: "center",
          display: "flex", alignItems: "center", gap: 6,
          padding: "10px 16px", borderRadius: 12,
          background: `linear-gradient(135deg, ${MC.navy}, ${MC.blue})`,
          color: "var(--pomo-white)", border: "none", cursor: "pointer",
          fontSize: 13, fontWeight: 800,
          boxShadow: `0 6px 16px ${MC.navy}40`,
          fontFamily: MFONT,
        }}>
          Detail <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

export type ReviewData = { id: string; n: string; r: number; c: string; isMine?: boolean };
const DEFAULT_REVIEWS: ReviewData[] = [
  { id: "2", n: "Rina A.", r: 4, c: "Antrean cukup rapi dan teratur. Hanya saja kadang angin ban mesinnya suka mati." },
  { id: "3", n: "Deni", r: 5, c: "Bagus banget, petugasnya ramah dan 24 jam jadi gampang buat isi malam-malam." }
];
const REVIEWS_STORE: Record<string, ReviewData[]> = {};

/* ── SPBU Detail full-screen (matches web SpbuDetailSide) ─────────── */
function SpbuDetail({
  pin, onClose, onSaveVisit,
}: {
  pin: Pin;
  onClose: () => void;
  onSaveVisit: () => void;
}) {
  const [saved, setSaved] = useState(false);
  const [reviews, setReviews] = useState<ReviewData[]>(() => {
    if (!REVIEWS_STORE[pin.l]) REVIEWS_STORE[pin.l] = [...DEFAULT_REVIEWS];
    return REVIEWS_STORE[pin.l];
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formText, setFormText] = useState("");
  const [formRating, setFormRating] = useState(5);

  const c      = qColor(pin.q);
  const stocks = SPBU_STOCK[pin.l] ?? [{ fuelIdx: 1, pct: 65 }, { fuelIdx: 2, pct: 50 }];

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.r, 0) / reviews.length).toFixed(1)
    : "0.0";

  const handleSave = () => {
    if (saved) return;
    setSaved(true);
    // Cocok dengan logika web: setelah simpan, navigasi ke Histori Kunjungan
    setTimeout(() => {
      onSaveVisit();
    }, 900);
  };

  const FACILITIES = [
    { i: <Coffee   size={16} />, l: "Mushola" },
    { i: <Bath     size={16} />, l: "WC"      },
    { i: <ShoppingBag size={16} />, l: "Market" },
    { i: <CreditCard  size={16} />, l: "ATM"    },
    { i: <Wind     size={16} />, l: "Angin"   },
    { i: <Droplets size={16} />, l: "Cuci"    },
  ];

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 40,
      background: MC.bg, display: "flex", flexDirection: "column",
      fontFamily: MFONT,
    }}>
      {/* Header gradient */}
      <div style={{
        background: `linear-gradient(135deg, ${MC.navy}, ${MC.blue})`,
        color: "var(--pomo-white)", padding: "18px 20px 22px", flexShrink: 0,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <button onClick={onClose} style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(255,255,255,.15)", border: "none", color: "var(--pomo-white)",
            padding: "8px 14px", borderRadius: 10, cursor: "pointer",
            fontSize: 12, fontWeight: 700, fontFamily: MFONT,
          }}>
            <ArrowLeft size={15} /> Kembali ke Peta
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, opacity: .85 }}>
            <Star size={13} fill="#FFD700" color="#FFD700" />{avgRating}
          </div>
        </div>
        <div style={{ fontSize: 11, opacity: .8, letterSpacing: .5 }}>SPBU {pin.l}</div>
        <div style={{ fontSize: 20, fontWeight: 800, marginTop: 3, lineHeight: 1.25 }}>
          {pin.addr.split(",")[0]}
        </div>
        <div style={{ fontSize: 12, opacity: .8, marginTop: 5 }}>{pin.addr}</div>
        <div style={{ display: "flex", gap: 22, marginTop: 18 }}>
          {[
            { l: "Jarak",  v: kmOf(pin) + " km"        },
            { l: "ETA",    v: "~" + etaOf(pin) + " mnt" },
            { l: "Rating", v: `${avgRating} ★`                   },
          ].map(s => (
            <div key={s.l}>
              <div style={{ fontSize: 10, opacity: .75 }}>{s.l}</div>
              <div style={{ fontSize: 16, fontWeight: 800, marginTop: 3 }}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scrollable body */}
      <div className="pomo-scroll-hidden" style={{ flex: 1, overflowY: "auto", padding: "14px 16px 36px" }}>

        {/* Status badges */}
        <div style={{
          display: "flex", gap: 8, flexWrap: "wrap",
          padding: "14px 16px", borderRadius: 16,
          background: "var(--pomo-white)", border: `1px solid ${MC.line}`,
          boxShadow: "0 2px 8px rgba(12,50,74,.05)",
          marginBottom: 12,
        }}>
          <Chip color={c} bg={c + "22"}><Dot color={c} />Antrean {pin.q} · {qLabel(pin.q)}</Chip>
          <Chip
            color={pin.stock === "Tersedia" ? MC.green  : MC.orange}
            bg={   pin.stock === "Tersedia" ? MC.greenPale : MC.orangePale}
          ><Dot color={pin.stock === "Tersedia" ? MC.green : MC.orange} />Stok {pin.stock}</Chip>
          <Chip color={pin.open ? MC.green : MC.red} bg={pin.open ? MC.greenPale : MC.redPale}>
            <Dot color={pin.open ? MC.green : MC.red} />{pin.open ? "Buka 24 Jam" : "Tutup"}
          </Chip>
        </div>

        {/* BBM ketersediaan */}
        <div style={{
          background: "var(--pomo-white)", borderRadius: 16, padding: 16,
          border: `1px solid ${MC.line}`, boxShadow: "0 2px 8px rgba(12,50,74,.05)",
          marginBottom: 12,
        }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: MC.ink, marginBottom: 14 }}>Ketersediaan BBM</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {stocks.map(({ fuelIdx, pct }) => {
              const f   = FUELS_ALL[fuelIdx];
              const bar = pct < 30 ? MC.orange : pct < 60 ? MC.yellow : MC.green;
              return (
                <div key={f.name} style={{
                  padding: "12px 14px", borderRadius: 12,
                  background: MC.alabaster, border: `1px solid ${MC.line}`,
                  display: "flex", alignItems: "center", gap: 12,
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: f.color + "22", color: f.color,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}><Fuel size={16} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: MC.ink }}>{f.name}</div>
                    <div style={{ fontSize: 10.5, color: MC.sub }}>{rp(f.price)}/L</div>
                  </div>
                  <div style={{ width: 80, flexShrink: 0 }}>
                    <div style={{ height: 6, background: "var(--pomo-white)", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: bar, borderRadius: 99 }} />
                    </div>
                    <div style={{
                      fontSize: 10, textAlign: "right", marginTop: 4,
                      color: pct < 30 ? MC.orange : MC.sub,
                      fontWeight: pct < 30 ? 700 : 400,
                    }}>{pct}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fasilitas */}
        <div style={{
          background: "var(--pomo-white)", borderRadius: 16, padding: 16,
          border: `1px solid ${MC.line}`, boxShadow: "0 2px 8px rgba(12,50,74,.05)",
          marginBottom: 16,
        }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: MC.ink, marginBottom: 14 }}>Fasilitas</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 10 }}>
            {FACILITIES.map(f => (
              <div key={f.l} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: MC.bluePale, color: MC.navy,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{f.i}</div>
                <span style={{ fontSize: 9, color: MC.sub, fontWeight: 600, textAlign: "center" }}>{f.l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ulasan Pengguna */}
        <div style={{
          background: "var(--pomo-white)", borderRadius: 16, padding: 16,
          border: `1px solid ${MC.line}`, boxShadow: "0 2px 8px rgba(12,50,74,.05)",
          marginBottom: 16,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: MC.ink }}>Ulasan Pengguna</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 800, color: MC.ink }}>
              <Star size={14} fill="#FFD700" color="#FFD700" /> {avgRating}
            </div>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {reviews.map((u, idx) => (
              <div key={u.id} style={{ 
                paddingBottom: idx === reviews.length - 1 ? 0 : 12, 
                borderBottom: idx === reviews.length - 1 ? "none" : `1.5px solid rgba(12, 50, 74, 0.15)`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 14,
                    background: MC.bluePale,
                    color: MC.navy, display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <User size={16} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: MC.ink }}>{u.n}</div>
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
                      }} style={{ background: "none", border: "none", color: MC.red, cursor: "pointer", padding: 4 }}>
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                </div>
                <div style={{ fontSize: 11, color: MC.sub, lineHeight: 1.4, paddingLeft: 36 }}>
                  {u.c}
                </div>
              </div>
            ))}
          </div>

          {isFormOpen ? (
            <div style={{ marginTop: 16, padding: 16, borderRadius: 12, border: `1px solid ${MC.line}`, background: MC.alabaster }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: MC.ink }}>{editId ? "Edit Ulasan" : "Tulis Ulasan Baru"}</div>
                <button onClick={() => setIsFormOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: MC.sub }}><X size={16} /></button>
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
                style={{ width: "100%", height: 80, padding: 12, borderRadius: 8, border: `1px solid ${MC.line}`, resize: "none", fontFamily: MFONT, fontSize: 12 }}
              />
              <button onClick={() => {
                if (!formText.trim()) return;
                let newReviews = [...reviews];
                if (editId) {
                  newReviews = newReviews.map(r => r.id === editId && r.isMine ? { ...r, c: formText, r: formRating } : r);
                } else {
                  const newReview = { id: Date.now().toString(), n: "Budi Hartono", r: formRating, c: formText, isMine: true };
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
              }} style={{ marginTop: 12, width: "100%", padding: "10px 0", borderRadius: 8, background: `linear-gradient(135deg, ${MC.navy}, ${MC.blue})`, color: "var(--pomo-white)", border: "none", fontWeight: 700, cursor: "pointer", fontFamily: MFONT, fontSize: 12 }}>
                Simpan Ulasan
              </button>
            </div>
          ) : (
            <button onClick={() => { setEditId(null); setFormText(""); setFormRating(5); setIsFormOpen(true); }} style={{
              marginTop: 16, width: "100%",
              padding: "12px 0", borderRadius: 10,
              background: "var(--pomo-white)", color: MC.navy,
              border: `1.5px solid ${MC.navy}`,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              fontSize: 13, fontWeight: 700, fontFamily: MFONT, cursor: "pointer",
            }}>
              <MessageSquare size={16} /> Tulis Ulasan
            </button>
          )}
        </div>

        {/* Action buttons — matches web SpbuDetailSide logic */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <button style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            padding: "14px 0", borderRadius: 12,
            background: `linear-gradient(135deg, ${MC.navy}, ${MC.blue})`,
            color: "var(--pomo-white)", border: "none", cursor: "pointer",
            fontSize: 13, fontWeight: 800, fontFamily: MFONT,
            boxShadow: `0 8px 20px ${MC.navy}40`,
          }}>
            <Navigation size={16} />Navigasi
          </button>
          <button
            onClick={handleSave}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "14px 0", borderRadius: 12,
              background: saved
                ? `linear-gradient(135deg, ${MC.green}, #007A62)`
                : "var(--pomo-white)",
              color: saved ? "var(--pomo-white)" : MC.navy,
              border: saved ? "none" : `1.5px solid ${MC.navy}`,
              cursor: saved ? "default" : "pointer",
              fontSize: 13, fontWeight: 700, fontFamily: MFONT,
              transition: "all .25s ease",
              boxShadow: saved ? `0 8px 20px ${MC.green}40` : "none",
            }}
          >
            {saved
              ? <><CheckCircle size={16} />Tersimpan!</>
              : <><History size={16} />Simpan Kunjungan</>
            }
          </button>
        </div>

        {/* Info navigasi ke Histori */}
        {saved && (
          <div style={{
            marginTop: 10, padding: "10px 14px", borderRadius: 10,
            background: MC.greenPale, border: `1px solid ${MC.green}33`,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <CheckCircle size={14} color={MC.green} />
            <span style={{ fontSize: 12, color: MC.green, fontWeight: 600 }}>
              Menuju Histori Kunjungan...
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Main exported component ──────────────────────────────────────── */
export function MobilePetaView({
  onBack, onGoHistori,
}: {
  onBack: () => void;
  onGoHistori: (spbuCode?: string) => void;
}) {
  const [filter,      setFilter     ] = useState("TERDEKAT");
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [selectedPin, setSelectedPin] = useState<Pin>(sortedByDist()[0]);
  const [detailPin,   setDetailPin  ] = useState<Pin | null>(null);
  const [zoom,        setZoom       ] = useState(1);
  // Pan offset dalam koordinat SVG
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const mapRef  = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    type: "touch" | "mouse";
    startClientX: number;
    startClientY: number;
    startPanX: number;
    startPanY: number;
    moved: boolean;
  } | null>(null);

  const MIN_ZOOM = 1, MAX_ZOOM = 4, STEP = 0.5;
  const sorted = sortedByDist();

  const visiblePins = PINS.filter((p) => {
    let passDropdown = true;
    if (filter === "STOK ADA")     passDropdown = p.stock === "Tersedia";
    else if (filter === "ANTREAN SEPI") passDropdown = p.q <= 9;
    else if (filter === "BUKA 24 JAM")  passDropdown = p.open;
    else if (filter === "TERDEKAT")     passDropdown = sorted.slice(0, 7).includes(p);

    let passFacilities = true;
    if (selectedFacilities.length > 0) {
      passFacilities = selectedFacilities.every(f => p.fasilitas.includes(f));
    }

    return passDropdown && passFacilities;
  });

  const nearestVisiblePin = visiblePins.length > 0
    ? visiblePins.reduce((min, p) => pixDist(p) < pixDist(min) ? p : min, visiblePins[0])
    : null;

  // ── Hitung viewBox berdasarkan zoom + pan ──────────────────
  const vw = MAP_W / zoom;
  const vh = MAP_H / zoom;
  // Base center: user location saat zoom > 1, tengah map saat zoom = 1
  const baseCx = zoom === 1 ? MAP_W / 2 : USER_X;
  const baseCy = zoom === 1 ? MAP_H / 2 : USER_Y;
  const cx = baseCx + pan.x;
  const cy = baseCy + pan.y;
  const vx = Math.max(-150, Math.min(cx - vw / 2, MAP_W + 150 - vw));
  const vy = Math.max(-150, Math.min(cy - vh / 2, MAP_H + 150 - vh));
  const viewBoxStr = `${vx.toFixed(1)} ${vy.toFixed(1)} ${vw.toFixed(1)} ${vh.toFixed(1)}`;

  // ── Reset zoom & pan ──────────────────────────────────────
  const resetView = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  // ── Konversi delta pixel layar → delta koordinat SVG ──────
  const pixelToSvg = (dx: number, dy: number) => {
    if (!mapRef.current) return { dx: 0, dy: 0 };
    const rect = mapRef.current.getBoundingClientRect();
    return {
      dx: dx * (vw / rect.width),
      dy: dy * (vh / rect.height),
    };
  };

  // ── Touch handlers ────────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const t = e.touches[0];
    dragRef.current = {
      type: "touch",
      startClientX: t.clientX,
      startClientY: t.clientY,
      startPanX: pan.x,
      startPanY: pan.y,
      moved: false,
    };
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!dragRef.current || e.touches.length !== 1) return;
    e.preventDefault();
    const t = e.touches[0];
    const rawDx = t.clientX - dragRef.current.startClientX;
    const rawDy = t.clientY - dragRef.current.startClientY;
    if (Math.abs(rawDx) > 4 || Math.abs(rawDy) > 4) dragRef.current.moved = true;
    const { dx, dy } = pixelToSvg(rawDx, rawDy);
    setPan({ x: dragRef.current.startPanX - dx, y: dragRef.current.startPanY - dy });
  };

  const onTouchEnd = () => { dragRef.current = null; };

  // ── Mouse handlers (desktop) ──────────────────────────────
  const onMouseDown = (e: React.MouseEvent) => {
    dragRef.current = {
      type: "mouse",
      startClientX: e.clientX,
      startClientY: e.clientY,
      startPanX: pan.x,
      startPanY: pan.y,
      moved: false,
    };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragRef.current) return;
    const rawDx = e.clientX - dragRef.current.startClientX;
    const rawDy = e.clientY - dragRef.current.startClientY;
    if (Math.abs(rawDx) > 4 || Math.abs(rawDy) > 4) dragRef.current.moved = true;
    const { dx, dy } = pixelToSvg(rawDx, rawDy);
    setPan({ x: dragRef.current.startPanX - dx, y: dragRef.current.startPanY - dy });
  };

  const onMouseUp = () => { dragRef.current = null; };

  // Apakah sedang drag (untuk mencegah klik pin saat geser)
  const isDragging = () => dragRef.current?.moved ?? false;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 30,
      background: MC.bg, display: "flex", flexDirection: "column",
      fontFamily: MFONT,
    }}>
      {/* ── Top App Bar ─────────────────────────────── */}
      {!detailPin && (
        <div style={{
          height: 60, flexShrink: 0,
          display: "flex", alignItems: "center",
          padding: "0 8px 0 4px",
          background: `linear-gradient(135deg, ${MC.navy}, ${MC.navyDeep})`,
          color: "var(--pomo-white)",
        }}>
          <button onClick={onBack} style={{
            width: 46, height: 46, borderRadius: 23,
            border: "none", background: "transparent",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "var(--pomo-white)",
          }}>
            <ArrowLeft size={22} />
          </button>
          <div style={{ flex: 1, paddingLeft: 4 }}>
            <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: .3 }}>Peta SPBU</div>
            <div style={{ fontSize: 10, opacity: .78, marginTop: 1 }}>
              Pantau stok &amp; antrean real-time · Bandung &amp; Cimahi
            </div>
          </div>
        </div>
      )}
      {/* ── Map area (flex:1 — fills all remaining screen) ── */}
      <div style={{
        flex: 1, position: "relative",
        minHeight: 0,
        background: MC.lightBlue,
      }}>
        {/* Map SVG fills 100% of this container — drag to pan when zoomed */}
        <div
          ref={mapRef}
          style={{
            position: "absolute", inset: 0,
            cursor: zoom > 1 ? "grab" : "default",
            userSelect: "none",
            touchAction: zoom > 1 ? "none" : "auto",
          }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          <MapSVG
            pins={visiblePins}
            onPin={(p) => { if (!isDragging()) { setSelectedPin(p); setDetailPin(null); } }}
            viewBox={viewBoxStr}
            nearestPin={nearestVisiblePin}
          />
        </div>

        {/* ── FLOATING UI ELEMENTS ── */}
        {!detailPin && (
          <div style={{
            position: "absolute", top: 16, left: 0, right: 0,
            display: "flex", flexDirection: "column", gap: 12,
            zIndex: 15, pointerEvents: "none"
          }}>
            {/* Search Bar & Theme Toggle */}
            <div style={{ padding: "0 16px", pointerEvents: "auto", display: "flex", gap: 8 }}>
              <div style={{
                flex: 1,
                display: "flex", alignItems: "center", gap: 10,
                padding: "0 16px", height: 44, borderRadius: 22,
                background: "var(--pomo-white)", border: `1px solid ${MC.line}`,
                boxShadow: "0 4px 16px rgba(12,50,74,.1)",
              }}>
                <Search size={17} color={MC.navy} />
                <input
                  placeholder="Cari SPBU di Bandung & Cimahi"
                  style={{
                    flex: 1, background: "transparent",
                    outline: "none", border: "none",
                    fontSize: 13.5, color: MC.ink, fontFamily: MFONT,
                  }}
                />
              </div>
              <div onClick={() => {
                document.documentElement.classList.toggle('dark');
                window.dispatchEvent(new Event('themechange'));
              }} style={{
                width: 44, height: 44, borderRadius: 22, background: "var(--pomo-white)",
                border: `1px solid ${MC.line}`, boxShadow: "0 4px 16px rgba(12,50,74,.1)",
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0
              }}>
                <Moon size={18} color={MC.navy} />
              </div>
            </div>
            
            {/* Horizontal scrollable pills */}
            <div className="pomo-scroll-hidden" style={{
              display: "flex", alignItems: "center", gap: 8, padding: "0 16px",
              overflowX: "auto", pointerEvents: "auto"
            }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  style={{
                    height: 32, padding: "0 28px 0 14px", borderRadius: 16,
                    border: `1px solid ${MC.line}`,
                    background: "var(--pomo-white)",
                    color: MC.navy,
                    fontSize: 12, fontWeight: 800,
                    cursor: "pointer", appearance: "none",
                    fontFamily: MFONT,
                    boxShadow: "0 4px 12px rgba(12,50,74,.15)",
                  }}
                >
                  <option value="TERDEKAT">TERDEKAT</option>
                  <option value="STOK ADA">STOK ADA</option>
                  <option value="ANTREAN SEPI">ANTREAN SEPI</option>
                  <option value="BUKA 24 JAM">BUKA 24 JAM</option>
                </select>
                <ChevronRight size={14} color={MC.navy} style={{ position: "absolute", right: 10, top: 9, transform: "rotate(90deg)", pointerEvents: "none" }} />
              </div>

              <div style={{ width: 1.5, height: 18, background: "rgba(12, 50, 74, 0.2)", flexShrink: 0, margin: "0 4px" }} />

              {["Toilet", "Musholla", "ATM", "Kafe", "Tambal Ban"].map((fasilitas) => {
                const isActive = selectedFacilities.includes(fasilitas);
                return (
                  <label key={fasilitas} style={{
                    display: "flex", alignItems: "center", gap: 6, cursor: "pointer",
                    padding: "0 14px", height: 32, borderRadius: 16, flexShrink: 0,
                    background: isActive ? MC.bluePale : "var(--pomo-white)",
                    border: `1px solid ${isActive ? MC.navy : MC.line}`,
                    color: isActive ? MC.navy : MC.ink,
                    boxShadow: "0 4px 12px rgba(12,50,74,.15)",
                    transition: "all .2s", margin: 0
                  }}>
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedFacilities(prev => [...prev, fasilitas]);
                        else setSelectedFacilities(prev => prev.filter(f => f !== fasilitas));
                      }}
                      style={{ display: "none" }}
                    />
                    <div style={{
                      width: 14, height: 14, borderRadius: 3,
                      border: `1.5px solid ${isActive ? MC.navy : MC.sub}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: isActive ? MC.navy : "transparent",
                      transition: "all .2s"
                    }}>
                      {isActive && <Check size={10} color="var(--pomo-white)" strokeWidth={3} />}
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700 }}>{fasilitas}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Zoom controls — top right */}
        <div style={{
          position: "absolute", right: 14, top: 120, zIndex: 15,
          background: "var(--pomo-white)", borderRadius: 14,
          boxShadow: `0 4px 16px ${MC.navy}28`,
          border: `1px solid ${MC.line}`,
          overflow: "hidden",
          display: "flex", flexDirection: "column",
        }}>
          {/* Zoom in */}
          <button
            onClick={() => setZoom(z => Math.min(MAX_ZOOM, +(z + STEP).toFixed(1)))}
            disabled={zoom >= MAX_ZOOM}
            style={{
              width: 42, height: 42, border: "none", cursor: "pointer",
              background: "transparent", color: MC.navy,
              display: "flex", alignItems: "center", justifyContent: "center",
              opacity: zoom >= MAX_ZOOM ? 0.35 : 1,
            }}
          ><Plus size={20} /></button>

          {/* Divider + level */}
          <div style={{ height: 1, background: MC.line }} />
          <div style={{
            textAlign: "center", fontSize: 8.5, fontWeight: 700,
            color: MC.sub, padding: "3px 0",
            fontFamily: MFONT, lineHeight: 1,
          }}>{Math.round(zoom * 100)}%</div>
          <div style={{ height: 1, background: MC.line }} />

          {/* Zoom out / reset */}
          <button
            onClick={() => setZoom(z => Math.max(MIN_ZOOM, +(z - STEP).toFixed(1)))}
            disabled={zoom <= MIN_ZOOM}
            style={{
              width: 42, height: 42, border: "none", cursor: "pointer",
              background: "transparent", color: MC.navy,
              display: "flex", alignItems: "center", justifyContent: "center",
              opacity: zoom <= MIN_ZOOM ? 0.35 : 1,
            }}
          ><Minus size={20} /></button>
        </div>

        {/* FAB — my location + reset zoom */}
        <button
          onClick={resetView}
          title="Lokasi saya / reset zoom"
          style={{
            position: "absolute", right: 14,
            bottom: selectedPin ? 180 : 16,
            width: 52, height: 52, borderRadius: 14,
            background: "var(--pomo-white)", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 6px 20px ${MC.navy}35`,
            transition: "bottom .28s cubic-bezier(.4,0,.2,1)",
            zIndex: 15,
          }}
        >
          <Navigation size={22} color={MC.navy} />
        </button>

        {/* Bottom sheet */}
        {selectedPin && !detailPin && (
          <BottomSheet
            pin={selectedPin}
            onDetail={() => setDetailPin(selectedPin)}
            isNearest={nearestVisiblePin ? selectedPin.l === nearestVisiblePin.l : false}
          />
        )}

        {/* Detail overlay */}
        {detailPin && (
          <SpbuDetail
            pin={detailPin}
            onClose={() => setDetailPin(null)}
            onSaveVisit={() => {
              setDetailPin(null);
              onGoHistori(detailPin.l);
            }}
          />
        )}
      </div>
    </div>
  );
}
