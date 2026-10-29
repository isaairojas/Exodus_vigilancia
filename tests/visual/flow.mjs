// Recorre el flujo funcional completo (Figma + spec ERB-45370) y guarda capturas en tests/visual/__diff__/flow-*.png
// Uso: npm run preview (en otra terminal) y luego `node tests/visual/flow.mjs [baseUrl]`
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import { embarques } from './fixtures.mjs';

const base = process.argv[2] ?? 'http://localhost:4173';
const b = await chromium.launch({ channel: 'msedge' });
const p = await b.newPage({ viewport: { width: 1400, height: 900 } });
const errores = [];
p.on('pageerror', (e) => errores.push(e.message));

for (const f of fs.readdirSync('tests/visual/__diff__')) if (f.startsWith('flow-')) fs.unlinkSync(`tests/visual/__diff__/${f}`);

let paso = 0;
const shot = async (n) => {
  await p.waitForTimeout(250);
  await p.locator('.device').screenshot({ path: `tests/visual/__diff__/flow-${String(++paso).padStart(2, '0')}-${n}.png` });
  console.log('ok', n);
};
const device = p.locator('.device');
const panel = p.locator('.demo-panel');
const fallo = async (m) => {
  await p.screenshot({ path: 'tests/visual/__diff__/flow-error.png' });
  throw new Error(m);
};
const expectText = async (t) => {
  try {
    await device.getByText(t, { exact: false }).first().waitFor({ state: 'visible', timeout: 2000 });
  } catch {
    await fallo(`No se ve: ${t}`);
  }
};
const expectNoText = async (t) => {
  if (await device.getByText(t, { exact: false }).count()) throw new Error(`No debería verse: ${t}`);
};
const assert = (c, m) => {
  if (!c) throw new Error(m);
};
const escanear = async (etiqueta) => {
  await device.getByLabel('Etiqueta de caja').fill(etiqueta);
  await device.getByLabel('Etiqueta de caja').press('Enter');
};
const boton = (name) => device.getByRole('button', { name, exact: true });
const cerrarToast = async () => {
  if (await device.locator('.ds-toast').count()) await device.locator('.ds-toast').getByRole('button', { name: 'Cerrar' }).click();
};
const iniciarSesion = async (usuario) => {
  if (usuario) await device.getByLabel('Usuario').fill(usuario);
  await boton('Iniciar sesión').click();
};
const [tab, gdl, cdmx] = embarques;

await p.goto(`${base}/#/`);
await p.evaluate(() => localStorage.clear());
await p.reload();

// --- Acceso por rol (ERB-48103) ---
await iniciarSesion();
await device.getByRole('button', { name: /Revisión paqueterías/ }).click();
await boton('Revisión de cajas').click();
await expectText('Revisión de cajas');
assert((await device.locator('.ds-courier-card').first().innerText()).includes('3 GUERRAS'), 'El listado debe iniciar con la paquetería más usada');
await shot('seleccion-por-frecuencia');

// --- Paquetería no registrada (ERB-48101) ---
await boton('NO REGISTRADA').click();
await expectText('Paquetería no registrada');
assert(await boton('Confirmar').isDisabled(), 'Sin nombre no se confirma');
await device.getByLabel('Nombre de la paquetería').fill('Mensajería local');
await shot('modal-no-registrada');
await boton('Confirmar').click();
await expectText('MENSAJERÍA LOCAL');
await shot('paqueteria-no-registrada');
await boton('Menú').click();
await boton('Eliminar paquetería').click();
await expectText('Revisión de cajas');

// --- Escaneo y restricciones (ERB-48098) ---
await boton('3 GUERRAS').click();
await expectText('Escanea una caja');
await shot('revision-vacia');
// Sin embarques finalizados, "Ver embarques" está deshabilitado
await boton('Menú').click();
assert(await boton('Ver embarques').isDisabled(), 'Ver embarques debe estar deshabilitado sin embarques finalizados');
await shot('menu-sin-embarques');
await boton('Cancelar').click();

await escanear('12345');
await expectText('Etiqueta no reconocida');
await shot('toast-no-reconocida');
await cerrarToast();

await escanear(cdmx[0]);
await expectText('Embarque en otra paquetería');
await shot('modal-otra-paqueteria');
await boton('Cancelar').click();

await escanear(tab[2]);
await expectText('TAB - Villahermosa');
await escanear(tab[2]); // repetida: no suma ni interrumpe (FR-029)
await expectNoText('Caja ya escaneada');
assert((await device.locator('.ds-modal').count()) === 0, 'Una caja repetida no abre modales');
await shot('embarque-en-curso');

await escanear(gdl[0]);
await expectText('Caja en otro embarque');
await shot('modal-otro-embarque');
await boton('Cancelar').click();

