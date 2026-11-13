import { BatteryCharging, BookOpenCheck, Droplets, Headset, Map, Radar, ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Language } from '../i18n/translations';

export const media = {
  drone: '/assets/campaigns/agribot-hero-banner-new.webp',
  field: 'https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?auto=format&fit=crop&w=2200&q=85',
  crop: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=1600&q=85',
  aerial: 'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=1800&q=85',
  rows: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1800&q=85'
};

const specLabels = (language: Language) => ({
  capacity: language === 'hi' ? 'क्षमता' : language === 'mr' ? 'क्षमता' : 'Capacity',
  flight: language === 'hi' ? 'उड़ान समय' : language === 'mr' ? 'उड्डाण वेळ' : 'Flight time',
  coverage: language === 'hi' ? 'कवरेज' : language === 'mr' ? 'कव्हरेज' : 'Coverage',
  battery: language === 'hi' ? 'बैटरी' : language === 'mr' ? 'बॅटरी' : 'Battery',
  sensor: language === 'hi' ? 'सेन्सर' : language === 'mr' ? 'सेन्सर' : 'Sensor',
  training: language === 'hi' ? 'प्रशिक्षण मोड' : language === 'mr' ? 'प्रशिक्षण मोड' : 'Training mode',
  session: language === 'hi' ? 'सत्र समय' : language === 'mr' ? 'सत्र वेळ' : 'Session time',
  useCases: language === 'hi' ? 'उपयोग मामले' : language === 'mr' ? 'उपयोग प्रकरणे' : 'Use cases',
  support: language === 'hi' ? 'समर्थन' : language === 'mr' ? 'मदत' : 'Support',
});

export type Drone = {
  id: number;
  name: string;
  tag: string;
  category: string;
  description: string;
  image: string;
  specs: [string, string][];
  features: string[];
  included: string[];
  warranty: string;
};

export const getFeatures = (language: Language = 'en') => [
  { icon: Radar, title: language === 'hi' ? 'सटीकता' : language === 'mr' ? 'अचूकता' : 'Precision', text: language === 'hi' ? 'बेहतर खेत दृश्य और अधिक नियंत्रित संचालन।' : language === 'mr' ? 'चांगली शेत दृश्यता आणि अधिक नियंत्रित काम.' : 'Sharper visibility and more controlled field operations.' },
  { icon: BatteryCharging, title: language === 'hi' ? 'दक्षता' : language === 'mr' ? 'कार्यक्षमता' : 'Efficiency', text: language === 'hi' ? 'कृषि कार्यों के लिए उद्देश्यपूर्ण तकनीक।' : language === 'mr' ? 'शेतीसाठी उद्देशपूर्ण तंत्रज्ञान.' : 'Purposeful technology for demanding agricultural workflows.' },
  { icon: ShieldCheck, title: language === 'hi' ? 'समर्थन' : language === 'mr' ? 'मदत' : 'Support', text: language === 'hi' ? 'पहली पूछताछ से पोस्ट-डिलीवरी सेवा तक मार्गदर्शन।' : language === 'mr' ? 'पहिल्या प्रश्नापासून पोस्ट-डिलीव्हरी सेवा पर्यंत मदत.' : 'Guidance from the first question through post-delivery service.' }
];

