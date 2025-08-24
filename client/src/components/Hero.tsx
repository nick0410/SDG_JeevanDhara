import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Search, HelpCircle, Utensils, Heart, GraduationCap, Droplets, Zap, Building } from 'lucide-react';

const sdgGoals = [
  { id: 'sdg2', name: 'Zero Hunger', icon: Utensils, color: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/30' },
  { id: 'sdg3', name: 'Good Health', icon: Heart, color: 'bg-green-500/20 border-green-500/40 text-green-400 hover:bg-green-500/30' },
  { id: 'sdg4', name: 'Quality Education', icon: GraduationCap, color: 'bg-red-500/20 border-red-500/40 text-red-400 hover:bg-red-500/30' },
  { id: 'sdg6', name: 'Clean Water', icon: Droplets, color: 'bg-blue-500/20 border-blue-500/40 text-blue-400 hover:bg-blue-500/30' },
  { id: 'sdg7', name: 'Clean Energy', icon: Zap, color: 'bg-amber-500/20 border-amber-500/40 text-amber-400 hover:bg-amber-500/30' },
  { id: 'sdg11', name: 'Sustainable Cities', icon: Building, color: 'bg-orange-500/20 border-orange-500/40 text-orange-400 hover:bg-orange-500/30' },
];

export function Hero() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-green-400 to-blue-400 bg-clip-text text-transparent">
            Verified Impact<br />for SDG Goals
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Connect with blockchain-verified NGOs working on UN Sustainable Development Goals. 
            Transparent, accountable, impactful.
          </p>

          {/* SDG Goal Quick Selector */}
          <div className="flex flex-wrap justify-center gap-3 mb-12" data-testid="sdg-selector">
            {sdgGoals.map((goal) => {
              const IconComponent = goal.icon;
              return (
                <button
                  key={goal.id}
                  className={`${goal.color} border px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover-lift`}
                  data-testid={`sdg-button-${goal.id}`}
                >
                  <IconComponent className="w-4 h-4 mr-2 inline" />
                  {goal.name}
                </button>
              );
            })}
          </div>

          {/* Main CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/explore">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 px-8 py-4 text-lg font-semibold transition-all hover-lift pulse-glow"
                data-testid="explore-ngos-button"
              >
                <Search className="w-5 h-5 mr-2" />
                Explore NGOs
              </Button>
            </Link>
            <Link href="/help">
              <Button 
                variant="outline"
                size="lg"
                className="border-white/30 hover:bg-white/10 px-8 py-4 text-lg font-semibold transition-all hover-lift"
                data-testid="get-help-button"
              >
                <HelpCircle className="w-5 h-5 mr-2" />
                Get Help
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
