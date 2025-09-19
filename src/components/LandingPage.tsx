import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { RainAnimation } from './RainAnimation';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useLanguage } from './LanguageProvider';
import { ArrowRight, Droplets, Leaf, TrendingUp, Users, Shield, Award, BarChart3, MapPin, Calculator, CheckCircle } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: 'landing' | 'signin' | 'signup' | 'dashboard' | 'results') => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-background border-b border-border relative">
        <RainAnimation className="absolute inset-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Droplets className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-foreground">{t('header.title')}</h1>
                <p className="text-sm text-muted-foreground">{t('header.subtitle')}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <LanguageSelector />
              <ThemeToggle />
              <Button variant="outline" onClick={() => onNavigate('signin')}>
                {t('header.signIn')}
              </Button>
              <Button onClick={() => onNavigate('signup')}>
                {t('header.startExamination')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 py-20 relative overflow-hidden">
        <RainAnimation className="absolute inset-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-800">
                {t('landing.badge')}
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                {t('landing.hero.title')}
                <span className="text-blue-600 dark:text-blue-400"> {t('landing.hero.titleAccent')}</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                {t('landing.hero.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={() => onNavigate('signup')} className="bg-blue-600 hover:bg-blue-700">
                  {t('landing.hero.startAssessment')}
                </Button>
                <Button size="lg" variant="outline">
                  {t('landing.hero.learnMore')}
                </Button>
              </div>
            </div>
            <div className="relative">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1712947090314-ca7da0b90f24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWlud2F0ZXIlMjBoYXJ2ZXN0aW5nJTIwcm9vZnRvcHxlbnwxfHx8fDE3NTc4NTA1MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Rooftop Rainwater Harvesting System"
                className="rounded-lg shadow-2xl w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 bg-white dark:bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('landing.challenge.title')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('landing.challenge.description')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>Depleting Groundwater</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Rapid urbanization and climate change are causing unprecedented groundwater depletion across India.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-yellow-600" />
                </div>
                <CardTitle>Limited Awareness</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Despite CGWB guidelines, public participation in rainwater harvesting remains limited due to lack of accessible tools.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                  <Droplets className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Untapped Potential</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Significant potential exists in both rural and urban areas for harvesting rainwater from individual rooftops.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-gray-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('landing.features.title')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {t('landing.features.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CheckCircle className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Feasibility Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Complete feasibility check for rooftop rainwater harvesting based on your location and property details.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <MapPin className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>GIS-Based Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Location-specific analysis including aquifer information, groundwater depth, and local rainfall data.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <Calculator className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Structure Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Personalized recommendations for recharge pit dimensions, trenches, and shaft specifications.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-orange-600 mb-2" />
                <CardTitle>Runoff Calculation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Accurate calculation of runoff generation capacity based on roof area and local precipitation patterns.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <Shield className="h-8 w-8 text-indigo-600 mb-2" />
                <CardTitle>Cost Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Comprehensive cost estimation and benefit analysis for informed decision-making.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <Leaf className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Environmental Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Assessment of environmental benefits and contribution to sustainable water management.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 relative overflow-hidden">
        <RainAnimation className="absolute inset-0 opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl font-bold text-white mb-4">
            {t('landing.cta.title')}
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {t('landing.cta.description')}
          </p>
          <Button size="lg" variant="secondary" onClick={() => onNavigate('signup')} className="bg-white text-blue-600 hover:bg-gray-100">
            {t('landing.cta.button')}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Droplets className="h-6 w-6 text-blue-400" />
                <span className="font-semibold">{t('header.title')}</span>
              </div>
              <p className="text-gray-400">
                Empowering communities with tools for sustainable water management and groundwater conservation.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About CGWB</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Guidelines</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Technical Manuals</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Best Practices</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Downloads</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">User Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Technical Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Feedback</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Central Ground Water Board, Government of India. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}