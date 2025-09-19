import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Camera, Upload, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { analyzeRoofImage } from '../utils/api';

interface CameraCaptureProps {
  onRoofDataExtracted: (data: { roofArea: number; roofType: string; confidence: number }) => void;
}

export function CameraCapture({ onRoofDataExtracted }: CameraCaptureProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    roofArea: number;
    confidence: number;
    roofType: string;
  } | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      setIsCameraActive(true); // Set this immediately to show loading state
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        // Multiple ways to detect when video is ready
        const handleVideoReady = () => {
          setIsVideoReady(true);
        };
        
        videoRef.current.onloadedmetadata = handleVideoReady;
        videoRef.current.oncanplay = handleVideoReady;
        
        // Fallback: force ready state after 2 seconds
        setTimeout(() => {
          if (streamRef.current) {
            setIsVideoReady(true);
          }
        }, 2000);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please use file upload instead.');
      setIsCameraActive(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setIsVideoReady(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageDataUrl);
    stopCamera();
  }, [stopCamera]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setCapturedImage(e.target?.result as string);
      setError(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const analyzeImage = useCallback(async () => {
    if (!capturedImage) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // Convert base64 to blob
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      const file = new File([blob], 'roof-image.jpg', { type: 'image/jpeg' });

      const result = await analyzeRoofImage(file);
      setAnalysisResult(result);
      onRoofDataExtracted(result);
    } catch (err) {
      console.error('Error analyzing image:', err);
      setError('Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [capturedImage, onRoofDataExtracted]);

  const resetCapture = useCallback(() => {
    setCapturedImage(null);
    setAnalysisResult(null);
    setError(null);
    stopCamera();
  }, [stopCamera]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Camera className="h-16 w-16 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Roof Analysis</h2>
        <p className="text-muted-foreground">
          Capture or upload a photo of your roof for automatic area calculation
        </p>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {!capturedImage ? (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Camera Option */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="h-5 w-5" />
                <span>Camera Capture</span>
              </CardTitle>
              <CardDescription>Take a live photo of your roof</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isCameraActive ? (
                <Button onClick={startCamera} className="w-full">
                  <Camera className="h-4 w-4 mr-2" />
                  Start Camera
                </Button>
              ) : (
                <div className="space-y-4">
                  {!isVideoReady && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
                        <p className="text-blue-800">Initializing camera...</p>
                      </div>
                    </div>
                  )}
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full rounded-lg bg-gray-100 ${!isVideoReady ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                    style={{ aspectRatio: '16/9' }}
                  />
                  <div className="flex space-x-2">
                    <Button 
                      onClick={capturePhoto} 
                      className="flex-1"
                      disabled={!isVideoReady}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      {isVideoReady ? 'Capture Photo' : 'Preparing...'}
                    </Button>
                    <Button onClick={stopCamera} variant="outline">
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upload Option */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Upload Photo</span>
              </CardTitle>
              <CardDescription>Select an existing photo from your device</CardDescription>
            </CardHeader>
            <CardContent>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Captured Image */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Captured Image</CardTitle>
                  <CardDescription>Review your roof photo before analysis</CardDescription>
                </div>
                <Button onClick={resetCapture} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retake
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <img
                src={capturedImage}
                alt="Captured roof"
                className="w-full rounded-lg max-h-96 object-cover"
              />
            </CardContent>
          </Card>

          {/* Analysis Button */}
          {!analysisResult && (
            <Card>
              <CardContent className="pt-6">
                <Button
                  onClick={analyzeImage}
                  disabled={isAnalyzing}
                  className="w-full"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing Roof...
                    </>
                  ) : (
                    <>
                      <Camera className="h-4 w-4 mr-2" />
                      Analyze Roof Area
                    </>
                  )}
                </Button>
                <p className="text-sm text-muted-foreground text-center mt-2">
                  This may take a few seconds
                </p>
              </CardContent>
            </Card>
          )}

          {/* Analysis Results */}
          {analysisResult && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  <span>Analysis Complete</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Roof Area</p>
                    <p className="text-2xl font-bold text-green-700">
                      {analysisResult.roofArea} m²
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Roof Type</p>
                    <p className="text-lg font-semibold capitalize text-green-700">
                      {analysisResult.roofType}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Analysis Confidence</span>
                  <Badge 
                    variant={analysisResult.confidence > 0.8 ? "default" : "secondary"}
                    className="ml-2"
                  >
                    {Math.round(analysisResult.confidence * 100)}%
                  </Badge>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Great!</strong> We've automatically detected your roof area and type. 
                    These values have been filled in for you and will be used in the assessment calculations.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}