# Exodus Vigilancia — demo HH CEDIS

Demo funcional (PWA, React 18 + TypeScript + Vite) del módulo "Revisión de paqueterías" de la HH CEDIS, replicada del prototipo de Figma "RB_ Exodus Vigilancia" y del spec del parcial ERB-45370.

**Demo publicada:** https://isaairojas.github.io/Exodus_vigilancia/

## Uso local
```bash
npm install
npm run dev        # desarrollo
npm run build      # compilación
npm run preview    # servidor en :4173
npm run test:visual  # comparación contra Figma (con preview corriendo)
npm run test:flow    # recorrido completo del flujo (con preview corriendo)
```

El panel de demo (junto al dispositivo) incluye las etiquetas de caja para escanear o copiar, los botones físicos Regresar/Home y las simulaciones (reserva en otra HH, falla del folio, red sin impresoras).

## Documentación
- `docs/cambios-historias.md`: cambios a llevar a las HU del parcial.
- `docs/figma/`: inventario, flujos, discrepancias, mapa de nodos y CHANGELOG.

La publicación en GitHub Pages se hace con `.github/workflows/deploy.yml` en cada push a `main`.
