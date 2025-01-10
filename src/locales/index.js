import { createI18n } from 'vue-i18n';

import { setting } from '@/config/setting';
import { getLanguage, setLanguage } from '@/utils/cookies';

import elementEnLocale from 'element-plus/lib/locale/lang/en';
import elementViLocale from 'element-plus/lib/locale/lang/vi';
import elementZhTwLocale from 'element-plus/lib/locale/lang/zh-tw';

import enLocale from './lang/en';
import viLocale from './lang/vi';
import zhTwLocale from './lang/zh-tw';

const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale,
  },
  vi: {
    ...viLocale,
    ...elementViLocale,
  },
  'zh-tw': {
    ...zhTwLocale,
    ...elementZhTwLocale,
  },
};

export const getLocale = () => {
  const cookieLanguage = getLanguage();
  if (cookieLanguage) {
    return cookieLanguage;
  }
  const language = navigator.language.toLowerCase();
  const locales = Object.keys(messages);
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      return locale;
    }
  }

  const { lang } = setting;
  return lang;
};

const defaultLanguage = getLocale();
typeof getLanguage() === 'undefined' ? setLanguage(defaultLanguage) : null;

const i18n = createI18n({
  locale: defaultLanguage,
  messages: messages,
});

export default i18n;
