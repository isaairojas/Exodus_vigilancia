# Discrepancias y decisiones

| # | Nodo | Situación | Decisión |
|---|---|---|---|
| 1 | 558:4629 vs 558:4630 | La primera tarjeta "Paquetería seleccion" mide 195 px de ancho; las demás, 198 px. | Replicado tal cual (3 GUERRAS = 195 px). |
| 2 | 2:137 / 2:145 | Mensaje de error oculto "No se ha encontrado este usuario" en ambos campos (el mismo texto en contraseña). | No implementado: está oculto y no tiene estilo visible. PENDIENTE: definir la validación del login. |
| 3 | I558:4703;54563:40396 | El ícono de la pestaña de paquetería es una imagen recortada y estirada a todo el ancho (208×24). | Se muestra el logo de la paquetería a 24 px de alto con `object-fit: contain`. |
| 4 | Tabs | Figma solo muestra 1 o 2 pestañas. | Con 3 o más paqueterías abiertas, las pestañas se reparten el ancho y la etiqueta "Añadir paquetería" queda apretada. Sin diseño: PENDIENTE. |
| 5 | 558:4714 | El valor es "3GUERRAS" y la tarjeta dice "3 GUERRAS". | Se conservan ambos literales (`clave` y `nombre` en los mocks). Para las otras paqueterías, clave = nombre (no hay dato en Figma). |
| 6 | Textos | El line-height "normal" de Roboto en el navegador mide 1–2 px más que en Figma, y eso desplazaba la hoja del login 3 px. | Tokens `--line-height-*` con las alturas medidas en Figma. |
| 7 | 139:3644 / 141:3647 | Los íconos sobresalen de la tarjeta (la captura de Figma los muestra recortados). | `overflow: hidden` en ActionTile. Solo el camión tiene `mix-blend-mode: lighten`; la impresora no (literal de Figma). |
| 8 | 289:4702 (Menú) y 289:4716 | Paneles fuera del frame ("Conteo de cajas / Resumen del día" y un segundo "Salir"). | No implementados: no tienen conexión visible. PENDIENTE confirmar si son versiones obsoletas. |
| 10 | Menú ⋮ (618:12559) | Figma solo muestra "Retirar embarque actual". | **Indicación del usuario:** si la paquetería activa no tiene cajas escaneadas, el botón dice "Eliminar paquetería" y quita la pestaña (sin motivo ni confirmación) para poder cambiar de paquetería. Con un embarque en curso se mantiene "Retirar embarque actual". |
| 11 | Tabs | Máximo 2 paqueterías abiertas. | **Indicación del usuario** (coincide con 558:5605): con 2 abiertas desaparece "Añadir paquetería". |
| 12 | Etiquetas | Figma no define el formato. | ~~20 dígitos (indicación del usuario)~~ → **Spec ERB-45370:** etiqueta de embarque de 14 dígitos = folio de pedido (8) + caja (3) + total (3). Ver #29. |
| 13 | Embarques demo | Figma muestra TAB - Villahermosa con 13 cajas y CDMX / GDL con 5. | **Indicación del usuario:** 20 cajas en total → TAB 10 + GDL 5 + CDMX 5. Los destinos y folios son los de Figma. |
| 14 | Toast "Embarque ya revisado" | Caja de un embarque ya finalizado (sin diseño). | Toast rojo con texto propio. **Sin respaldo en Figma.** "Caja ya escaneada" se eliminó: la caja repetida no interrumpe (FR-029). |
| 15 | Indicador de "Añadir paquetería" (558:5462) | Usa `M3/sys/light/primary` #6750A4 (morado por defecto del kit Material). | Se usa Primary/Azul 300, como en el resto de las pestañas. Confirmar con diseño. |
| 16 | Íconos de pestaña de paquetería | El MCP exporta el ícono por defecto (estrella) en lugar del logo. | Se usa el logo PNG de la paquetería, ajustado a 36 px de alto (padding 22 px de 565:6580). |
| 17 | Motivos de retiro | Figma solo muestra "Mercancía rota" (275:3806). | **Resuelto por el spec (FR-041):** Cambio de paquetería, Cajas rotas, Documentación errónea, Líquidos, Otros. |
| 18 | Header en Revisión de cajas (565:6577) | Sin flecha atrás, solo ⋮. | Replicado: para salir se finaliza o retira el embarque, o se elimina la paquetería. |
| 19 | Panel "Etiquetas de demo" | Herramienta de la demo, no forma parte del dispositivo. | Fuera del frame; **sin respaldo en Figma**. |
| 20 | Menú ⋮ con embarques revisados (289:2664) | "Retirar embarque actual" en gris y "Finalizar entrega" en rojo. | Replicado. "Eliminar paquetería" solo aparece si la paquetería no tiene cajas escaneadas ni embarques revisados. |
| 21 | Resumen de la revisión | Fechas de Figma fijas (27/05/2026). | Fecha inicio = primer escaneo de la paquetería, Fecha fin = momento de abrir el resumen o de cerrar la entrega. |
| 22 | Folio de entrega | Figma muestra 10205600033. | Se usa como folio del reporte semilla; la demo genera consecutivos desde 10205600034. |
| 23 | Reportes del día | La 4.ª tarjeta (URUZ, "Cierre de conteo") está cortada y no se ven sus datos. | Solo se incluyen las 3 tarjetas completas (TRES GUERRAS 5/49, PAQUETE EXPRESS 18/105, TRANSPORTE INTERNO 22/119), más las entregas cerradas en la demo. Las dos últimas no tienen lista de embarques en Figma. |
| 24 | Nombre de la paquetería | "3 GUERRAS" (tarjeta) vs "TRES GUERRAS" (reportes y modal Finalizar entrega). | `nombreLargo` en los mocks. |
| 25 | "Registrando entrega" (593:6263) | Sin duración definida. | 1.8 s con ícono giratorio (animación supuesta). |
| 26 | Ícono del modal "Imprimir reporte" / "Eliminar impresora" | Compuesto con máscara; se exportó como PNG con fondo blanco cuadrado. | PNG 2× con las esquinas recortadas a transparente. |
| 27 | Botones rojos | El `capitalize` de "Salir" (13:158) se aplicaba a todos los botones rojos ("Finalizar Entrega"). | Corregido: solo aplica a la barra Salir. |
| 28 | Agregar impresora | ~~Sin flujo en Figma~~ | **Resuelto:** Figma ya trae "Nueva conexión" (730:5304); ver #44. |
| 9 | Safe areas | Los frames no incluyen barra de sistema. | El frame de 480×800 se escala para caber en la pantalla (`App.tsx`). |