export const getDrones = (language: Language = 'en'): Drone[] => {
  const labels = specLabels(language);
  const isHi = language === 'hi';
  const isMr = language === 'mr';

  return [
    {
      id: 1,
      name: isHi ? 'स्प्रेइंग सीरीज' : isMr ? 'स्प्रेअ‍िंग सीरिज' : 'SPRAYING SERIES',
      tag: isHi ? 'प्रिसिजन सीरीज' : isMr ? 'प्रिसिजन सीरिज' : 'PRECISION SERIES',
      category: isHi ? 'कृषि स्प्रेइंग ड्रोन' : isMr ? 'कृषी स्प्रेअ‍िंग ड्रोन' : 'Agricultural spraying drone',
      description: isHi ? 'आधुनिक खेतों और विविध फसलों के लिए सटीक और नियंत्रित एरियल स्प्रेइंग प्रणाली।' : isMr ? 'आधुनिक शेतांसाठी आणि विविध पिकांसाठी अचूक व नियंत्रित एरियल फवारणी प्रणाली.' : 'Precision aerial spraying engineered for targeted crop protection and uniform field coverage.',
      image: media.drone,
      specs: [
        [labels.capacity, isHi ? '10L / 16L वर्ग' : isMr ? '10L / 16L वर्ग' : '10L / 16L Class'],
        [labels.flight, isHi ? 'अनुकूलित फील्ड चक्र' : isMr ? 'अनुकूलित फील्ड चक्र' : 'Optimized Cycle'],
        [labels.coverage, isHi ? 'प्रति घंटा उच्च कवरेज' : isMr ? 'प्रति तास उच्च कव्हरेज' : 'High Field Coverage'],
        [labels.battery, isHi ? 'त्वरित स्वैप प्रणाली' : isMr ? 'वेगवान स्वॅप प्रणाली' : 'Quick-Swap System']
      ],
      features: isHi ? ['सटीक फसल स्प्रेइंग', 'खेत-तैयार वर्कफ़्लो', 'माइक्रो-ड्रॉपलेट एटमाइज़ेशन'] : isMr ? ['अचूक पीक फवारणी', 'शेत-तयार वर्कफ्लो', 'मायक्रो-ड्रॉपलेट प्रणाली'] : ['Precision crop spraying', 'Field-ready workflow', 'Micro-droplet atomization'],
      included: isHi ? ['उत्पाद परामर्श', 'फील्ड डिलीवरी व सेटअप', 'ऑपरेटर प्रशिक्षण मार्गदर्शन'] : isMr ? ['उत्पादन सल्ला', 'शेत डिलिव्हरी व सेटअप', 'ऑपरेटर प्रशिक्षण मार्गदर्शन'] : ['Product consultation', 'Field delivery & setup', 'Operator training guidance'],
      warranty: isHi ? 'मानक विनिर्माता वारंटी एवं ऑन-फील्ड सर्विस सपोर्ट' : isMr ? 'मानक निर्माता वॉरंटी आणि प्रत्यक्ष शेतावर सेवा सपोर्ट' : 'Manufacturer warranty with dedicated on-field support'
    },
    {
      id: 2,
      name: isHi ? 'मैपिंग सीरीज' : isMr ? 'मॅपिंग सीरिज' : 'MAPPING SERIES',
      tag: isHi ? 'फील्ड इंटेलिजेंस' : isMr ? 'फील्ड इंटेलिजेंस' : 'FIELD INTELLIGENCE',
      category: isHi ? 'मैपिंग और मॉनिटरिंग ड्रोन' : isMr ? 'मॅपिंग आणि मॉनिटरिंग ड्रोन' : 'Mapping and monitoring drone',
      description: isHi ? 'फसल निगरानी, खेत मानचित्रण और बेहतर निर्णयों के लिए उच्च-रिज़ॉल्यूशन एरियल दृश्यता।' : isMr ? 'पीक मॉनिटरिंग, शेत मॅपिंग आणि अचूक माहितीपूर्ण निर्णयांसाठी उच्च-दर्जाची एरियल दृश्यता.' : 'High-resolution aerial visibility for crop health monitoring, field boundary mapping and agronomic insights.',
      image: media.aerial,
      specs: [
        [labels.sensor, isHi ? 'मल्टीस्पेक्ट्रल / आरजीबी' : isMr ? 'मल्टीस्पेक्ट्रल / आरजीबी' : 'Multispectral / RGB'],
        [labels.flight, isHi ? 'विस्तारित मैपिंग उड़ान' : isMr ? 'विस्तारित मॅपिंग उड्डाण' : 'Extended Mission'],
        [labels.coverage, isHi ? 'बड़े रकबे का सर्वेक्षण' : isMr ? 'मोठ्या क्षेत्राचे सर्वेक्षण' : 'Large Acreage Survey'],
        [labels.battery, isHi ? 'इंटेलिजेंट पावर पैक' : isMr ? 'इंटेलिजंट पॉवर पॅक' : 'Intelligent Battery']
      ],
      features: isHi ? ['फील्ड मैपिंग सहायता', 'फसल स्वास्थ्य निगरानी', 'डेटा-संचालित कृषि योजना'] : isMr ? ['फील्ड मॅपिंग सहाय्य', 'पीक आरोग्य मॉनिटरिंग', 'माहिती-आधारित कृषी नियोजन'] : ['Field mapping support', 'Crop health monitoring', 'Data-driven agronomy planning'],
      included: isHi ? ['उपयोग मामला परामर्श', 'सॉफ्टवेयर वर्कफ़्लो ओरिएंटेशन', 'डेटा प्रोसेसिंग मार्गदर्शन'] : isMr ? ['उपयोग सल्ला', 'सॉफ्टवेअर वर्कफ्लो ओरिएंटेशन', 'डेटा प्रोसेसिंग मार्गदर्शन'] : ['Use-case consultation', 'Software workflow orientation', 'Data processing guidance'],
      warranty: isHi ? 'मानक वारंटी एवं तकनीकी सहायता' : isMr ? 'मानक वॉरंटी आणि तांत्रिक सहाय्य' : 'Standard warranty & technical assistance'
    },
    {
      id: 3,
      name: isHi ? 'ट्रेनिंग सीरीज' : isMr ? 'ट्रेनिंग सीरिज' : 'TRAINING SERIES',
      tag: isHi ? 'ऑपरेटर सपोर्ट' : isMr ? 'ऑपरेटर सपोर्ट' : 'OPERATOR SUPPORT',
      category: isHi ? 'प्रशिक्षण और परामर्श मंच' : isMr ? 'प्रशिक्षण आणि सल्लागार प्लॅटफॉर्म' : 'Training and consultation platform',
      description: isHi ? 'कृषि ड्रोन तकनीक अपनाने की तैयारी करने वाली टीमों और पायलटों के लिए व्यावहारिक प्रशिक्षण।' : isMr ? 'कृषी ड्रोन तंत्रज्ञान स्वीकारण्यासाठी शेतकरी आणि ऑपरेटर्ससाठी प्रत्यक्ष प्रात्यक्षिक प्रशिक्षण.' : 'Structured hands-on flight training and operational orientation for modern agricultural drone pilots.',
      image: media.crop,
      specs: [
        [labels.training, isHi ? 'डीजीसीए अनुरूप मॉड्यूल' : isMr ? 'डीजीसीए अनुरूप मॉड्यूल' : 'DGCA-Aligned Modules'],
        [labels.session, isHi ? 'व्यावहारिक फील्ड सत्र' : isMr ? 'प्रत्यक्ष प्रात्यक्षिक सत्र' : 'Practical Field Sessions'],
        [labels.useCases, isHi ? 'स्प्रेइंग व सुरक्षा मानक' : isMr ? 'फवारणी व सुरक्षा नियम' : 'Spraying & Safety SOPs'],
        [labels.support, isHi ? 'सतत ऑपरेटर मार्गदर्शन' : isMr ? 'सतत ऑपरेटर मार्गदर्शन' : 'Ongoing Operator Support']
      ],
      features: isHi ? ['ऑपरेटर प्रशिक्षण पथ', 'फील्ड वर्कफ़्लो ओरिएंटेशन', 'बैटरी व रखरखाव प्रोटोकॉल'] : isMr ? ['ऑपरेटर प्रशिक्षण मार्ग', 'शेत वर्कफ्लो नियोजन', 'बॅटरी व देखभाल नियमावली'] : ['Operator training path', 'Field workflow orientation', 'Battery & maintenance protocols'],
      included: isHi ? ['पाठ्यक्रम परामर्श', 'ऑन-साइट सिमुलेशन व उड़ान', 'सुरक्षा चेकलिस्ट'] : isMr ? ['अभ्यासक्रम सल्ला', 'ऑन-साइट उड्डाण प्रात्यक्षिक', 'सुरक्षा चेकलिस्ट'] : ['Curriculum consultation', 'On-site flight simulation', 'Safety checklist guide'],
      warranty: isHi ? 'व्यापक ऑपरेटर सहायता पैकेज' : isMr ? 'सर्वसमावेशक ऑपरेटर सहाय्य पॅकेज' : 'Comprehensive operator support package'
    }
  ];
};

