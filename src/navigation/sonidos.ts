/**
 * Sonidos de lectura (ERB-48098, FR-030): beep-ok.mp3 y beep-error.mp3 (tomados de Exodus GTM PWA).
 * Una lectura nueva interrumpe el sonido anterior (ráfaga) y nunca quita el foco de la captura (NFR-04).
 */
import beepOk from '../assets/audio/beep-ok.mp3';
import beepError from '../assets/audio/beep-error.mp3';

type Sonido = 'ok' | 'error';

const audios: Partial<Record<Sonido, HTMLAudioElement>> = {};
let actual: HTMLAudioElement | undefined;

export function reproducir(sonido: Sonido) {
  try {
    actual?.pause();
    const audio = (audios[sonido] ??= new Audio(sonido === 'ok' ? beepOk : beepError));
    audio.currentTime = 0;
    actual = audio;
    void audio.play().catch(() => {
      // Sin interacción previa el navegador bloquea el audio: se ignora.
    });
  } catch {
    // Sin soporte de audio: se ignora.
  }
}