// Regresar bloqueado con entrega en curso (ERB-54985)
await panel.getByRole('button', { name: '◀ Regresar' }).click();
await expectText('No es posible regresar');
await expectText('TAB - Villahermosa');
await shot('regresar-bloqueado');
await cerrarToast();

// Ráfaga de 5 lecturas desde el panel (ESC-03)
await panel.locator('section', { hasText: 'FOLIO EMB: 1301715' }).getByRole('button', { name: 'Ráfaga ×5' }).click();
await p.waitForTimeout(500);
assert((await panel.locator('section', { hasText: 'FOLIO EMB: 1301715' }).locator('.demo-panel__row--ok').count()) === 6, 'La ráfaga debe marcar 5 cajas más');
await shot('rafaga');
for (const e of tab) await escanear(e);
await p.waitForTimeout(1100);
await expectText('Embarque finalizado');
await shot('modal-embarque-finalizado');
await boton('Confirmar').click();
await expectText('Escanea una caja');

// Embarque reservado en otra HH (FR-036)
await panel.locator('section', { hasText: 'FOLIO EMB: 1301926' }).getByLabel('Reservado en otra HH').check();
await escanear(gdl[0]);
await expectText('Embarque en revisión');
await shot('modal-reservado');
await boton('Cancelar').click();
// La reserva vence en 24 h: después el embarque queda libre
await panel.getByRole('button', { name: 'Adelantar 24 h (vencer reservas)' }).click();
assert(!(await panel.locator('section', { hasText: 'FOLIO EMB: 1301926' }).getByLabel('Reservado en otra HH').isChecked()), 'La reserva debió vencer');

// Retiro de embarque en curso con motivo "Otros" (ERB-48095)
await escanear(gdl[0]);
await boton('Menú').click();
await expectText('Retirar embarque actual');
await shot('menu-retirar');
await boton('Retirar embarque actual').click();
await boton('Confirmar').click();
await device.getByLabel('Motivo', { exact: true }).selectOption('Otros');
assert(await boton('Confirmar').isDisabled(), '"Otros" sin comentario no se confirma');
await device.getByLabel('Comentario del motivo').fill('   ');
assert(await boton('Confirmar').isDisabled(), 'Solo espacios no cuenta como comentario');
await device.getByLabel('Comentario del motivo').fill('Caja abierta en andén');
await expectText('21/50');
await shot('modal-motivo-otros');
await boton('Confirmar').click();
await expectText('Embarque eliminado');
await cerrarToast();

// Embarque pendiente al reabrir la app (FR-038)
await escanear(gdl[0]);
await escanear(gdl[1]);
await panel.getByRole('button', { name: 'Cerrar y reabrir app' }).click();
await p.waitForLoadState();
await iniciarSesion();
await device.getByRole('button', { name: /Revisión paqueterías/ }).click();
await expectText('Embarque pendiente');
await shot('modal-pendiente');
await boton('Continuar').click();
await expectText('GDL - Guadalajara');
for (const e of gdl) await escanear(e);
await p.waitForTimeout(1100);
await expectText('Embarque finalizado');
// La X lleva al resumen del conteo (FR-047)
await boton('Cancelar').click();
await expectText('Resumen de la revisión');
await expectText('Usuario');
await shot('resumen-revision');

// Ver embarques desde el resumen y regreso al resumen
await boton('Ver embarques').click();
await expectText('1301715');
await shot('ver-embarques');
await boton('Atrás').click();
await expectText('Resumen de la revisión');

// Falla al generar el ID (FR-067) y reintento
await device.getByPlaceholder('Añadir un comentario').fill('Recibió chofer de 3GUERRAS Alberto Gonzalez con placas de Michoacán.');
await panel.getByLabel('Falla al generar el ID de entrega').check();
await boton('Finalizar entrega').click();
await expectText('TRES GUERRAS');
await boton('Confirmar').click();
await expectText('Registrando entrega');
await device.getByText('No se pudo finalizar la entrega').waitFor({ timeout: 5000 });
assert((await device.getByPlaceholder('Añadir un comentario').inputValue()).startsWith('Recibió chofer'), 'Se perdió el comentario');
await shot('error-folio');
await cerrarToast();
await panel.getByLabel('Falla al generar el ID de entrega').uncheck();
await boton('Finalizar entrega').click();
await boton('Confirmar').click();
await device.getByText('FOLIO ENTREGA').waitFor({ timeout: 5000 });
await expectText('Entrega finalizada');
await expectText('Realizar nueva entrega');
await shot('entrega-finalizada');
await cerrarToast();
// La impresora asignada al proceso no responde (730:5849)
await boton('Imprimir reporte').click();
await expectText('No se pudo imprimir');
await cerrarToast();
await boton('Realizar nueva entrega').click();
await device.getByPlaceholder('Buscar paquetería').waitFor();

