# Flujos — Acceso al módulo (101:999) · Selección de paquetería (466:4544) · Escaneo de cajas y restricciones (455:3300) · Eliminar embarque actual (162:1481)

El MCP de Figma **no expone las conexiones del prototipo** (`get_motion_context` responde vacío). Las conexiones se leyeron de las capturas de cada sección (conectores "Clic", "Búsqueda", "Escaneo de caja", "After delay 900ms", "action").
Fuente: **Lienzo** = conector visible en Figma · **Usuario** = indicación del usuario (2026-10-28) · **Spec** = spec ERB-45370 (2026-10-29) · **Inferido** = deducido de la estructura.

| Origen (pantalla/nodo) | Disparador | Acción | Destino | Transición | Duración/Easing | Fuente |
|---|---|---|---|---|---|---|
| Inicio sesión / Bttn inicio 2:128 | Tap | Navegar | Menú 13:133 | Instantánea | — | Lienzo (455:3934) |
| Menú / Revisión de paqueterías 14:879 | Tap | Navegar | Submenú Paqueterías 139:3540 | Instantánea | — | Lienzo (455:3944) |
| Menú / Salir 13:156 | Tap | Cerrar sesión | Inicio sesión | Instantánea | — | Inferido |
| Submenú / "← Menú" | Tap | Atrás | Menú | Instantánea | — | Inferido (etiqueta) |
| Submenú / Revisión de cajas 139:3644 | Tap | Cambiar estado | Selección de paquetería 530:6314 (o Revisión de cajas si ya hay paquetería abierta) | Instantánea | — | Inferido |
| Selección / Buscador | Escritura | Filtrar tarjetas | 450:3312 | — | — | Lienzo ("Búsqueda") |
| Selección / tarjeta de paquetería | Tap | Abrir pestaña | Revisión de cajas 530:6625 | Instantánea | — | Lienzo |
| Revisión de cajas / Tab "Añadir paquetería" | Tap | Cambiar estado | Agregar paquetería 558:3602 | Instantánea | — | Lienzo |
| Agregar paquetería / tarjeta | Tap | Abrir 2.ª pestaña | Revisión de cajas con 2 pestañas 558:5605 (sin "Añadir") | Instantánea | — | Lienzo + Usuario (máx. 2) |
| Revisión de cajas / tab de paquetería | Tap | Cambiar paquetería activa | 558:5723 | Instantánea | — | Lienzo |
| Revisión de cajas / Escáner | Escaneo de caja de otra paquetería | Modal | "Embarque en otra paquetería" 618:12192 | — | — | Lienzo |
| Revisión de cajas / Escáner | Código no reconocido | Toast | "Etiqueta no reconocida" 466:4387 | — | 3.5 s (supuesto) | Lienzo |
| Revisión de cajas / Escáner | Caja de otro embarque con uno activo | Modal | "Caja en otro embarque" 476:4921 | — | — | Lienzo |
| Revisión de cajas / Escáner | Caja válida | Marcar caja (verde) | Embarque en curso 565:6576 | — | — | Lienzo |
| Embarque en curso | Todas las cajas escaneadas | Modal tras 900 ms | "Embarque finalizado" 138:2557 | — | 900 ms | Lienzo ("After delay 900ms") |
| Embarque finalizado / ✓ | Tap | Cerrar embarque (+1 revisados) | Revisión de cajas vacía | — | — | Lienzo |
| Embarque finalizado / ✕ (todas las cajas escaneadas) | Tap | Confirmar finalización de la entrega | Resumen de la revisión → Finalizar entrega | — | — | Spec FR-047 + Usuario |
| Header ⋮ | Tap | Modal | Menú 618:12559 | — | — | Lienzo ("action") |
| Menú / Retirar embarque actual (con embarque en curso) | Tap | Modal | Retirar embarque 275:3425 → Selección de motivo 275:3986/275:3640 → toast "Embarque eliminado" 526:4437 | — | — | Lienzo |
| Menú / **Eliminar paquetería** (sin cajas escaneadas) | Tap | Quitar pestaña | Otra pestaña o Selección de paquetería | — | — | Usuario |
| Menú ⋮ / Ver embarques | Tap | Navegar | Lista de embarques revisados 289:3128 | — | — | Lienzo (483:5072) |
| Ver embarques / 🗑 | Tap | Retirar embarque (entrega actual) → motivo → toast | Lista actualizada 289:3425 | — | — | Lienzo (505:4150) |
| Menú ⋮ / Finalizar entrega (habilitado con embarques revisados) | Tap | Navegar | Resumen de la revisión 138:3384 | — | — | Lienzo (138:2619) |
| Resumen / comentario | Escritura | Añadir comentario | 530:6039 | — | — | Lienzo ("Añadir comentario") |
| Resumen / Finalizar entrega | Tap | Modal → ✓ | Registrando entrega 593:6263 → resumen con FOLIO ENTREGA 526:5459 + toast "Entrega finalizada" | — | 1.8 s (supuesto) | Lienzo |
| Resumen con folio / Imprimir reporte | Tap | Toast | "Imprimiendo reporte" 135:2000 | — | — | Lienzo |
| Resumen con folio / Realizar nueva entrega · Regresar a entrega en curso | Tap | Cerrar paquetería entregada | Selección / pestaña con entrega en curso | — | — | Spec FR-072 |
| Submenú / Impresión reportes 141:3647 | Tap | Navegar | Reportes del día 201:3951 | — | — | Lienzo (191:3286) |
| Reportes del día / tarjeta | Tap | Navegar | Resumen con folio 593:5558 | — | — | Lienzo |
| Reporte / Imprimir reporte | Tap | Modal 217:6299 → ✓ | Toast "Imprimiendo reporte" 217:6601 | — | — | Lienzo |
| Menú / Surtido de mercancía, Etiquetas Cross-docking | Tap | — | Sin diseño | — | — | PENDIENTE |
| Selección / tarjeta NO REGISTRADA | Tap | Modal nombre (máx. 50) → ✓ | Revisión de cajas con la paquetería capturada | — | — | Spec FR-013 |
| Revisión de cajas / Escáner | Caja de un embarque reservado por otra HH | Modal | "Embarque en revisión" | — | — | Spec FR-036 |
| Revisión de cajas / Escáner | Caja ya marcada | Ninguna (no suma ni interrumpe) | — | — | — | Spec FR-029 |
| Revisión de cajas / Escáner | Lectura correcta / error | Sonido ok / error | — | — | — | Spec FR-030 |
| Revisión de cajas (al entrar) | Embarque iniciado antes de cerrar la app | Modal "Embarque pendiente" → Continuar (conteo en cero) / Cancelar (libera) | — | — | — | Spec FR-038 |
| Selección de motivo / "Otros" | Selección | Comentario obligatorio 1–150 | — | — | — | Spec FR-042 |
| Resumen / Agregar embarque | Tap | Volver al conteo | Revisión de cajas | — | — | Spec FR-063 |
| Resumen / Ver embarques | Tap | Navegar (regresa al resumen) | Ver embarques | — | — | Spec FR-063 |
| Resumen / Finalizar entrega → ✓ | Falla al generar el ID | Toast de error, vuelve al resumen intacto | Resumen | — | — | Spec FR-067 |
| Resumen con folio / Imprimir reporte | Tap | Imprime en la impresora del proceso "Reporte del día" | Toast "Imprimiendo reporte" / "No fue posible conectarse" / "Sin impresora asignada" | — | — | Spec FR-071 |
| Reportes del día / selector de fecha | Cambio | Filtrar entregas finalizadas del día | — | — | — | Spec FR-081 |
| Botón físico Regresar | Pulsación | Ventana anterior; bloqueado con entrega en curso (toast) | — | — | — | Spec ERB-54985 |
| Botón físico Home | Pulsación | Segundo plano y regreso con el foco en la captura | — | — | — | Spec FR-104 |
| Menú / engrane | Tap | Navegar | Configuraciones 730:5261 | — | — | Lienzo (730:5303) |
| Configuraciones / Impresión · Menú / Configuración de impresoras | Tap | Navegar | Impresión (Procesos impresión) 730:5807 | Carga de estado 1.2 s | — | Lienzo (730:5922) |
| Procesos impresión / proceso | Tap | Modal | Proceso 730:6003 | — | — | Lienzo (730:6084) |
| Modal proceso / impresora disponible | Tap | Asignar → Conectando... → Conectada / Sin conexión | 730:6085 → 730:6168 | Validación 1.2 s | — | Lienzo (730:6167, 730:6251) |
| Modal proceso sin impresoras / Ir a Impresoras | Tap | Cambiar pestaña | Impresoras 730:5099 | — | — | Lienzo (730:5148) |
| Impresoras / EDITAR → 🗑 | Tap | Modal → ✓ | Impresora eliminada + toast 730:7015 | — | — | Lienzo (730:6733, 730:7013) |
| Impresoras / Nueva conexión | Tap | Navegar + búsqueda en red | Nueva conexión 730:5305 → 730:5431 | Carga 1.5 s | — | Lienzo (730:5524) |
| Nueva conexión / impresora | Tap | Modal confirmar → ✓ | Impresoras + toast "Conexión exitosa" | — | — | Lienzo (730:5712, 730:6420) |
| Nueva conexión / Agregar manualmente | Tap | Modal IP → ✓ | Confirmar 730:5619 o toast "Dirección IP inválida" | — | — | Lienzo (730:5618) |
| Nueva conexión sin resultados | — | "No encontramos impresoras" + Buscar de nuevo | 730:5149 | — | — | Lienzo |
