# CHANGELOG de sincronización con Figma

## 2026-10-29 (3)
- "Ver embarques" deshabilitado sin embarques finalizados.
- `docs/cambios-historias.md`: cambios a llevar a las HU del parcial ERB-45370.
- Publicación en GitHub Pages.

## 2026-10-29 (2) — Confirmaciones del usuario
- ✕ de "Embarque finalizado" = confirmar la finalización de la entrega (flujo existente).
- Reserva de embarque con vigencia de 24 h.
- Comentario de "Otros" limitado a 50 caracteres; el campo recibe el foco.
- Tooltip del destino con clic.
- Impresión fallida: solo "No se pudo imprimir".
- Sonidos reales beep-ok.mp3 / beep-error.mp3.
- `npm run test:flow`: OK (34 capturas).

## 2026-10-29 — Spec ERB-45370 + resincronización de impresoras
- Comportamiento alineado al spec "HH CEDIS – Exodus Vigilancia":
  - acceso por rol;
  - paqueterías ordenadas por frecuencia y paquetería no registrada;
  - etiquetas de 14 dígitos, sonidos, ráfaga, caja repetida sin interrupción;
  - reserva en otra HH y embarque pendiente;
  - motivos del spec con comentario obligatorio para "Otros", y auditoría;
  - ✕ de "Embarque finalizado" lleva al resumen; "Agregar embarque" y "Ver embarques" desde el resumen;
  - falla al generar el ID; botón de continuidad;
  - impresión por proceso; Resumen del día con selector de fecha;
  - botones físicos Regresar y Home.
- Figma: la sección "Configuración impresoras" (648:7534) se eliminó del archivo. Se replicaron 730:5223, 730:5304 y 730:4894 (Configuraciones › Impresión, procesos, impresoras, nueva conexión, IP manual, edición, eliminación, estados vacíos y toasts).
- Nuevos componentes: InputField, TextLink, SegmentedTabs, EstadoImpresora, ProcesoCard/ConfigCard, ImpresoraRow, EmptyState. Modal con variante `compact`. EmbarqueRow con tooltip y ReporteCard con ID de entrega.
- Discrepancias #29–#57.
- `npm run test:flow`: 34 capturas, OK. `npm run test:visual`: 2:113 0.56 %, 13:133 0.18 % (engrane), 139:3540 0.37 %.

## 2026-10-28 (3)
- Secciones replicadas: Ver embarques (483:5072), Eliminación de embarque ya cerrado (505:4150), Finalizar paquetería (138:2619), Histórico paqueterías (191:3286) y Configuración impresoras (648:7534). Con esto queda replicada toda la página Prototipo, salvo "Ejemplo soñador" (oculta) y la biblioteca de componentes.
- Nuevos componentes: EmbarqueRow, FechaCard, ReporteCard, ActionBar; InfoRow con valor de 14 px.
- `npm run test:flow`: 29 pasos, todos OK. `npm run test:visual`: sin cambios (≤ 0.56 %).

## 2026-10-28 (2)
- Escaneo de cajas de embarques (secciones 466:4544, 455:3300, 162:1481): barra de escaneo, tarjeta de embarque, cuadrícula de cajas, restricciones (otra paquetería, etiqueta no reconocida, caja en otro embarque), Embarque finalizado, menú ⋮, retirar embarque con motivo.
- Indicaciones del usuario: etiquetas de 20 dígitos, 20 cajas de demo, máximo 2 paqueterías, "Eliminar paquetería" cuando no hay cajas escaneadas.
- Panel "Etiquetas de demo" (sin respaldo en Figma) para escanear o copiar las 20 etiquetas.
- `npm run test:flow` cubre el recorrido completo del escaneo (14 pasos).

## 2026-10-28
- Primera réplica de la sección "Acceso al módulo" (101:999): Inicio sesión, Menú y Submenú Paqueterías (+ estados Selección paqueterías y Revisión de cajas).
- Verificación visual: 2:113 0.56 %, 13:133 0.08 %, 139:3540 0.37 % (tolerancia ≤ 1 %).
- Siguiente: confirmar los flujos inferidos (flujos.md) y resolver los PENDIENTES de discrepancias.md.
- Herramientas MCP: create_session, get_metadata, get_design_context, get_screenshot, get_motion_context, download_assets. `get_screenshot` devuelve 1×1 px para nodos fuera del frame visible; `get_motion_context` no expone interacciones.
