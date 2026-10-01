import { RosaryState } from './rosary-sequence.js';
import { getSuggestedMysteryForToday } from './prayers.js';

export const MYSTERIES = ['joyful', 'luminous', 'sorrowful', 'glorious'];
export const LANGUAGES = ['en', 'id'];

export function calendarDay(now = new Date(), timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  const value = type => parts.find(p => p.type === type).value;
  return `${value('year')}-${value('month')}-${value('day')}`;
}

export function suggestedMystery(day = calendarDay()) {
  const [year, month, date] = day.split('-').map(Number);
  return getSuggestedMysteryForToday(new Date(year, month - 1, date, 12));
}

export function sequence(position) {
  const state = new RosaryState(position.mystery, position.language, position.prayerLanguage);
  for (let i = 0; i < position.step && !state.isComplete(); i++) state.advance();
  return state;
}

export function validPosition(input) {
  if (!input || !MYSTERIES.includes(input.mystery) || !LANGUAGES.includes(input.language)) return null;
  if (!['en', 'id', 'la'].includes(input.prayerLanguage)) return null;
  if (input.prayerLanguage !== 'la' && input.prayerLanguage !== input.language) return null;
  const max = input.language === 'id' ? 81 : 80;
  if (!Number.isInteger(input.step) || input.step < 0 || input.step > max) return null;
  return { mystery: input.mystery, step: input.step, language: input.language, prayerLanguage: input.prayerLanguage };
}

export function changeLanguage(position, language, latin = position.prayerLanguage === 'la') {
  const state = sequence(position);
  state.setLanguage(language);
  return { ...position, step: state.getTotalCount(), language, prayerLanguage: latin ? 'la' : language };
}

export const reference = p => `${p.mystery}:${p.step}/${p.language === 'id' ? 81 : 80}`;
