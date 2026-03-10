import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/Header';
import { ProjectSubmission } from '@/components/ProjectSubmission';
import { AIRecommendations } from '@/components/AIRecommendations';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Upload, 
  Brain, 
  CheckCircle, 
  Camera, 
  MapPin,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';

export default function Submit() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
            Submit Your Project
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Report problems in your community and get connected with verified NGOs working on solutions
          </p>
        </div>

        {!isAuthenticated ? (
          <Card className="glass-effect p-8 text-center mb-8">
            <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Login Required</h3>
            <p className="text-gray-300 mb-4">You need to be logged in to submit projects and track your impact</p>
            <Button 
              onClick={() => window.location.href = '/'}
              className="bg-gradient-to-r from-blue-500 to-green-500"
              data-testid="login-to-submit"
            >
              Login to Continue
            </Button>
          </Card>
        ) : null}

        {/* How it Works */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="glass-effect p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Upload className="text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">1. Submit Your Problem</h3>
            <p className="text-gray-300 text-sm">
              Describe the issue in your community with photos and location details
            </p>
          </Card>

          <Card className="glass-effect p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Brain className="text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">2. AI Smart Matching</h3>
            <p className="text-gray-300 text-sm">
              Our AI analyzes your submission and matches you with relevant NGOs
            </p>
          </Card>

          <Card className="glass-effect p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">3. Track Impact</h3>
            <p className="text-gray-300 text-sm">
              Monitor progress and verify results through blockchain transparency
            </p>
          </Card>
        </div>

        {/* Key Features */}
        <Card className="glass-effect p-8 mb-12">
          <h3 className="text-xl font-semibold text-white mb-6 text-center">Powerful Submission Features</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <Camera className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-white font-medium">Image Upload</div>
              <div className="text-gray-400 text-sm">Add visual evidence</div>
            </div>
            <div className="text-center">
              <MapPin className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-white font-medium">Location Mapping</div>
              <div className="text-gray-400 text-sm">Precise GPS tracking</div>
            </div>
            <div className="text-center">
              <Brain className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-white font-medium">AI Analysis</div>
              <div className="text-gray-400 text-sm">Smart categorization</div>
            </div>
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-white font-medium">Impact Tracking</div>
              <div className="text-gray-400 text-sm">Real-time updates</div>
            </div>
          </div>
        </Card>

        {/* AI Recommendations Section */}
        <AIRecommendations />

        {/* Project Submission Form */}
        <ProjectSubmission />
      </div>
    </div>
  );
}