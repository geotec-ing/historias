/**
 * Historias GEOTEC · receptor de la página geotec-ing.github.io/historias
 *
 * Guarda cada ficha como una fila en la hoja "Historias GEOTEC · postulaciones"
 * y los archivos en una subcarpeta dentro de la carpeta "Historias GEOTEC" de Google Drive.
 * Los pasos para ponerlo en marcha están en el README del repositorio.
 */

// Correo(s) que reciben cada historia nueva, separados por coma. Déjalo vacío si no quieres correos.
const AVISAR_A = 'practicante@geotecingenieria.com, claudia.mejia@geotecingenieria.com';

// true: el correo trae las fotos y videos adjuntos (si en total pesan hasta 20 MB; si no, trae el enlace a la carpeta).
const ADJUNTAR_ARCHIVOS = true;
const MAX_MB_ADJUNTOS = 20;

// Deben coincidir con los límites de la página.
const MAX_MB_ARCHIVO = 30;
const MAX_ARCHIVOS = 10;

const COLUMNAS = ['Fecha', 'Código', 'Nombre', 'Área', 'Correo', 'Material', 'Cuándo',
  'Qué hicimos', 'Tipo de proyecto o proceso', 'Reto resuelto', 'Aprendizaje o dato',
  'Quién participó', 'Enlace a archivos pesados', 'Carpeta de archivos', 'Archivos', 'Estado'];

/** Ejecútala una sola vez desde el editor: crea la carpeta y la hoja, y pide los permisos. */
function configurar() {
  const p = PropertiesService.getScriptProperties();
  let carpeta;
  if (p.getProperty('CARPETA_ID')) {
    carpeta = DriveApp.getFolderById(p.getProperty('CARPETA_ID'));
  } else {
    carpeta = DriveApp.createFolder('Historias GEOTEC');
    p.setProperty('CARPETA_ID', carpeta.getId());
  }
  let libro;
  if (p.getProperty('HOJA_ID')) {
    libro = SpreadsheetApp.openById(p.getProperty('HOJA_ID'));
  } else {
    libro = SpreadsheetApp.create('Historias GEOTEC · postulaciones');
    const hoja = libro.getSheets()[0];
    hoja.setName('Postulaciones');
    hoja.appendRow(COLUMNAS);
    hoja.setFrozenRows(1);
    hoja.getRange(1, 1, 1, COLUMNAS.length).setFontWeight('bold');
    DriveApp.getFileById(libro.getId()).moveTo(carpeta);
    p.setProperty('HOJA_ID', libro.getId());
  }
  Logger.log('Carpeta de Drive: ' + carpeta.getUrl());
  Logger.log('Hoja de postulaciones: ' + libro.getUrl());
}

function doGet() {
  return responder({ ok: true, servicio: 'Historias GEOTEC' });
}

function doPost(e) {
  try {
    const d = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (d.web) return responder({ ok: true, id: 'ok', token: 'ok' }); // campo trampa: lo llenan los bots
    if (d.accion === 'ficha') return responder(nuevaFicha(d));
    if (d.accion === 'archivo') return responder(guardarArchivo(d));
    if (d.accion === 'fin') return responder(cerrar(d));
    return responder({ ok: false, error: 'Acción desconocida' });
  } catch (err) {
    return responder({ ok: false, error: String((err && err.message) || err) });
  }
}

