import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { StatsSection } from '@/components/StatsSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { AIRecommendations } from '@/components/AIRecommendations';
import { ProjectSubmission } from '@/components/ProjectSubmission';
import { BlockchainVerification } from '@/components/BlockchainVerification';
import { AuthModal } from '@/components/AuthModal';
import { NotificationContainer, useNotifications } from '@/components/ui/notification';
import { Globe } from 'lucide-react';

export default function Landing() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      <Header />
      
      {/* Hero Section */}
      <Hero />

      {/* Statistics Dashboard */}
      <StatsSection />

      {/* Features Grid */}
      <FeaturesSection />

      {/* AI Recommendation Interface */}
      <AIRecommendations />

      {/* Project Submission Form */}
      <ProjectSubmission />

      {/* Blockchain Verification Section */}
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
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.030-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Platform */}
            <div>
              <h5 className="text-white font-semibold mb-4">Platform</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Explore NGOs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Submit Problems</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Verify Proofs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API Docs</a></li>
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
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">All 17 Goals</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h5 className="text-white font-semibold mb-4">Resources</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
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

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Notifications */}
      <NotificationContainer 
        notifications={notifications} 
        onRemove={removeNotification}
        position="top-right"
      />
    </div>
  );
}
