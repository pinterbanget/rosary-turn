// The one path every ayah takes onto a page (main reader, float card, notch):
// the file is checked against its pinned SHA-256, then each ayah is written with
// textContent only and read back to confirm it is exactly the source string.
import { QURAN_SHA256 } from './config.js';
import { parseTanzil, sha256Hex, splitBasmala } from './quran-core.js';

export async function loadText() {
  const res = await fetch('/data/quran-uthmani.txt', { cache: 'no-cache' });
  if (!res.ok) throw new Error('The Qur’an text file could not be loaded.');
  const bytes = await res.arrayBuffer();
  if ((await sha256Hex(bytes)) !== QURAN_SHA256) {
    throw new Error('The Qur’an text on disk does not match its pinned checksum, so nothing is shown. Reinstall quran-turn, or run npm run verify to see what changed.');
  }
  return parseTanzil(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
}

export function fillAyah(el, quran, surah, ayah) {
  const text = quran.bySurah[surah][ayah - 1];
  const split = splitBasmala(surah, ayah, text, quran.verses.get('1:1'));
  const doc = el.ownerDocument;
  if (split) {
    const b = doc.createElement('span');
    b.className = 'basmala';
    b.textContent = split.basmala;
    el.replaceChildren(b, doc.createTextNode(' ' + split.rest));
  } else {
    el.textContent = text;
  }
  if (el.textContent !== text) throw new Error(`Rendering check failed at ${surah}:${ayah}.`);
}
