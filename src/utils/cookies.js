import { setting } from '@/config/setting';
const { langKey } = setting;
import Cookies from 'js-cookie';

export function getLanguage() {
  return Cookies.get(langKey);
}

export function setLanguage(lang) {
  return Cookies.set(langKey, lang);
}
