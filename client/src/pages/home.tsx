import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/Header';
import { StatsSection } from '@/components/StatsSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { AIRecommendations } from '@/components/AIRecommendations';
import { ProjectSubmission } from '@/components/ProjectSubmission';
import { BlockchainVerification } from '@/components/BlockchainVerification';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'wouter';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  CheckCircle,
  ArrowRight,
  Globe,
  Zap 
} from 'lucide-react';

export default function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
        <Header />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Globe className="text-white text-2xl" />
            </div>
            <p className="text-gray-300">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      <Header />
      
      {/* Welcome Hero Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-green-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              Welcome back{(user as any)?.firstName ? `, ${(user as any).firstName}` : ''}!
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Your impact dashboard is ready. Track your projects, discover new opportunities, and make a difference in the world.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Link href="/submit">
              <Card className="glass-effect p-6 hover-lift transition-all duration-300 hover:bg-white/10 cursor-pointer" data-testid="quick-action-submit">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Submit New Project</h3>
                <p className="text-gray-300 text-sm mb-4">Report a problem in your community and get matched with verified NGOs</p>
                <div className="flex items-center text-blue-400 text-sm font-medium">
                  Get Started <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Card>
            </Link>

            <Link href="/dashboard">
              <Card className="glass-effect p-6 hover-lift transition-all duration-300 hover:bg-white/10 cursor-pointer" data-testid="quick-action-dashboard">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">View Dashboard</h3>
                <p className="text-gray-300 text-sm mb-4">Track your projects, view analytics, and monitor impact metrics</p>
                <div className="flex items-center text-purple-400 text-sm font-medium">
                  View Analytics <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Card>
            </Link>

            <Link href="/explore">
              <Card className="glass-effect p-6 hover-lift transition-all duration-300 hover:bg-white/10 cursor-pointer" data-testid="quick-action-explore">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4">
                  <Users className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Explore NGOs</h3>
                <p className="text-gray-300 text-sm mb-4">Discover verified organizations working on your preferred SDG goals</p>
                <div className="flex items-center text-orange-400 text-sm font-medium">
                  Explore Now <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Card>
            </Link>
          </div>

          {/* Recent Activity */}
          <Card className="glass-effect p-8 mb-12">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <CheckCircle className="text-green-400 mr-3" />
              Your Recent Activity
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <div className="text-2xl font-bold text-blue-400 mb-1">0</div>
                <div className="text-gray-400 text-sm">Projects Submitted</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <div className="text-2xl font-bold text-green-400 mb-1">0</div>
                <div className="text-gray-400 text-sm">NGOs Connected</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <div className="text-2xl font-bold text-purple-400 mb-1">0</div>
                <div className="text-gray-400 text-sm">Impact Proofs</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <div className="text-2xl font-bold text-yellow-400 mb-1">0</div>
                <div className="text-gray-400 text-sm">Communities Helped</div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-400 mb-4">Ready to make your first impact?</p>
              <Link href="/submit">
                <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                  <Zap className="w-4 h-4 mr-2" />
                  Submit Your First Project
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Platform Statistics */}
      <StatsSection />

      {/* AI Recommendations */}
      <AIRecommendations />

      {/* Features Overview */}
      <FeaturesSection />

      {/* Project Submission */}
      <ProjectSubmission />

      {/* Blockchain Verification */}
      <BlockchainVerification />

      {/* Footer */}
      <footer className="bg-black/40 border-t border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                  <Globe className="text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">JeevanDhara</h4>
                  <p className="text-sm text-gray-400">Verified Impact Platform</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Connecting communities with verified NGOs to achieve UN Sustainable Development Goals through blockchain transparency.
              </p>
            </div>

            {/* Platform Links */}
            <div>
              <h5 className="text-white font-semibold mb-4">Platform</h5>
              <ul className="space-y-2 text-sm">
                <li><Link href="/explore" className="text-gray-400 hover:text-white transition-colors">Explore NGOs</Link></li>
                <li><Link href="/submit" className="text-gray-400 hover:text-white transition-colors">Submit Problems</Link></li>
                <li><Link href="/verify" className="text-gray-400 hover:text-white transition-colors">Verify Proofs</Link></li>
                <li><Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>

            {/* SDG Goals */}
            <div>
              <h5 className="text-white font-semibold mb-4">SDG Goals</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Zero Hunger</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Good Health</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Quality Education</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Clean Water</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h5 className="text-white font-semibold mb-4">Resources</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm">
              © 2025 JeevanDhara. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">Powered by</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-300">Polygon Network</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
