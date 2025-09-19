import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { CameraCapture } from './CameraCapture';
import { useLanguage } from './LanguageProvider';
import { Droplets, LogOut, MapPin, Home, Users, Calculator, Camera, Navigation } from 'lucide-react';
import { getCurrentLocation, reverseGeocode, fetchRainfallData } from '../utils/api';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AssessmentData {
  name: string;
  phone: string;
  email: string;
  location: string;
  coordinates: { lat: number; lon: number } | null;
  dwellers: number;
  roofArea: number;
  roofType: string;
  openSpace: number;
  soilType: string;
  annualRainfall: number;
}

interface DashboardProps {
  user: User | null;
  onSignOut: () => void;
  onAssessmentComplete: (data: AssessmentData) => void;
  onNavigate: (page: 'landing' | 'signin' | 'signup' | 'dashboard' | 'results') => void;
}

export function Dashboard({ user, onSignOut, onAssessmentComplete, onNavigate }: DashboardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [formData, setFormData] = useState<AssessmentData>({
    name: user?.name || '',
    phone: '',
    email: user?.email || '',
    location: '',
    coordinates: null,
    dwellers: 1,
    roofArea: 0,
    roofType: '',
    openSpace: 0,
    soilType: '',
    annualRainfall: 0
  });

  const totalSteps = 5;
  const progressPercentage = (currentStep / totalSteps) * 100;

  // API key placeholder - replace with your actual API key
  const API_KEY = 'YOUR_OPENWEATHER_API_KEY_HERE';

  const handleInputChange = (field: keyof AssessmentData, value: string | number | { lat: number; lon: number } | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear location error when user manually enters location
    if (field === 'location' && typeof value === 'string' && value.length > 0) {
      setLocationError(null);
    }
  };

  const handleLocationDetection = async () => {
    setIsLoadingLocation(true);
    setLocationError(null); // Clear any previous errors
    try {
      const coords = await getCurrentLocation();
      handleInputChange('coordinates', coords);
      
      // Get address from coordinates
      const address = await reverseGeocode(coords.lat, coords.lon, API_KEY);
      handleInputChange('location', address);
      
      // Fetch rainfall data for the location
      const rainfallData = await fetchRainfallData(coords.lat, coords.lon, API_KEY);
      handleInputChange('annualRainfall', rainfallData.annual);
      
    } catch (error) {
      console.error('Location detection failed:', error);
      
      // Handle different types of geolocation errors
      let errorMessage = 'Unable to detect location. Please enter manually.';
      
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions and try again, or enter your address manually.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable. Please check your connection and try again, or enter your address manually.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again or enter your address manually.';
            break;
          default:
            errorMessage = 'Failed to detect location. Please enter your address manually.';
        }
      } else if (error instanceof Error) {
        if (error.message.includes('not supported')) {
          errorMessage = 'Location detection is not supported by your browser. Please enter your address manually.';
        } else {
          errorMessage = `Location detection failed: ${error.message}. Please enter your address manually.`;
        }
      }
      
      setLocationError(errorMessage);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleRoofDataExtracted = (roofData: { roofArea: number; roofType: string; confidence: number }) => {
    handleInputChange('roofArea', roofData.roofArea);
    handleInputChange('roofType', roofData.roofType);
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      onAssessmentComplete(formData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.phone && formData.email;
      case 2:
        return formData.location; // Allow proceeding with just location text, coordinates optional
      case 3:
        return formData.roofArea > 0 && formData.roofType;
      case 4:
        return formData.dwellers > 0;
      case 5:
        return formData.openSpace >= 0 && formData.soilType;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Personal Information</h2>
              <p className="text-muted-foreground">Let's start with your contact details</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email address"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Location Detection</h2>
              <p className="text-muted-foreground">We'll auto-detect your location and fetch local rainfall data</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="location">Address</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Enter your address or use auto-detect"
                    readOnly={isLoadingLocation}
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <Button
                    onClick={handleLocationDetection}
                    disabled={isLoadingLocation}
                    className="h-10"
                  >
                    {isLoadingLocation ? (
                      <>
                        <Navigation className="h-4 w-4 mr-2 animate-spin" />
                        Detecting...
                      </>
                    ) : (
                      <>
                        <Navigation className="h-4 w-4 mr-2" />
                        Auto-Detect
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {formData.coordinates && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-green-800">Location Detected!</p>
                      <p className="text-sm text-green-600">
                        Lat: {formData.coordinates.lat.toFixed(4)}, Lon: {formData.coordinates.lon.toFixed(4)}
                      </p>
                      {formData.annualRainfall > 0 && (
                        <p className="text-sm text-green-600">
                          Annual Rainfall: {formData.annualRainfall}mm
                        </p>
                      )}
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      Location Set
                    </Badge>
                  </div>
                </div>
              )}

              {locationError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="font-medium text-red-800">{locationError}</p>
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return <CameraCapture onRoofDataExtracted={handleRoofDataExtracted} />;

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Home className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Household Details</h2>
              <p className="text-muted-foreground">Tell us about your water requirements</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="dwellers">Number of People in Household</Label>
                <Input
                  id="dwellers"
                  type="number"
                  min="1"
                  value={formData.dwellers}
                  onChange={(e) => handleInputChange('dwellers', parseInt(e.target.value) || 1)}
                  placeholder="Enter number of people"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  This helps calculate daily water requirements for your household
                </p>
              </div>

              {formData.roofArea > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="font-medium text-blue-800">Roof Information</p>
                  <p className="text-sm text-blue-600">
                    Area: {formData.roofArea}m² | Type: {formData.roofType}
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Calculator className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Site Conditions</h2>
              <p className="text-muted-foreground">Final details for recharge structure recommendations</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="openSpace">Available Open Space (square meters)</Label>
                <Input
                  id="openSpace"
                  type="number"
                  min="0"
                  value={formData.openSpace || ''}
                  onChange={(e) => handleInputChange('openSpace', parseFloat(e.target.value) || 0)}
                  placeholder="Enter available open space"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Space available for recharge structures like pits or trenches
                </p>
              </div>
              
              <div>
                <Label htmlFor="soilType">Soil Type</Label>
                <Select value={formData.soilType} onValueChange={(value) => handleInputChange('soilType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select soil type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clay">Clay</SelectItem>
                    <SelectItem value="loam">Loam</SelectItem>
                    <SelectItem value="sandy">Sandy</SelectItem>
                    <SelectItem value="rocky">Rocky</SelectItem>
                    <SelectItem value="alluvial">Alluvial</SelectItem>
                    <SelectItem value="unknown">Not Sure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Droplets className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-foreground">NeerSanchay</h1>
                <p className="text-sm text-muted-foreground">Assessment Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <ThemeToggle />
              <div className="text-right">
                <p className="font-medium">{user?.name}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
              <Button variant="outline" size="sm" onClick={onSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Rainwater Harvesting Assessment</CardTitle>
                <CardDescription>Step {currentStep} of {totalSteps}</CardDescription>
              </div>
              <Badge variant="secondary">
                {Math.round(progressPercentage)}% Complete
              </Badge>
            </div>
            <Progress value={progressPercentage} className="w-full" />
          </CardHeader>
        </Card>

        {/* Form Section */}
        <Card>
          <CardContent className="p-8">
            {renderStep()}
            
            <Separator className="my-8" />
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {currentStep === totalSteps ? 'Generate Assessment' : 'Next'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}