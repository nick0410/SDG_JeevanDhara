import { useState, useEffect } from 'react';

interface LanguageConfig {
  code: string;
  name: string;
  flag: string;
  translations: Record<string, string>;
}

const languages: Record<string, LanguageConfig> = {
  en: {
    code: 'en',
    name: 'English',
    flag: '🇺🇸',
    translations: {
      'sdg_impact': 'SDG Impact',
      'verified_impact': 'Verified Impact for SDG Goals',
      'explore_ngos': 'Explore NGOs',
      'submit_problems': 'Submit Problems',
      'verify_proofs': 'Verify Proofs',
      'dashboard': 'Dashboard',
      'login': 'Login',
      'connect_wallet': 'Connect Wallet',
      'welcome_back': 'Welcome back',
      'your_impact_dashboard': 'Your Impact Dashboard',
      'ai_powered_recommendations': 'AI-Powered Recommendations',
      'blockchain_verification': 'Blockchain Verification',
      'explore_verified_ngos': 'Explore Verified NGOs',
      'submit_your_project': 'Submit Your Project',
    }
  },
  es: {
    code: 'es',
    name: 'Español',
    flag: '🇪🇸',
    translations: {
      'sdg_impact': 'Impacto ODS',
      'verified_impact': 'Impacto Verificado para Objetivos ODS',
      'explore_ngos': 'Explorar ONGs',
      'submit_problems': 'Enviar Problemas',
      'verify_proofs': 'Verificar Pruebas',
      'dashboard': 'Panel',
      'login': 'Iniciar Sesión',
      'connect_wallet': 'Conectar Billetera',
      'welcome_back': 'Bienvenido de nuevo',
      'your_impact_dashboard': 'Tu Panel de Impacto',
      'ai_powered_recommendations': 'Recomendaciones con IA',
      'blockchain_verification': 'Verificación Blockchain',
      'explore_verified_ngos': 'Explorar ONGs Verificadas',
      'submit_your_project': 'Envía tu Proyecto',
    }
  },
  hi: {
    code: 'hi',
    name: 'हिन्दी',
    flag: '🇮🇳',
    translations: {
      'sdg_impact': 'एसडीजी प्रभाव',
      'verified_impact': 'एसडीजी लक्ष्यों के लिए सत्यापित प्रभाव',
      'explore_ngos': 'एनजीओ खोजें',
      'submit_problems': 'समस्याएं भेजें',
      'verify_proofs': 'प्रमाण सत्यापित करें',
      'dashboard': 'डैशबोर्ड',
      'login': 'लॉगिन',
      'connect_wallet': 'वॉलेट कनेक्ट करें',
      'welcome_back': 'वापसी पर स्वागत है',
      'your_impact_dashboard': 'आपका प्रभाव डैशबोर्ड',
      'ai_powered_recommendations': 'एआई संचालित सिफारिशें',
      'blockchain_verification': 'ब्लॉकचेन सत्यापन',
      'explore_verified_ngos': 'सत्यापित एनजीओ खोजें',
      'submit_your_project': 'अपना प्रोजेक्ट भेजें',
    }
  },
  fr: {
    code: 'fr',
    name: 'Français',
    flag: '🇫🇷',
    translations: {
      'sdg_impact': 'Impact ODD',
      'verified_impact': 'Impact Vérifié pour les Objectifs ODD',
      'explore_ngos': 'Explorer les ONGs',
      'submit_problems': 'Soumettre des Problèmes',
      'verify_proofs': 'Vérifier les Preuves',
      'dashboard': 'Tableau de Bord',
      'login': 'Connexion',
      'connect_wallet': 'Connecter le Portefeuille',
      'welcome_back': 'Content de vous revoir',
      'your_impact_dashboard': 'Votre Tableau d\'Impact',
      'ai_powered_recommendations': 'Recommandations IA',
      'blockchain_verification': 'Vérification Blockchain',
      'explore_verified_ngos': 'Explorer les ONGs Vérifiées',
      'submit_your_project': 'Soumettez votre Projet',
    }
  }
};

export function useLanguage() {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem('sdg-language');
    if (saved && languages[saved]) {
      setCurrentLanguage(saved);
    }
  }, []);

  const changeLanguage = (langCode: string) => {
    if (languages[langCode]) {
      setCurrentLanguage(langCode);
      localStorage.setItem('sdg-language', langCode);
    }
  };

  const t = (key: string): string => {
    return languages[currentLanguage]?.translations[key] || key;
  };

  const getCurrentLanguage = () => languages[currentLanguage];
  const getAvailableLanguages = () => Object.values(languages);

  return {
    currentLanguage,
    changeLanguage,
    t,
    getCurrentLanguage,
    getAvailableLanguages
  };
}