## Spec ERB-45370 (2026-10-29)
Fuente: spec "HH CEDIS – Exodus Vigilancia" (Rediseño de Exodus Vigilancia). Regla del spec: la **nomenclatura** (textos, botones, pantallas) es la del prototipo; el spec define el **comportamiento**.

| # | Tema | Situación | Decisión |
|---|---|---|---|
| 29 | Etiqueta de 14 dígitos | Los folios de Figma tienen 7 dígitos y la etiqueta pide 8. | Se rellena con cero a la izquierda (`01301715` + caja + total). La indicación previa de 20 dígitos queda sustituida. |
| 30 | Etiqueta de packing list (FR-023, OQ-03) | Estructura sin definir. | No implementada. PENDIENTE. |
| 31 | Textos del spec vs Figma | "Se han **contado**… ¿Deseas seguir **contando**…" y "¿Deseas retirar el embarque del **conteo activo**?" vs "revisado/revisando" y "de la entrega actual" en Figma. | Se conservan los textos de Figma. |
| 32 | Nombres de pantalla | Spec: "Conteo de cajas", "Resumen del día", "Revisión de paquetería". Figma: "Revisión de cajas", "Impresión reportes" / "Reportes del día", "Revisión paqueterías". | Figma. |
| 33 | "Finalizar conteo" vs "Finalizar entrega" (OQ-07) | Las HU alternan ambos. | "Finalizar entrega" (Figma). |
| 34 | Resumen antes de finalizar (FR-063) | Figma: "Regresar" + "Finalizar entrega"; el spec pide "Agregar embarque" y "Ver embarques". | "Regresar" pasa a **"Agregar embarque"** (misma acción). "Ver embarques" se agrega como enlace (estilo 730:6551) junto a "Embarques revisados". **Sin respaldo en Figma.** |
| 35 | Botón tras cerrar la entrega (FR-072) | Figma: "Regresar". | **"Realizar nueva entrega"** (va a Selección) o **"Regresar a entrega en curso"** si la otra pestaña tiene una entrega en curso. |
| 36 | ✕ de "Embarque finalizado" (FR-047, OQ-05) | Solo aparece con todas las cajas escaneadas. | **Confirmado por el usuario (2026-10-29):** la ✕ significa "sí, finalizar la entrega": el embarque se cierra y sigue el flujo existente de "Finalizar paquetería" (resumen → Finalizar entrega). |
| 37 | Fechas del resumen (FR-062) | Antes, Fecha fin = momento de abrir el resumen. | Fecha fin = última caja escaneada. Se agrega la fila **Usuario** (InfoRow pequeño, sin respaldo). |
| 38 | Comentario del motivo "Otros" (FR-042) | Sin diseño; el spec pedía 150 caracteres. | **Usuario:** máximo **50** caracteres, tanto en el retiro como en la eliminación. Al elegir "Otros" se abre el campo y recibe el foco (abre el teclado). InputField multilínea con contador "n/50" (sin respaldo). |
| 39 | Pantallas y avisos sin diseño | Paquetería no registrada (FR-013), Embarque en revisión en otro dispositivo (FR-036), Embarque pendiente (FR-038), avisos "No se pudo imprimir" (sin impresora o sin conexión; **usuario:** solo indicar que no se pudo), "No se pudo finalizar la entrega" (FR-067), "No es posible regresar" (FR-101), "Sin conexión a la red" (FR-095), "Impresora ya agregada". | Se componen con Modal, Button, InputField y Toast. Textos propios: **confirmar**. |
| 40 | Sonidos (FR-030) | — | **Resuelto:** `beep-ok.mp3` y `beep-error.mp3` copiados de Exodus GTM PWA (`src/assets/audio`). |
| 41 | Selector de fecha (FR-081) | Sin diseño en 201:3951. | InputField `type="date"` bajo el título (sin respaldo). Las entregas semilla pasan al día actual con las horas de Figma; TRANSPORTE INTERNO pasa al día anterior para mostrar el filtro. |
| 42 | ID en "Reportes del día" (FR-083) | La tarjeta 217:5849 no muestra el folio. | Línea "ID de entrega" y la tarjeta crece 29 px (sin respaldo). |
| 43 | Paquetería no registrada | La tarjeta de Figma dice "NO REGISTRADA". | Se conserva. El nombre capturado (máx. 50) se muestra en mayúsculas en la pestaña y en "Paquetería". |
| 44 | Módulo de impresoras | La sección 648:7534 (Mis impresoras con predeterminada) **se eliminó de Figma** y la reemplazan 730:5304 / 730:4894 / 730:5223, con frames de 430×932. | Se replica el módulo nuevo dentro del frame de 480×800 (anchos al 100 %). Se eliminó la pantalla anterior. Sin captura de referencia a 480×800 (no hay verificación por píxel). |
| 45 | Acceso a Configuraciones | El engrane (730:5227) viene de un menú de otra app (Tareas, Descarga…). | Se agrega al Menú 13:133 (verificación visual 0.08 % → 0.18 %). La tarjeta "Configuración de impresoras" abre directamente Impresión. |
| 46 | Datos de impresoras | Figma usa 192.168.1.47 para la Canon (730:5787) y también para la Zebra ZD620 (730:5619); el proceso empieza con "Laser ink", que no está en "Mis impresoras". | IP supuestas (Canon 192.168.1.47, Zebra ZD620 192.168.1.48…). Asignación inicial: la Canon sin conexión, para reproducir el estado rojo de 730:5849. |
| 47 | Procesos de impresión | Figma muestra también "Etiqueta única", "Factura pedidos cliente" y "Bitácora traspasos". | Solo "Exodus vigilancia - Reporte del día" (FR-091); la lista admite más procesos. |
| 48 | Orden de impresoras (FR-094) | Figma no las ordena alfabéticamente. | Orden alfabético (spec). |
| 49 | Editar IP (FR-096) | En Figma el modo edición solo elimina. | En modo edición, tocar la impresora abre "Editar conexión" (modal de IP 730:5591, sin respaldo). |
| 50 | Eliminar impresora asignada (FR-097) | El texto de 730:6999 es genérico. | Se agrega "Quedarán sin impresora: <procesos>" cuando aplica. |
| 51 | Botones físicos (ERB-54985) | Sin diseño. | MemoryRouter + interceptación de `popstate` (`src/navigation/botones.tsx`). En el Menú, Regresar no hace nada. Home se simula desde el panel con la pantalla "App en segundo plano". |
| 52 | Entregas simultáneas (OQ-02) | Contradicción entre ERB-48099 y ERB-54985. | **Confirmado por el usuario:** una entrega por pestaña y máximo 2 paqueterías. Regresar no sale del flujo mientras haya una en curso. |
| 53 | Caja de otro embarque (OQ-04) | No se define qué pasa después del modal. | **Confirmado por el usuario:** la lectura se descarta y se muestra el modal "Caja en otro embarque". |
| 54 | Vigencia de la reserva (OQ-06) | Sin definir. | **Usuario:** vence a más tardar en **24 h** desde la primera caja. Al reabrir la app, un embarque con la reserva vencida se libera y no queda pendiente. Las reservas de otra HH vencidas ya no bloquean. Demo: "Adelantar 24 h" en el panel. |
| 55 | Frecuencia de paqueterías (OQ-01) | Periodo sin definir. | Campo `usos` en los mocks (proceso previo) que reproduce el orden de Figma. |
| 56 | Rol Vigilancia (FR-003) | Sin backend. | Demo: el usuario 604512 tiene el rol; cualquier otro número inicia sesión sin él. |
| 57 | Persistencia (FR-038 / FR-098) | Sin backend. | `localStorage` sustituye las tablas: revisión (con auditoría de retiros y eliminaciones) e impresoras por dispositivo. "Reiniciar demo" en el panel. |
| 58 | Tooltip del destino (FR-053 / FR-064) | El spec decía mantener presionado. | **Usuario:** se abre al dar clic en un destino truncado; otro clic lo cierra (2.5 s máx.). |
| 59 | Etiqueta de packing list | — | **Usuario:** queda PENDIENTE. |
| 60 | IP de impresoras | — | **Usuario:** se quedan las IP inventadas. |
| 61 | "Ver embarques" en el menú ⋮ (289:2664) | En Figma está habilitado siempre. | **Usuario:** deshabilitado mientras no haya embarques finalizados (cambio C-01 en `docs/cambios-historias.md`). |
