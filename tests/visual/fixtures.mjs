// Etiquetas de prueba: mismas reglas que src/mocks/embarques.ts (folio 8 + caja 3 + total 3)
const pad = (n, l) => String(n).padStart(l, '0');
const cajas = (folio, total) => Array.from({ length: total }, (_, i) => `${pad(folio, 8)}${pad(i + 1, 3)}${pad(total, 3)}`);

export const embarques = [cajas('1301715', 10), cajas('1301926', 5), cajas('1301728', 5)];
