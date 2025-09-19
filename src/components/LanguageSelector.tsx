import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useLanguage } from './LanguageProvider';
import { Languages } from 'lucide-react';

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <div className="flex items-center space-x-2">
      <Languages className="h-4 w-4 text-muted-foreground" />
      <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
        <SelectTrigger className="w-[120px] h-9">
          <SelectValue>
            {currentLanguage?.nativeName}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <div className="flex items-center space-x-2">
                <span>{lang.nativeName}</span>
                <span className="text-xs text-muted-foreground">({lang.name})</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}