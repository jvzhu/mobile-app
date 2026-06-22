import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import es from './es.json';
import { storageGet } from '@utils/storage';
import { STORAGE_KEYS } from '@constants/storage';

const resources = {
  en: { translation: en },
  es: { translation: es },
};

const initI18n = async () => {
  const savedLanguage = await storageGet<string>(STORAGE_KEYS.LANGUAGE);

  await i18n.use(initReactI18next).init({
    resources,
    lng: savedLanguage ?? 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v3',
  });
};

initI18n();

export default i18n;
