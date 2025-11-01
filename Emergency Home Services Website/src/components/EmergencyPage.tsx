import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { AlertTriangle, Phone, MapPin, Clock } from 'lucide-react';

interface EmergencyPageProps {
  onBack: () => void;
}

export function EmergencyPage({ onBack }: EmergencyPageProps) {
  const [activatedAt, setActivatedAt] = useState<Date | null>(null);

  useEffect(() => {
    setActivatedAt(new Date());
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl text-red-600 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6" /> Emergency Mode
          </h1>
          <Button variant="outline" onClick={onBack}>Back to Dashboard</Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Emergency Activated</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Your emergency request has been activated{activatedAt ? ` at ${activatedAt.toLocaleString()}` : ''}. Stay safe while we assist you.
              </AlertDescription>
            </Alert>

            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-600" />
                    <span>Emergency Contact: 112</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-600" />
                    <span>Share accurate location with responders</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span>Keep your phone nearby and audible</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-3 pt-2">
              <Button className="bg-red-600 hover:bg-red-700">Call Now</Button>
              <Button variant="outline" onClick={onBack}>Dismiss</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


