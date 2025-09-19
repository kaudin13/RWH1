import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi' | 'mr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations = {
  en: {
    // Header
    'header.title': 'NeerSanchay',
    'header.subtitle': 'Central Ground Water Board',
    'header.signIn': 'Sign In',
    'header.startExamination': 'Start Examination',
    
    // Landing Page
    'landing.badge': 'Government Initiative',
    'landing.hero.title': 'Rooftop Rainwater Harvesting',
    'landing.hero.titleAccent': 'Assessment Tool',
    'landing.hero.description': 'Assess your rooftop rainwater harvesting potential instantly. Get personalized recommendations for sustainable water management and groundwater conservation.',
    'landing.hero.startAssessment': 'Start Assessment',
    'landing.hero.learnMore': 'Learn More',
    
    'landing.challenge.title': 'The Challenge',
    'landing.challenge.description': 'Groundwater depletion is a critical issue affecting millions. Despite significant potential for rooftop rainwater harvesting, there\'s no accessible digital platform for individuals to assess their conservation potential.',
    
    'landing.features.title': 'Key Features',
    'landing.features.description': 'Comprehensive assessment tools powered by GIS-based and algorithmic models',
    
    'landing.cta.title': 'Ready to Assess Your Rainwater Harvesting Potential?',
    'landing.cta.description': 'Join thousands of individuals taking action for sustainable water management. Get your personalized assessment in minutes.',
    'landing.cta.button': 'Start Your Assessment Now',
    
    // Dashboard
    'dashboard.title': 'Rainwater Harvesting Assessment',
    'dashboard.step1.title': 'Personal Information',
    'dashboard.step1.description': 'Let\'s start with your contact details',
    'dashboard.step2.title': 'Location Detection',
    'dashboard.step2.description': 'We\'ll auto-detect your location and fetch local rainfall data',
    'dashboard.step3.title': 'Roof Analysis',
    'dashboard.step3.description': 'Capture or upload a photo of your roof for automatic area calculation',
    'dashboard.step4.title': 'Household Details',
    'dashboard.step4.description': 'Tell us about your water requirements',
    'dashboard.step5.title': 'Site Conditions',
    'dashboard.step5.description': 'Final details for recharge structure recommendations',
    
    // Buttons
    'button.previous': 'Previous',
    'button.next': 'Next',
    'button.generateAssessment': 'Generate Assessment',
    'button.signOut': 'Sign Out',
    
    // Camera
    'camera.title': 'Roof Analysis',
    'camera.description': 'Capture or upload a photo of your roof for automatic area calculation',
    'camera.startCamera': 'Start Camera',
    'camera.capturePhoto': 'Capture Photo',
    'camera.cancel': 'Cancel',
    'camera.analyzeRoof': 'Analyze Roof Area',
    'camera.analyzing': 'Analyzing Roof...',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
  },
  
  hi: {
    // Header
    'header.title': 'नीरसंचय',
    'header.subtitle': 'केंद्रीय भूजल बोर्ड',
    'header.signIn': 'साइन इन',
    'header.startExamination': 'परीक्षा शुरू करें',
    
    // Landing Page
    'landing.badge': 'सरकारी पहल',
    'landing.hero.title': 'छत की वर्षा जल संचयन',
    'landing.hero.titleAccent': 'मूल्यांकन उपकरण',
    'landing.hero.description': 'तुरंत अपनी छत की वर्षा जल संचयन क्षमता का आकलन करें। टिकाऊ जल प्रबंधन और भूजल संरक्षण के लिए व्यक्तिगत सुझाव प्राप्त करें।',
    'landing.hero.startAssessment': 'मूल्यांकन शुरू करें',
    'landing.hero.learnMore': 'और जानें',
    
    'landing.challenge.title': 'चुनौती',
    'landing.challenge.description': 'भूजल की कमी एक गंभीर समस्या है जो लाखों लोगों को प्रभावित कर रही है। छत की वर्षा जल संचयन की महत्वपूर्ण क्षमता के बावजूद, व्यक्तियों के लिए अपनी संरक्षण क्षमता का आकलन करने के लिए कोई सुलभ डिजिटल प्लेटफॉर्म नहीं है।',
    
    'landing.features.title': 'मुख्य विशेषताएं',
    'landing.features.description': 'जीआईएस-आधारित और एल्गोरिदमिक मॉडल द्वारा संचालित व्यापक मूल्यांकन उपकरण',
    
    'landing.cta.title': 'अपनी वर्षा जल संचयन क्षमता का आकलन करने के लिए तैयार हैं?',
    'landing.cta.description': 'टिकाऊ जल प्रबंधन के लिए कार्य करने वाले हजारों व्यक्तियों से जुड़ें। मिनटों में अपना व्यक्तिगत मूल्यांकन प्राप्त करें।',
    'landing.cta.button': 'अब अपना मूल्यांकन शुरू करें',
    
    // Dashboard
    'dashboard.title': 'वर्षा जल संचयन मूल्यांकन',
    'dashboard.step1.title': 'व्यक्तिगत जानकारी',
    'dashboard.step1.description': 'आइए आपके संपर्क विवरण से शुरुआत करते हैं',
    'dashboard.step2.title': 'स्थान का पता लगाना',
    'dashboard.step2.description': 'हम आपका स्थान अपने आप पता लगाएंगे और स्थानीय वर्षा डेटा प्राप्त करेंगे',
    'dashboard.step3.title': 'छत विश्लेषण',
    'dashboard.step3.description': 'स्वचालित क्षेत्रफल गणना के लिए अपनी छत की तस्वीर खींचें या अपलोड करें',
    'dashboard.step4.title': 'घरेलू विवरण',
    'dashboard.step4.description': 'हमें अपनी पानी की आवश्यकताओं के बारे में बताएं',
    'dashboard.step5.title': 'साइट की स्थितियां',
    'dashboard.step5.description': 'रिचार्ज संरचना सुझावों के लिए अंतिम विवरण',
    
    // Buttons
    'button.previous': 'पिछला',
    'button.next': 'अगला',
    'button.generateAssessment': 'मूल्यांकन तैयार करें',
    'button.signOut': 'साइन आउट',
    
    // Camera
    'camera.title': 'छत विश्लेषण',
    'camera.description': 'स्वचालित क्षेत्रफल गणना के लिए अपनी छत की तस्वीर खींचें या अपलोड करें',
    'camera.startCamera': 'कैमरा शुरू करें',
    'camera.capturePhoto': 'फोटो खींचें',
    'camera.cancel': 'रद्द करें',
    'camera.analyzeRoof': 'छत क्षेत्रफल का विश्लेषण करें',
    'camera.analyzing': 'छत का विश्लेषण कर रहे हैं...',
    
    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.success': 'सफलता',
    'common.cancel': 'रद्द करें',
    'common.save': 'सेव करें',
    'common.delete': 'हटाएं',
    'common.edit': 'संपादित करें',
  },
  
  mr: {
    // Header
    'header.title': 'नीरसंचय',
    'header.subtitle': 'केंद्रीय भूजल मंडळ',
    'header.signIn': 'साइन इन',
    'header.startExamination': 'परीक्षा सुरू करा',
    
    // Landing Page
    'landing.badge': 'सरकारी उपक्रम',
    'landing.hero.title': 'छतावरील पावसाचे पाणी संकलन',
    'landing.hero.titleAccent': 'मूल्यांकन साधन',
    'landing.hero.description': 'तुमच्या छतावरील पावसाचे पाणी संकलन क्षमतेचे तात्काळ मूल्यांकन करा. टिकाऊ जल व्यवस्थापन आणि भूजल संवर्धनासाठी वैयक्तिक शिफारसी मिळवा.',
    'landing.hero.startAssessment': 'मूल्यांकन सुरू करा',
    'landing.hero.learnMore': 'अधिक जाणून घ्या',
    
    'landing.challenge.title': 'आव्हान',
    'landing.challenge.description': 'भूजल कमी होणे ही लाखो लोकांना प्रभावित करणारी गंभीर समस्या आहे. छतावरील पावसाचे पाणी संकलनाची महत्त्वपूर्ण क्षमता असूनही, व्यक्तींना त्यांच्या संवर्धन क्षमतेचे मूल्यांकन करण्यासाठी कोणतेही सुलभ डिजिटल प्लॅटफॉर्म नाही.',
    
    'landing.features.title': 'मुख्य वैशिष्ट्ये',
    'landing.features.description': 'जीआयएस-आधारित आणि अल्गोरिदमिक मॉडेल्सद्वारे चालवलेली सर्वसमावेशक मूल्यांकन साधने',
    
    'landing.cta.title': 'तुमच्या पावसाचे पाणी संकलन क्षमतेचे मूल्यांकन करण्यास तयार आहात?',
    'landing.cta.description': 'टिकाऊ जल व्यवस्थापनासाठी कृती करणाऱ्या हजारो व्यक्तींमध्ये सामील व्हा. मिनिटांत तुमचे वैयक्तिक मूल्यांकन मिळवा.',
    'landing.cta.button': 'आता तुमचे मूल्यांकन सुरू करा',
    
    // Dashboard
    'dashboard.title': 'पावसाचे पाणी संकलन मूल्यांकन',
    'dashboard.step1.title': 'वैयक्तिक माहिती',
    'dashboard.step1.description': 'तुमच्या संपर्क तपशीलांपासून सुरुवात करूया',
    'dashboard.step2.title': 'स्थान शोधणे',
    'dashboard.step2.description': 'आम्ही तुमचे स्थान आपोआप शोधू आणि स्थानिक पाऊस डेटा मिळवू',
    'dashboard.step3.title': 'छत विश्लेषण',
    'dashboard.step3.description': 'स्वयंचलित क्षेत्रफळ गणनेसाठी तुमच्या छताचा फोटो काढा किंवा अपलोड करा',
    'dashboard.step4.title': 'घरगुती तपशील',
    'dashboard.step4.description': 'तुमच्या पाण्याच्या गरजांबद्दल आम्हाला सांगा',
    'dashboard.step5.title': 'साइट परिस्थिती',
    'dashboard.step5.description': 'रिचार्ज संरचना शिफारशींसाठी अंतिम तपशील',
    
    // Buttons
    'button.previous': 'मागील',
    'button.next': 'पुढील',
    'button.generateAssessment': 'मूल्यांकन तयार करा',
    'button.signOut': 'साइन आउट',
    
    // Camera
    'camera.title': 'छत विश्लेषण',
    'camera.description': 'स्वयंचलित क्षेत्रफळ गणनेसाठी तुमच्या छताचा फोटो काढा किंवा अपलोड करा',
    'camera.startCamera': 'कॅमेरा सुरू करा',
    'camera.capturePhoto': 'फोटो काढा',
    'camera.cancel': 'रद्द करा',
    'camera.analyzeRoof': 'छत क्षेत्रफळाचे विश्लेषण करा',
    'camera.analyzing': 'छताचे विश्लेषण करत आहे...',
    
    // Common
    'common.loading': 'लोड होत आहे...',
    'common.error': 'त्रुटी',
    'common.success': 'यश',
    'common.cancel': 'रद्द करा',
    'common.save': 'सेव्ह करा',
    'common.delete': 'हटवा',
    'common.edit': 'संपादित करा',
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};