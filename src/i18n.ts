import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// English translations
import enNavigation from './translation/en/navigation.json';
import enSidebar from './translation/en/sidebar.json';
import enSettings from './translation/en/settings.json';
import enReceipts from './translation/en/receipts.json';
import enVehicles from './translation/en/vehicles.json';
import enCommon from './translation/en/common.json';
import enDashBoard from './translation/en/dashboard.json';
import enEmployees from './translation/en/employees.json';
import enTrips from './translation/en/trips.json';
import enAccidents from './translation/en/accidents.json';

// German translations
import deNavigation from './translation/de/navigation.json';
import deSidebar from './translation/de/sidebar.json';
import deSettings from './translation/de/settings.json';
import deReceipts from './translation/de/receipts.json';
import deVehicles from './translation/de/vehicles.json';
import deCommon from './translation/de/common.json';
import deDashBoard from './translation/de/dashboard.json';
import deEmployees from './translation/de/employees.json';
import deTrips from './translation/de/trips.json';
import deAccidents from './translation/de/accidents.json';

const resources = {
    en: {
        translation: {
            navigation: enNavigation,
            sidebar: enSidebar,
            settings: enSettings,
            receipts: enReceipts,
            vehicles: enVehicles,
            common: enCommon,
            dashboard: enDashBoard,
            employees: enEmployees,
            trips: enTrips,
            accidents: enAccidents,
        },
    },
    de: {
        translation: {
            navigation: deNavigation,
            sidebar: deSidebar,
            settings: deSettings,
            receipts: deReceipts,
            vehicles: deVehicles,
            common: deCommon,
            dashboard: deDashBoard,
            employees: deEmployees,
            trips: deTrips,
            accidents: deAccidents,
        },
    },
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