export const features = getFeatures();
export const drones: Drone[] = getDrones();

export const getServices = (language: Language = 'en'): { icon: LucideIcon; title: string; text: string; image: string }[] => [
  { icon: Droplets, title: language === 'hi' ? 'प्रिसिजन स्प्रेइंग' : language === 'mr' ? 'प्रिसिजन स्प्रेअ‍िंग' : 'Precision Spraying', text: language === 'hi' ? 'आधुनिक खेती की आवश्यकताओं के लिए नियंत्रित एरियल स्प्रेइंग।' : language === 'mr' ? 'आधुनिक शेतीच्या गरजांसाठी नियंत्रित एरियल स्प्रेअ‍िंग.' : 'Controlled aerial spraying workflows for modern farming needs.', image: media.drone },
  { icon: Radar, title: language === 'hi' ? 'फसल निगरानी' : language === 'mr' ? 'पीक मॉनिटरिंग' : 'Crop Monitoring', text: language === 'hi' ? 'एरियल अवलोकन से किसान अपने खेत की स्थिति को स्पष्ट रूप से समझ सकते हैं।' : language === 'mr' ? 'एरियल निरीक्षणामुळे शेतकरी शेताची स्थिती अधिक स्पष्टपणे पाहू शकतात.' : 'Aerial observation to help farmers see field conditions more clearly.', image: media.crop },
  { icon: Map, title: language === 'hi' ? 'फील्ड मैपिंग' : language === 'mr' ? 'फील्ड मॅपिंग' : 'Field Mapping', text: language === 'hi' ? 'फील्ड-स्तरीय मैपिंग चर्चा और ड्रोन-आधारित दृश्यता।' : language === 'mr' ? 'शेत-स्तरीय मॅपिंग चर्चा आणि ड्रोन-आधारित दृश्यता.' : 'Field-level mapping conversations and drone-enabled visibility.', image: media.aerial },
  { icon: Headset, title: language === 'hi' ? 'ड्रोन परामर्श' : language === 'mr' ? 'ड्रोन सल्लामसलत' : 'Drone Consultation', text: language === 'hi' ? 'व्यावहारिक, आवश्यकता-आधारित मार्गदर्शन के साथ तकनीक चुनें।' : language === 'mr' ? 'व्यावहारिक, गरज-आधारित मार्गदर्शनासह तंत्रज्ञान निवडा.' : 'Choose technology through practical, requirement-led guidance.', image: media.field },
  { icon: BookOpenCheck, title: language === 'hi' ? 'ड्रोन प्रशिक्षण' : language === 'mr' ? 'ड्रोन प्रशिक्षण' : 'Drone Training', text: language === 'hi' ? 'व्यावहारिक ऑपरेटर उड़ान प्रशिक्षण, डीजीसीए प्रमाणन मार्गदर्शन और फील्ड सुरक्षा प्रोटोकॉल।' : language === 'mr' ? 'प्रत्यक्ष ऑपरेटर उड्डाण प्रशिक्षण, डीजीसीए प्रमाणपत्र मार्गदर्शन आणि शेत सुरक्षा नियम.' : 'Practical operator flight training, DGCA certification guidance, and field safety protocols.', image: media.rows },
  { icon: ShieldCheck, title: language === 'hi' ? 'अफ्टर-सेल्स सपोर्ट' : language === 'mr' ? 'ऑफ्टर-सेल्स सपोर्ट' : 'After-Sales Support', text: language === 'hi' ? 'पहली उड़ान के बाद सेवा निरंतरता और समर्थन।' : language === 'mr' ? 'पहिल्या उड्डाणानंतर सेवा निरंतरता आणि समर्थन.' : 'Service continuity and support after the first flight.', image: media.crop }
];

