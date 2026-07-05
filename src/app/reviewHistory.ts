export type ReviewHistoryItem = {
  id: string;
  spbu: string;
  date: string;
  rating: number;
  comment: string;
};

const REVIEW_HISTORY_KEY = "pomo:review-history";

export const DEFAULT_REVIEW_HISTORY: ReviewHistoryItem[] = [
  {
    id: "default-1",
    spbu: "SPBU Pertamina Pasteur",
    date: "24 Jun 2026",
    rating: 5,
    comment: "Toilet sangat bersih dan antrean tidak terlalu panjang saat malam hari.",
  },
  {
    id: "default-2",
    spbu: "SPBU Pertamina Cibeureum",
    date: "15 Jun 2026",
    rating: 4,
    comment: "Pelayanan cepat, tapi sayang stok Pertamax Turbo sedang kosong.",
  },
];

function readStoredReviewHistory(): ReviewHistoryItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(REVIEW_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeStoredReviewHistory(history: ReviewHistoryItem[]) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(REVIEW_HISTORY_KEY, JSON.stringify(history));
}

export function getReviewHistory() {
  return [...readStoredReviewHistory(), ...DEFAULT_REVIEW_HISTORY];
}

export function addReviewHistory(item: ReviewHistoryItem) {
  const existing = readStoredReviewHistory().filter(review => review.id !== item.id);
  writeStoredReviewHistory([item, ...existing]);
}

export function removeReviewHistory(id: string) {
  writeStoredReviewHistory(readStoredReviewHistory().filter(review => review.id !== id));
}

export function formatReviewDate(date = new Date()) {
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
