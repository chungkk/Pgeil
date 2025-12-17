import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import de from '@/assets/locales/de.json';
import vi from '@/assets/locales/vi.json';
import en from '@/assets/locales/en.json';

const resources = {
  de: { translation: de },
  vi: { translation: vi },
  en: { translation: en },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'vi', // Default language (Vietnamese)
    fallbackLng: 'en',
    compatibilityJSON: 'v3',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
