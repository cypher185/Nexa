//#region node_modules/.nitro/vite/services/ssr/assets/format-DrTbiGi6.js
function formatNaira(kobo) {
	return "₦" + Math.round((kobo ?? 0) / 100).toLocaleString("en-NG");
}
function formatNairaDecimal(kobo) {
	return "₦" + ((kobo ?? 0) / 100).toLocaleString("en-NG", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	});
}
function nairaToKobo(naira) {
	const n = typeof naira === "string" ? Number(naira) : naira;
	if (!Number.isFinite(n) || n < 0) return 0;
	return Math.round(n * 100);
}
//#endregion
export { formatNairaDecimal as n, nairaToKobo as r, formatNaira as t };
