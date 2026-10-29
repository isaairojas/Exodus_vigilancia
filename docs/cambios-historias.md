# Cambios a las historias del parcial ERB-45370

**Rediseño de Exodus Vigilancia**

**Fecha:** 29/10/2026

**Origen:** decisiones tomadas al construir la demo funcional (prototipo navegable). Las demás reglas del spec "HH CEDIS – Exodus Vigilancia" no cambian.

**Cómo usar este documento:** cada fila dice qué HU actualizar, qué texto o criterio cambia y por qué.

## 1. Cambios confirmados (actualizar la HU)

| # | HU | Criterio afectado | Dice hoy (spec) | Debe decir | Motivo |
|---|---|---|---|---|---|
| C-01 | ERB-48097 Ver embarques | FR-050 | "Ver embarques" está disponible en el menú ⋮ durante toda la entrega activa. | "Ver embarques" se muestra en el menú ⋮ durante toda la entrega activa, pero **está deshabilitado mientras no exista al menos un embarque finalizado** en la entrega. | No hay nada que consultar ni eliminar antes del primer embarque finalizado. |
| C-02 | ERB-48093 Finalización de embarque | FR-047, OQ-05 | Con X, el modal se cierra y la app pasa al resumen; el embarque queda abierto al 100 %. | El modal "Embarque finalizado" solo aparece cuando se escanearon **todas** las cajas. Con **X** el vigilante confirma que quiere **finalizar la entrega**: el embarque se cierra y continúa el flujo existente de finalización (resumen → "Finalizar entrega"). | Se cierra OQ-05: la X no deja el embarque "abierto". |
| C-03 | ERB-48095 / ERB-48096 Retiro y eliminación | FR-042, BR-05, A-03 | Con "Otros", comentario obligatorio de máximo **150** caracteres. | Con "Otros" se abre un espacio para escribir el comentario y **se activa el teclado**. Es obligatorio, de **1 a 50 caracteres**, con contador. Aplica igual al retiro del embarque en curso y a la eliminación de un embarque cerrado. | Límite unificado con el nombre de "Paquetería no registrada". |
| C-04 | ERB-48098 Conteo – Uso simultáneo | OQ-06, FR-035–FR-037 | La reserva no tiene expiración definida. | La reserva de un embarque **vence a más tardar 24 h** después de escanear su primera caja. Al vencer, el embarque queda libre para cualquier HH. Si la app se reabre con una reserva vencida, el embarque no se ofrece como pendiente. | Evita embarques bloqueados por una HH perdida o apagada. |
| C-05 | ERB-48098 Conteo | OQ-04 | Solo se pide un modal de confirmación; no se define qué pasa después. | Al escanear una caja de otro embarque, **la lectura se descarta**, el embarque en curso no cambia y se muestra el modal "Caja en otro embarque" con el sonido de error. | Se cierra OQ-04. |
| C-06 | ERB-48099 Impresión de reporte / ERB-48105 Resumen del día | FR-071, FR-084 | No define qué pasa si la impresión falla. | Si no hay impresora asignada al proceso "Reporte del día" o la impresora no responde, se muestra solo el mensaje **"No se pudo imprimir"**. La entrega no cambia y se puede reintentar. | Mensaje simple para el vigilante. |
| C-07 | ERB-48097 Ver embarques / ERB-48094 Finalización de entrega | FR-053, FR-064, A-02 | El tooltip con el nombre completo se abre al **mantener presionado**. | El tooltip se abre al **dar clic** en el destino truncado y se cierra con otro clic o a los pocos segundos. | Más fácil de descubrir en la HH. |
| C-08 | ERB-48099 Impresión / ERB-54985 Botones físicos | OQ-02 | Las HU se contradicen sobre si puede haber otra entrega abierta. | Puede haber **una entrega por pestaña** y **máximo dos paqueterías** abiertas. "Regresar a entrega en curso" lleva a la otra pestaña cuando ésta tiene una entrega en curso. | Se cierra OQ-02. |
| C-09 | ERB-48101 Selección de paqueterías | FR-013 | Sin cambio de regla. | **Ratificado:** "Paquetería no registrada" abre un modal con un campo de nombre de máximo **50** caracteres y el teclado activo. | Confirmación. |
| C-10 | ERB-48098 Conteo | FR-030 | Sonidos `beep-ok.mp3` / `beep-error.mp3`. | Sin cambio. Se usan los archivos de Exodus GTM PWA (`assets/audio`). | Referencia del recurso. |

## 2. Pendientes que siguen abiertos

| # | HU | Tema | Estado |
|---|---|---|---|
| P-01 | ERB-48098 | Estructura de la etiqueta de packing list (FR-023, OQ-03) | Pendiente con desarrollo. La demo solo lee la etiqueta de embarque de 14 dígitos. |
| P-02 | ERB-48101 | Periodo y frecuencia del cálculo del orden de paqueterías (OQ-01) | Pendiente. La demo usa un orden precalculado. |
| P-03 | ERB-54938 | IP reales de las impresoras del CEDIS | La demo usa IP inventadas. |
| P-04 | Varias | Textos de los avisos sin diseño en Figma. Ver la lista abajo. | Validar con UX. |

Textos a validar en P-04:
- Embarque en revisión en otro dispositivo
- Embarque pendiente
- No es posible regresar
- No se pudo finalizar la entrega
- Sin conexión a la red

## 3. Nomenclatura (sin cambio de comportamiento)

El spec indica que prevalece el prototipo. La demo usa los textos de Figma:

| Spec | Prototipo (se usa) |
|---|---|
| Revisión de paquetería | Revisión paqueterías |
| Conteo de cajas | Revisión de cajas |
| Resumen del día | Impresión reportes → Reportes del día |
| Finalizar conteo | Finalizar entrega (OQ-07) |
| "Se han contado todas las cajas…" | "Se han revisado todas las cajas…" |

Detalle técnico y visual: `docs/figma/discrepancias.md` (#29–#60).