export const services = getServices();

export const getSubsidyTopics = (language: Language = 'en') => [
  language === 'hi' ? 'सब्सिडी क्या है?' : language === 'mr' ? 'सब्सिडी म्हणजे काय?' : 'What is subsidy?',
  language === 'hi' ? 'कौन अर्ह हो सकता है?' : language === 'mr' ? 'कोण पात्र असू शकतो?' : 'Who may be eligible?',
  language === 'hi' ? 'दस्तावेज़' : language === 'mr' ? 'कागदपत्रे' : 'Documents',
  language === 'hi' ? 'प्रक्रिया' : language === 'mr' ? 'प्रक्रिया' : 'Process',
  language === 'hi' ? 'सामान्य प्रश्न' : language === 'mr' ? 'FAQ' : 'FAQ'
];

export const subsidyTopics = getSubsidyTopics();

export const getGallery = (language: Language = 'en') => [
  { image: media.drone, category: language === 'hi' ? 'ड्रोन' : language === 'mr' ? 'ड्रोन्स' : 'DRONES', alt: language === 'hi' ? 'उड़ान में कृषि ड्रोन' : language === 'mr' ? 'उड्डाणात कृषी ड्रोन' : 'Agricultural drone in flight' },
  { image: media.field, category: language === 'hi' ? 'खेती' : language === 'mr' ? 'शेती' : 'FARMING', alt: language === 'hi' ? 'कृषि क्षेत्र' : language === 'mr' ? 'कृषी क्षेत्र' : 'Agricultural field' },
  { image: media.crop, category: language === 'hi' ? 'स्प्रेइंग' : language === 'mr' ? 'स्प्रेअ‍िंग' : 'SPRAYING', alt: language === 'hi' ? 'फसल क्षेत्र' : language === 'mr' ? 'पीक क्षेत्र' : 'Crop field' },
  { image: media.aerial, category: language === 'hi' ? 'फील्ड वर्क' : language === 'mr' ? 'फील्ड वर्क' : 'FIELD WORK', alt: language === 'hi' ? 'एरियल कृषि लैंडस्केप' : language === 'mr' ? 'एरियल कृषी लँडस्केप' : 'Aerial agricultural landscape' },
  { image: media.rows, category: language === 'hi' ? 'खेती' : language === 'mr' ? 'शेती' : 'FARMING', alt: language === 'hi' ? 'फसल की पंक्तियाँ' : language === 'mr' ? 'पिकांच्या ओळी' : 'Rows of crops' },
  { image: media.drone, category: language === 'hi' ? 'ड्रोन' : language === 'mr' ? 'ड्रोन्स' : 'DRONES', alt: language === 'hi' ? 'कृषि ड्रोन' : language === 'mr' ? 'कृषी ड्रोन' : 'Agricultural drone' },
  { image: media.field, category: language === 'hi' ? 'फील्ड वर्क' : language === 'mr' ? 'फील्ड वर्क' : 'FIELD WORK', alt: language === 'hi' ? 'कृषि क्षेत्र' : language === 'mr' ? 'कृषी क्षेत्र' : 'Agricultural field' }
];

export const gallery = getGallery();