function responder(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

// Texto seguro para la hoja: recorta y evita que se interprete como fórmula.
function limpio(v, max) {
  let s = String(v == null ? '' : v).trim().slice(0, max || 3000);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function recursos() {
  const p = PropertiesService.getScriptProperties();
  const c = p.getProperty('CARPETA_ID');
  const h = p.getProperty('HOJA_ID');
  if (!c || !h) throw new Error('Falta ejecutar configurar()');
  return { carpeta: DriveApp.getFolderById(c), hoja: SpreadsheetApp.openById(h).getSheets()[0] };
}

function nuevaFicha(d) {
  if (!String(d.nombre || '').trim() || !String(d.area || '').trim() || !String(d.q1 || '').trim()) {
    return { ok: false, error: 'Faltan datos obligatorios' };
  }
  const r = recursos();
  const zona = Session.getScriptTimeZone();
  const ahora = new Date();
  const id = Utilities.formatDate(ahora, zona, 'yyMMdd') + '-' + Utilities.getUuid().slice(0, 4).toUpperCase();
  const nombreCarpeta = [Utilities.formatDate(ahora, zona, 'yyyy-MM-dd'), String(d.area).slice(0, 60),
    String(d.nombre).slice(0, 60), id].join(' · ').replace(/[\\/:*?"<>|]+/g, '_');
  const sub = r.carpeta.createFolder(nombreCarpeta);
  const token = Utilities.getUuid();
  CacheService.getScriptCache().put('t_' + id, JSON.stringify({ token: token, carpeta: sub.getId(), n: 0 }), 21600);
  const tipos = Array.isArray(d.tipos) ? d.tipos.map(function (t) { return limpio(t, 40); }).join(', ') : '';
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    r.hoja.appendRow([ahora, id, limpio(d.nombre, 120), limpio(d.area, 80), limpio(d.correo, 120), tipos,
      limpio(d.cuando, 20), limpio(d.q1), limpio(d.q2), limpio(d.q3), limpio(d.q4), limpio(d.q5),
      limpio(d.enlace, 500), sub.getUrl(), 0, 'Subiendo archivos']);
  } finally {
    lock.releaseLock();
  }
  return { ok: true, id: id, token: token };
}

function sesion(d) {
  const raw = CacheService.getScriptCache().get('t_' + String(d.id || ''));
  if (!raw) throw new Error('El envío expiró; vuelve a enviar la ficha');
  const s = JSON.parse(raw);
  if (s.token !== d.token) throw new Error('Envío no válido');
  return s;
}

function guardarArchivo(d) {
  const s = sesion(d);
  if (s.n >= MAX_ARCHIVOS) return { ok: false, error: 'Máximo ' + MAX_ARCHIVOS + ' archivos por ficha' };
  const tipo = String(d.tipo || '');
  if (!/^(image|video)\//.test(tipo)) return { ok: false, error: 'Solo se reciben fotos y videos' };
  const bytes = Utilities.base64Decode(String(d.datos || ''));
  if (!bytes.length) return { ok: false, error: 'Archivo vacío' };
  if (bytes.length > MAX_MB_ARCHIVO * 1024 * 1024) return { ok: false, error: 'Archivo de más de ' + MAX_MB_ARCHIVO + ' MB' };
  const nombre = String(d.nombre || 'archivo').replace(/[\\/:*?"<>|]+/g, '_').slice(0, 120);
  DriveApp.getFolderById(s.carpeta).createFile(Utilities.newBlob(bytes, tipo, nombre));
  s.n += 1;
  CacheService.getScriptCache().put('t_' + d.id, JSON.stringify(s), 21600);
  return { ok: true, n: s.n };
}

function cerrar(d) {
  const s = sesion(d);
  const r = recursos();
  const fallidos = Array.isArray(d.fallidos) ? d.fallidos.map(function (x) { return limpio(x, 120); }) : [];
  const celda = r.hoja.getRange('B:B').createTextFinder(String(d.id)).matchEntireCell(true).findNext();
  const fila = celda ? celda.getRow() : 0;
  if (fila) {
    const estado = fallidos.length ? 'Recibida · no llegaron ' + fallidos.length + ' archivo(s): ' + fallidos.join(', ') : 'Recibida';
    r.hoja.getRange(fila, 15, 1, 2).setValues([[s.n, estado]]);
  }
  if (AVISAR_A) avisar(d.id, r, s, fila);
  CacheService.getScriptCache().remove('t_' + d.id);
  return { ok: true, id: d.id, archivos: s.n };
}

function avisar(id, r, s, fila) {
  const carpeta = DriveApp.getFolderById(s.carpeta);
  let cuerpo = 'Llegó una historia nueva a la convocatoria Historias GEOTEC (código ' + id + ').\n\n';
  let asunto = 'Nueva historia GEOTEC · ' + id;
  let responderA = '';
  if (fila) {
    const v = r.hoja.getRange(fila, 1, 1, COLUMNAS.length).getDisplayValues()[0];
    COLUMNAS.forEach(function (c, i) {
      if (i > 0 && i < 12 && v[i] !== '') cuerpo += (i >= 7 ? '\n' : '') + c + ': ' + v[i] + '\n';
    });
    if (v[12]) cuerpo += '\nEnlace a archivos pesados: ' + v[12] + '\n';
    asunto = 'Historia GEOTEC · ' + v[3] + ' · ' + v[2];
    if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v[4])) responderA = v[4];
  }
  const adjuntos = [];
  let peso = 0;
  const archivos = carpeta.getFiles();
  while (archivos.hasNext()) {
    const f = archivos.next();
    peso += f.getSize();
    adjuntos.push(f);
  }
  const caben = ADJUNTAR_ARCHIVOS && adjuntos.length && peso <= MAX_MB_ADJUNTOS * 1024 * 1024;
  if (adjuntos.length) {
    cuerpo += '\n' + adjuntos.length + ' archivo(s)' + (caben ? ' adjunto(s) en este correo.' : ', ' + Math.round(peso / 1048576) + ' MB en total.') + '\n';
  }
  cuerpo += 'Carpeta en Drive: ' + carpeta.getUrl() + '\n';
  const opciones = { to: AVISAR_A, subject: asunto, body: cuerpo, name: 'Historias GEOTEC' };
  if (responderA) opciones.replyTo = responderA;
  if (caben) opciones.attachments = adjuntos.map(function (f) { return f.getBlob(); });
  MailApp.sendEmail(opciones);
}
