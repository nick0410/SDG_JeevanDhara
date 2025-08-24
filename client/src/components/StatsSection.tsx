import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Shield, BarChart3, Users, Globe } from 'lucide-react';

interface Statistics {
  ngoCount: number;
  projectCount: number;
  communityCount: number;
  countryCount: number;
}

export function StatsSection() {
  const { data: stats, isLoading } = useQuery<Statistics>({
    queryKey: ['/api/statistics'],
  });

  const [animatedStats, setAnimatedStats] = useState({
    ngoCount: 0,
    projectCount: 0,
    communityCount: 0,
    countryCount: 0,
  });

  // Animate numbers when data loads
  useEffect(() => {
    if (stats) {
      const duration = 2000; // 2 seconds
      const steps = 60; // 60 fps
      const stepDuration = duration / steps;

      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easeOut = 1 - Math.pow(1 - progress, 3); // Easing function

        setAnimatedStats({
          ngoCount: Math.floor(stats.ngoCount * easeOut),
          projectCount: Math.floor(stats.projectCount * easeOut),
          communityCount: Math.floor(stats.communityCount * easeOut),
          countryCount: Math.floor(stats.countryCount * easeOut),
        });

        if (currentStep >= steps) {
          clearInterval(interval);
          setAnimatedStats(stats);
        }
      }, stepDuration);

      return () => clearInterval(interval);
    }
  }, [stats]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const statItems = [
    {
      icon: Shield,
      value: animatedStats.ngoCount,
      label: 'Verified NGOs',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      testId: 'stat-ngos',
    },
    {
      icon: BarChart3,
      value: animatedStats.projectCount,
      label: 'Active Projects',
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      testId: 'stat-projects',
    },
    {
      icon: Users,
      value: animatedStats.communityCount,
      label: 'Communities Served',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      testId: 'stat-communities',
    },
    {
      icon: Globe,
      value: animatedStats.countryCount,
      label: 'Countries',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      testId: 'stat-countries',
    },
  ];

  if (isLoading) {
    return (
      <section className="py-16 bg-black/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-gray-700/50 rounded-full mx-auto mb-4 animate-pulse"></div>
                <div className="h-8 bg-gray-700/50 rounded mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-700/50 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-black/20" data-testid="stats-section">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {statItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <div key={item.testId} className="text-center" data-testid={item.testId}>
                <div className={`w-16 h-16 ${item.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <IconComponent className={`${item.color} text-2xl`} />
                </div>
                <div className={`text-3xl font-bold ${item.color}`} data-testid={`${item.testId}-value`}>
                  {item.value > 0 ? `${formatNumber(item.value)}+` : '0'}
                </div>
                <div className="text-gray-400" data-testid={`${item.testId}-label`}>
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
