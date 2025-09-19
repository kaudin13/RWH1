import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { 
  Droplets, 
  LogOut, 
  Download, 
  Share, 
  CheckCircle, 
  AlertTriangle,
  BarChart3,
  Calculator,
  MapPin,
  TrendingUp
} from 'lucide-react';

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

interface AssessmentResultsProps {
  data: AssessmentData | null;
  user: User | null;
  onNavigate: (page: 'landing' | 'signin' | 'signup' | 'dashboard' | 'results') => void;
  onSignOut: () => void;
}

export function AssessmentResults({ data, user, onNavigate, onSignOut }: AssessmentResultsProps) {
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No assessment data available</p>
      </div>
    );
  }

  // Enhanced calculations based on real data
  const runoffCoefficient = data.roofType === 'concrete' ? 0.85 : 
                           data.roofType === 'tile' ? 0.75 : 0.65;
  
  const annualHarvestPotential = (data.roofArea * data.annualRainfall * runoffCoefficient) / 1000; // in cubic meters
  const dailyWaterRequirement = data.dwellers * 150; // 150 liters per person per day
  const annualWaterRequirement = (dailyWaterRequirement * 365) / 1000; // in cubic meters
  
  const feasibilityScore = Math.min((annualHarvestPotential / annualWaterRequirement) * 100, 100);
  
  // Enhanced structure recommendations based on real data
  const calculateStructures = () => {
    const structures = [];
    
    // Recharge Pit Calculations (Based on CGWB guidelines)
    const rechargePitVolume = annualHarvestPotential * 0.1; // 10% of annual harvest for pit sizing
    const standardPitVolume = 27; // 3m x 3m x 3m = 27 cubic meters
    const rechargePitQuantity = Math.max(1, Math.ceil(rechargePitVolume / standardPitVolume));
    
    // Cost calculation based on soil type and dimensions
    const rechargePitBaseCost = 12000; // Base cost for construction
    const soilMultiplier = data.soilType === 'rocky' ? 1.5 : 
                          data.soilType === 'clay' ? 1.2 : 
                          data.soilType === 'sandy' ? 0.9 : 1.0;
    const rechargePitCost = rechargePitBaseCost * soilMultiplier;
    
    if (data.openSpace >= rechargePitQuantity * 10) { // Need 10 sqm per pit
      structures.push({
        type: 'Recharge Pit',
        dimensions: '3m × 3m × 3m',
        quantity: rechargePitQuantity,
        cost: Math.round(rechargePitCost),
        description: 'Suitable for direct groundwater recharge',
        capacity: standardPitVolume
      });
    }
    
    // Percolation Tank Calculations
    if (data.openSpace >= 50 && annualHarvestPotential > 20) {
      const percolationTankVolume = 50; // 5m x 5m x 2m = 50 cubic meters
      const percolationTankQuantity = Math.ceil(annualHarvestPotential / 50);
      const maxTanks = Math.floor(data.openSpace / 50); // Need 50 sqm per tank
      const finalTankQuantity = Math.min(percolationTankQuantity, maxTanks, 2);
      
      if (finalTankQuantity > 0) {
        const percolationTankBaseCost = 28000;
        const percolationTankCost = percolationTankBaseCost * soilMultiplier;
        
        structures.push({
          type: 'Percolation Tank',
          dimensions: '5m × 5m × 2m',
          quantity: finalTankQuantity,
          cost: Math.round(percolationTankCost),
          description: 'For higher capacity recharge and water storage',
          capacity: percolationTankVolume
        });
      }
    }
    
    // Filter Strips for larger areas
    if (data.roofArea > 150 && data.openSpace > 30) {
      const filterStripLength = Math.min(data.openSpace / 2, 20); // Max 20m length
      const filterStripCost = 500 * filterStripLength; // ₹500 per meter
      
      structures.push({
        type: 'Filter Strip',
        dimensions: `${filterStripLength}m × 1m × 0.5m`,
        quantity: 1,
        cost: filterStripCost,
        description: 'Pre-treatment for water quality improvement',
        capacity: filterStripLength * 0.5
      });
    }
    
    // First Flush Diverter (always recommended)
    const diverterCost = data.roofArea > 100 ? 8000 : 5000;
    structures.push({
      type: 'First Flush Diverter',
      dimensions: 'As per roof area',
      quantity: 1,
      cost: diverterCost,
      description: 'Essential for water quality management',
      capacity: 1
    });
    
    return structures;
  };
  
  const rechargeStructures = calculateStructures();
  const totalCost = rechargeStructures.reduce((sum, structure) => sum + (structure.cost * structure.quantity), 0);
  
  // Add maintenance and additional costs
  const maintenanceCostAnnual = totalCost * 0.05; // 5% of construction cost annually
  const totalProjectCost = totalCost + (totalCost * 0.15); // Add 15% for permits, supervision, etc.

  const getFeasibilityStatus = () => {
    if (feasibilityScore >= 80) return { status: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (feasibilityScore >= 60) return { status: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (feasibilityScore >= 40) return { status: 'Moderate', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { status: 'Limited', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  const feasibilityStatus = getFeasibilityStatus();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Droplets className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-foreground">NeerSanchay</h1>
                <p className="text-sm text-muted-foreground">Assessment Results</p>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessment Results</h1>
              <p className="text-xl text-gray-600">for {data.name} - {data.location}</p>
            </div>
            
            <div className="flex space-x-3">
              <Button variant="outline">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            </div>
          </div>
        </div>

        {/* Feasibility Overview */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <span>Feasibility Assessment</span>
                </CardTitle>
                <CardDescription>Overall rainwater harvesting potential for your property</CardDescription>
              </div>
              <Badge className={`${feasibilityStatus.bgColor} ${feasibilityStatus.color} text-sm px-3 py-1`}>
                {feasibilityStatus.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Feasibility Score</span>
                  <span>{Math.round(feasibilityScore)}%</span>
                </div>
                <Progress value={feasibilityScore} className="h-3" />
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{Math.round(annualHarvestPotential)}</div>
                  <div className="text-sm text-muted-foreground">Cubic meters/year</div>
                  <div className="text-xs text-muted-foreground mt-1">Harvest Potential</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{Math.round(annualWaterRequirement)}</div>
                  <div className="text-sm text-muted-foreground">Cubic meters/year</div>
                  <div className="text-xs text-muted-foreground mt-1">Water Requirement</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">₹{totalProjectCost.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Implementation Cost</div>
                  <div className="text-xs text-muted-foreground mt-1">Estimated Total</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Results Tabs */}
        <Tabs defaultValue="structures" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="structures">Structures</TabsTrigger>
            <TabsTrigger value="calculations">Calculations</TabsTrigger>
            <TabsTrigger value="location">Location Data</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="structures">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5" />
                  <span>Recommended Recharge Structures</span>
                </CardTitle>
                <CardDescription>
                  Structures recommended based on your available space and soil conditions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {rechargeStructures.map((structure, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{structure.type}</h3>
                          <p className="text-sm text-muted-foreground">Dimensions: {structure.dimensions}</p>
                          <p className="text-xs text-muted-foreground mt-1">{structure.description}</p>
                        </div>
                        <Badge variant="secondary">
                          Qty: {structure.quantity}
                        </Badge>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium">Cost per unit</p>
                          <p className="text-lg">₹{structure.cost.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Total cost</p>
                          <p className="text-lg font-bold">₹{(structure.cost * structure.quantity).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Capacity</p>
                          <p className="text-lg">{structure.capacity > 1 ? `${structure.capacity}m³` : 'Variable'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calculations">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Detailed Calculations</span>
                </CardTitle>
                <CardDescription>
                  Technical calculations used for your assessment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Harvest Potential</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Roof Area:</span>
                          <span>{data.roofArea} sq.m</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Annual Rainfall:</span>
                          <span>{data.annualRainfall} mm</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Runoff Coefficient:</span>
                          <span>{runoffCoefficient}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-medium">
                          <span>Annual Harvest:</span>
                          <span>{Math.round(annualHarvestPotential)} cubic meters</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold">Water Requirement</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Household Members:</span>
                          <span>{data.dwellers}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Per Person/Day:</span>
                          <span>150 liters</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Daily Requirement:</span>
                          <span>{dailyWaterRequirement} liters</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-medium">
                          <span>Annual Requirement:</span>
                          <span>{Math.round(annualWaterRequirement)} cubic meters</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="location">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Location-Specific Data</span>
                </CardTitle>
                <CardDescription>
                  Geological and meteorological data for your location
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Geological Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Soil Type:</span>
                        <Badge variant="outline">{data.soilType}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Principal Aquifer:</span>
                        <span>Alluvial deposits</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Depth to Groundwater:</span>
                        <span>15-25 meters</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Water Quality:</span>
                        <span>Good</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Climate Data</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Annual Rainfall:</span>
                        <span>{data.annualRainfall} mm</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monsoon Period:</span>
                        <span>Jun - Sep</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Peak Rainfall Month:</span>
                        <span>August</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Evaporation Rate:</span>
                        <span>Moderate</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Implementation Recommendations</span>
                </CardTitle>
                <CardDescription>
                  Step-by-step guidance for implementing your rainwater harvesting system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">1</div>
                      <div>
                        <h4 className="font-medium">Site Preparation</h4>
                        <p className="text-sm text-muted-foreground">
                          Conduct soil permeability test and mark locations for recharge structures. Ensure proper drainage from roof to collection points.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">2</div>
                      <div>
                        <h4 className="font-medium">Gutter and Downpipe Installation</h4>
                        <p className="text-sm text-muted-foreground">
                          Install proper gutters with leaf guards and connect to first-flush diverters to ensure water quality.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">3</div>
                      <div>
                        <h4 className="font-medium">Recharge Structure Construction</h4>
                        <p className="text-sm text-muted-foreground">
                          Construct recharge pits with proper filtration layers (gravel, sand, brick chips) as per recommended dimensions.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">4</div>
                      <div>
                        <h4 className="font-medium">Regular Maintenance</h4>
                        <p className="text-sm text-muted-foreground">
                          Clean gutters and first-flush diverters before monsoon. Check and clean recharge structures annually.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800">Important Considerations</h4>
                        <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                          <li>• Obtain necessary permits from local authorities before construction</li>
                          <li>• Ensure structures are at least 3 meters from building foundation</li>
                          <li>• Consider groundwater levels and avoid contamination sources</li>
                          <li>• Regular water quality testing is recommended</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <Button variant="outline" onClick={() => onNavigate('dashboard')}>
            New Assessment
          </Button>
          <Button onClick={() => window.print()}>
            Print Report
          </Button>
        </div>
      </div>
    </div>
  );
}