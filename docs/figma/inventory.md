# Inventario — Figma `GWE1jyD5ZyUbvLUsk6pVkx` (RB_ Exodus Vigilancia)

Páginas: `0:1` Cover (ignorar) · `2:2` Sketch (ignorar) · `2:3` Prototipo (incluir; alcance actual: sección `101:999`).

## Spec ERB-45370
Comportamiento según el spec "HH CEDIS – Exodus Vigilancia" (12 HU del parcial). Pantallas sin respaldo en Figma: ver discrepancias #29–#57.

## Sección: Acceso al módulo — nodeId 101:999 — Incluir
| Frame | nodeId | Tamaño | Tipo | Flujo | Plataforma | Estado |
|---|---|---|---|---|---|---|
| Inicio sesión | 2:113 | 480×800 | Pantalla | Acceso | Móvil (handheld) | Verificado 0.56 % |
| Menú | 13:133 | 480×800 | Pantalla | Acceso | Móvil | Verificado 0.08 % |
| Submenú Paqueterías | 139:3540 | 480×800 | Pantalla | Revisión paqueterías | Móvil | Verificado 0.37 % |
| ↳ Módulo Selección paqueterías | 558:4620 | 480×740 | Estado (fuera del frame) | Revisión paqueterías | Móvil | Implementado, sin captura de referencia |
| ↳ Módulo Revisión de cajas | 558:4701 | 480×740 | Estado (fuera del frame) | Revisión paqueterías | Móvil | Implementado, sin captura de referencia |
| ↳ Botón salir | 289:4716 | 480×124 | Fuera del frame | — | — | No usado (PENDIENTE) |
| Menú ↳ Revisión paqueterías (Conteo de cajas / Resumen del día) | 289:4702 | 480×740 | Fuera del frame | — | — | No usado (PENDIENTE) |

Conectores en el lienzo: `455:3934` "Clic" (Inicio sesión → Menú), `455:3944` "Clic" (Menú → Submenú Paqueterías).

## Sección: Selección de paquetería — 466:4544 — Incluida
530:6314 Selección · 450:3312 Búsqueda · 530:6625 Revisión de cajas · 558:3602 Agregar paquetería · 558:5605 / 558:5723 dos paqueterías.

## Sección: Escaneo de cajas y restricciones — 455:3300 — Incluida
565:6480 vacío · 618:12063 Embarque en otra paquetería · 466:4387 toast Etiqueta no reconocida · 565:6576 embarque en curso · 565:6856 Caja en otro embarque · 565:7078 / 568:7335 avance · 568:7515 Embarque finalizado.

## Sección: Eliminar embarque actual — 162:1481 — Incluida
588:9893 · 618:12397 Menú · 275:3264 Retirar embarque · 275:3986 / 275:3640 Selección de motivo · 526:4437 toast Embarque eliminado.

## Sección: Ver embarques — 483:5072 — Incluida
568:7900 · 289:2664 Menú con embarques revisados · 289:3128 lista de embarques.

## Sección: Eliminación de embarque ya cerrado — 505:4150 — Incluida
289:3207 Retirar embarque · 289:3346 / 289:3286 motivo · 289:3425 lista actualizada · 524:3868 toast.

## Sección: Finalizar paquetería — 138:2619 — Incluida
138:3384 / 530:6039 resumen + comentario · 628:4152 modal Finalizar entrega · 593:6263 Registrando entrega · 526:5459 resumen con folio · 526:5970 toast Entrega finalizada · 135:2000 toast Imprimiendo reporte · 526:5742 / 618:13325 regreso.

## Sección: Histórico paqueterías — 191:3286 — Incluida
191:3390 · 201:3951 Reportes del día · 593:5558 resumen · 217:6060 modal Imprimir reporte · 217:6601 toast.

## ~~Sección: Configuración impresoras — 648:7534~~ — Eliminada de Figma (2026-10-29)
La reemplazan las tres secciones siguientes.

## Sección: Ventana de configuración de operación — 730:5223 — Incluida (frames 430×932)
730:5224 Menú con engrane · 730:5261 Configuraciones.

## Sección: Módulo de configuración de impresoras por proceso — 730:5304 — Incluida (frames 430×932)
730:5807 / 730:5849 Procesos impresión (carga de estado) · 730:6003 → 730:6085 → 730:6168 modal de proceso (Sin conexión → Conectando → Conectada) · 730:5923 proceso reasignado · 730:6252 Impresoras · 730:5305 / 730:5431 Nueva conexión (buscando / lista) · 730:5713 confirmar · 730:5525 IP manual · 730:5619 confirmar por IP · 730:6337 / 730:6422 / 730:6513 impresora agregada (Conectando → Conectada) · 730:6604 / 730:6734 edición · 730:6863 Eliminar impresora · toasts 730:7015–730:7018.

## Sección: Empty State — 730:4894 — Incluida
730:4895 / 730:4975 proceso sin asignar y sin impresoras · 730:5058 procesos · 730:5099 "Aún no tienes impresoras" · 730:5149 "No encontramos impresoras".

## Sección: Agregar impresoras — 593:10679 — No incluida
Frames de otra app (Módulo de surtido, Etiquetas pendientes); solo se usa la referencia del input IP 593:11547.

## Secciones no replicadas
13:80 Ejemplo soñador (oculta) · 241:2037 "Componts dont touch pls" (biblioteca de componentes).

## Componentes / instancias
| Componente | nodeId | Uso |
|---|---|---|
| SELECT CEDIS | 2:148 | Login |
| Header (app) | 139:3541 | Submenú |
| Paquetería seleccion | 14:1235 (instancias 558:4629–4639) | Selección paqueterías |
| Paquetería (logo; variantes Logo_3Guerras / Logo_PaqExpress) | 241:2894 · 213:4922 · 553:4745 | Tarjetas de paquetería |
| Secondary tabs/Icon and label | 553:3468 | Pestañas de los módulos |

## Variables detectadas
- Color: Primary/Azul 300 = Botones/Default #1B3892 · Blanco · Negro · Inactive #E9E9E9 · Inactive Text #808080.
- Texto: Text font/B1, B2, H2, H3 · Handheld nueva/H3 (Roboto).
