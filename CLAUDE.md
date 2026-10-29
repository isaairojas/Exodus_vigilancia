# Exodus Vigilancia

PWA móvil (React 18 + TypeScript + Vite) que replica el prototipo de Figma "RB_ Exodus Vigilancia".

- `npm run dev` desarrollo · `npm run build` compilación · `npm run preview` servidor en :4173
- Con `preview` corriendo: `npm run test:visual` (pixelmatch contra docs/figma/cache, tolerancia ≤ 1 %) y `npm run test:flow` (recorrido del flujo con clics).
- Las pruebas usan el Microsoft Edge instalado (`playwright-core`, channel `msedge`).

Antes de cualquier tarea de UI, lee y sigue @FIGMA_REPLICA.md.

## Sistema de diseño (réplica de Figma)
- Fuente de verdad visual: Figma https://www.figma.com/design/GWE1jyD5ZyUbvLUsk6pVkx/RB_-Exodus-Vigilancia. Mapa de identidad: docs/figma/figma-map.json.
- Toda UI nueva usa exclusivamente componentes de src/design-system y tokens de tokens.css.
- Prohibido introducir valores visuales literales, librerías de UI o íconos externos.
- Para nuevas pantallas/flujos: si existen en Figma, seguir FIGMA_REPLICA.md (F4–F6);
  si NO existen en Figma, componer con componentes existentes y marcar la pantalla como
  "sin respaldo en Figma" en docs/figma/figma-map.json.
- Si el diseño cambia en Figma: resincronizar solo los nodos modificados y registrar en CHANGELOG.md.
- Usar `--line-height-*` (alturas medidas en Figma) en lugar de `line-height: normal`.