// Segunda entrega: sin escaneos se puede salir con Regresar
await boton('PAQUETE EXPRESS').click();
await escanear(cdmx[0]);
await boton('Menú').click();
await boton('Retirar embarque actual').click();
await boton('Confirmar').click();
await device.getByLabel('Motivo', { exact: true }).selectOption('Cajas rotas');
await boton('Confirmar').click();
await cerrarToast();
await panel.getByRole('button', { name: '◀ Regresar' }).click();
await expectText('Revisión paqueterías');

// --- Resumen del día (ERB-48105) ---
await boton('Impresión reportes').click();
await expectText('Reportes del día');
await expectNoText('TRANSPORTE INTERNO');
await shot('reportes-del-dia');
const ayer = await p.evaluate(() => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
});
await device.getByLabel('Fecha del reporte').fill(ayer);
await expectText('TRANSPORTE INTERNO');
await shot('reportes-ayer');
await device.locator('.ds-reporte').first().click();
await expectText('FOLIO ENTREGA');
await boton('Imprimir reporte').click();
await expectText('¿Deseas imprimir el reporte');
await boton('Confirmar').click();
await expectText('No se pudo imprimir');
await cerrarToast();

// --- Configuración de impresoras por proceso (ERB-54938, Figma 730:5304) ---
await boton('Regresar').click();
await boton('Atrás').click();
await boton('Menú').click();
await boton('Configuraciones').click();
await expectText('Procesos de impresión y gestión de impresoras');
await shot('configuraciones');
await device.getByRole('button', { name: /^Impresión Procesos/ }).click();
await p.waitForTimeout(1400);
await expectText('Exodus vigilancia');
await shot('procesos-impresion');
await device.locator('.ds-proceso').first().click();
await expectText('Imprimiendo desde');
await expectText('Sin conexión');
await shot('modal-proceso');
await boton('Zebra ZD620').click();
await expectText('Conectando...');
await p.waitForTimeout(1400);
await expectText('Conectada');
await shot('proceso-conectado');
await boton('Cancelar').click();

await device.getByRole('tab', { name: 'Impresoras' }).click();
const nombres = await device.locator('.ds-impresora__nombre').allInnerTexts();
assert(JSON.stringify(nombres) === JSON.stringify([...nombres].sort((a, b) => a.localeCompare(b, 'es'))), 'Impresoras en orden alfabético');
await shot('impresoras');
await boton('Editar').click();
await device.getByRole('button', { name: 'Eliminar Dymo LabelWriter 450' }).click();
await expectText('se quitará de todos los procesos');
await shot('modal-eliminar-impresora');
await boton('Confirmar').click();
await expectText('Impresora eliminada');
await cerrarToast();
await boton('Listo').click();

await boton('Nueva conexión').click();
await expectText('Seleccione una impresora');
await shot('nueva-conexion-buscando');
await boton('Zebra ZD411').waitFor({ timeout: 4000 });
await shot('nueva-conexion-lista');
await boton('Zebra ZD411').click();
await expectText('¿Deseas agregar esta impresora a tu lista?');
await shot('modal-nueva-conexion');
await boton('Confirmar').click();
await expectText('Conexión exitosa');
await expectText('Zebra ZD411');
await shot('impresora-agregada');
await cerrarToast();

await boton('Nueva conexión').click();
await boton('Agregar manualmente').click();
await device.getByLabel('IP de la impresora').fill('1.2.3');
await boton('Confirmar').click();
await expectText('Dirección IP inválida');
await shot('ip-invalida');
await boton('Cancelar').click();
await panel.getByLabel('Sin impresoras en la red').check();
await panel.getByRole('button', { name: '◀ Regresar' }).click();
await boton('Nueva conexión').click();
await device.getByText('No encontramos impresoras').waitFor({ timeout: 4000 });
await expectText('Buscar de nuevo');
await shot('sin-impresoras-en-red');
await panel.getByLabel('Sin impresoras en la red').uncheck();

// Home: la app pasa a segundo plano y vuelve sin perder el avance (FR-104)
await panel.getByRole('button', { name: '● Home' }).click();
await expectText('App en segundo plano');
await device.getByText('App en segundo plano').waitFor({ state: 'detached', timeout: 4000 });
await expectText('Nueva conexión');

// --- Usuario sin rol Vigilancia ---
await panel.getByRole('button', { name: '◀ Regresar' }).click();
await panel.getByRole('button', { name: '◀ Regresar' }).click();
await panel.getByRole('button', { name: '◀ Regresar' }).click();
await boton('Salir').click();
await iniciarSesion('600000');
await expectText('Menú');
assert((await device.getByRole('button', { name: /Revisión paqueterías/ }).count()) === 0, 'Sin rol no se muestra Revisión paqueterías');
await shot('menu-sin-rol');

if (errores.length) throw new Error(errores.join('\n'));
console.log(`Flujo completo OK (${paso} capturas)`);
await b.close();
