export function formatNaira(kobo: number | null | undefined): string {
  const amount = Math.round((kobo ?? 0) / 100);
  return "₦" + amount.toLocaleString("en-NG");
}

export function formatNairaDecimal(kobo: number | null | undefined): string {
  const amount = (kobo ?? 0) / 100;
  return "₦" + amount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function nairaToKobo(naira: number | string): number {
  const n = typeof naira === "string" ? Number(naira) : naira;
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.round(n * 100);
}
