import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Brain, 
  TrendingUp, 
  Users, 
  BarChart3, 
  DollarSign,
  ArrowRight 
} from 'lucide-react';

const features = [
  {
    id: 'blockchain-verified',
    icon: Shield,
    title: 'Blockchain Verified',
    badge: 'Trusted',
    badgeColor: 'bg-green-500',
    description: 'Every NGO and project is verified on-chain with immutable proof of impact and transparency.',
    buttonText: 'Learn More',
    buttonColor: 'text-blue-400 hover:text-blue-300',
    gradient: 'from-green-400 to-blue-500',
  },
  {
    id: 'smart-matching',
    icon: Brain,
    title: 'Smart Matching',
    badge: 'Intelligent',
    badgeColor: 'bg-purple-500',
    description: 'AI-powered system matches problems with the most suitable verified NGOs based on expertise and location.',
    buttonText: 'Try AI Matching',
    buttonColor: 'text-purple-400 hover:text-purple-300',
    gradient: 'from-purple-400 to-pink-500',
  },
  {
    id: 'real-time-updates',
    icon: TrendingUp,
    title: 'Real-time Updates',
    badge: 'Live',
    badgeColor: 'bg-orange-500',
    description: 'Live progress tracking with photo evidence, reports, and milestone updates from active projects.',
    buttonText: 'View Projects',
    buttonColor: 'text-orange-400 hover:text-orange-300',
    gradient: 'from-orange-400 to-red-500',
  },
  {
    id: 'community-driven',
    icon: Users,
    title: 'Community Driven',
    badge: 'Connected',
    badgeColor: 'bg-blue-500',
    description: 'Connect communities in need with verified organizations working on specific UN SDG goals.',
    buttonText: 'Join Community',
    buttonColor: 'text-blue-400 hover:text-blue-300',
    gradient: 'from-blue-400 to-cyan-500',
  },
  {
    id: 'impact-analytics',
    icon: BarChart3,
    title: 'Impact Analytics',
    badge: 'Measurable',
    badgeColor: 'bg-indigo-500',
    description: 'Detailed metrics and analytics showing measurable impact across all supported SDG categories.',
    buttonText: 'View Analytics',
    buttonColor: 'text-indigo-400 hover:text-indigo-300',
    gradient: 'from-indigo-400 to-purple-500',
  },
  {
    id: 'transparent-funding',
    icon: DollarSign,
    title: 'Transparent Funding',
    badge: 'Transparent',
    badgeColor: 'bg-green-500',
    description: 'Track how funds are used with blockchain transparency and detailed financial reporting.',
    buttonText: 'Track Funding',
    buttonColor: 'text-green-400 hover:text-green-300',
    gradient: 'from-green-400 to-emerald-500',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20" data-testid="features-section">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
            Powerful Features
          </h3>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Built for transparency, trust, and measurable impact in addressing global challenges
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={feature.id}
                className="glass-effect rounded-2xl p-8 hover-lift transition-all duration-300 hover:bg-white/10"
                data-testid={`feature-${feature.id}`}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6`}>
                  <IconComponent className="text-white text-2xl" />
                </div>
                
                <div className="flex items-center mb-4">
                  <h4 className="text-xl font-semibold text-white">{feature.title}</h4>
                  <span className={`ml-2 ${feature.badgeColor} text-white text-xs px-2 py-1 rounded-full`}>
                    {feature.badge}
                  </span>
                </div>
                
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                
                <Button
                  variant="link"
                  className={`${feature.buttonColor} font-medium p-0 h-auto`}
                  data-testid={`feature-button-${feature.id}`}
                >
                  {feature.buttonText}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
