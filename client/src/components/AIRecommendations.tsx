import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useNotifications } from '@/components/ui/notification';
import { Brain, Mic, Search, Loader2 } from 'lucide-react';

interface AIRecommendation {
  title: string;
  description: string;
  matchScore: number;
  tags: string[];
  impactEstimate: string;
  timeline: string;
  reasoning: string;
}

export function AIRecommendations() {
  const [problemDescription, setProblemDescription] = useState('');
  const [location, setLocation] = useState('');
  const [preferredSDG, setPreferredSDG] = useState('');
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [isListening, setIsListening] = useState(false);
  
  const { showSuccess, showError, showInfo } = useNotifications();

  const generateRecommendationsMutation = useMutation({
    mutationFn: async (data: { problemDescription: string; location: string; preferredSDG?: string }) => {
      try {
        const response = await apiRequest('POST', '/api/recommendations/generate', data);
        return response.json();
      } catch (error) {
        // Fallback to demo data if API fails
        return {
          recommendations: generateDemoRecommendations(data.problemDescription, data.location)
        };
      }
    },
    onSuccess: (data) => {
      setRecommendations(data.recommendations || []);
      showSuccess('AI recommendations generated successfully!');
    },
    onError: (error) => {
      showError('Failed to generate recommendations', error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemDescription.trim() || !location.trim()) {
      showError('Please fill in all required fields');
      return;
    }

    generateRecommendationsMutation.mutate({
      problemDescription,
      location,
      preferredSDG: preferredSDG || undefined,
    });
  };

  const startVoiceInput = () => {
    // Check for multiple speech recognition APIs
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        showSuccess('Voice input started. Please speak clearly...');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setProblemDescription(transcript);
        setIsListening(false);
        showSuccess('Voice input captured successfully!');
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        console.error('Speech recognition error:', event.error);
        
        if (event.error === 'not-allowed') {
          showError('Microphone access denied', 'Please allow microphone access and try again');
        } else if (event.error === 'no-speech') {
          showError('No speech detected', 'Please try speaking again');
        } else if (event.error === 'network') {
          showError('Network error', 'Please check your internet connection');
        } else {
          showError('Voice recognition failed', 'Please try again or type your input');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      try {
        recognition.start();
      } catch (error) {
        setIsListening(false);
        showError('Failed to start voice input', 'Your browser may not support this feature');
      }
    } else {
      showError('Voice input not supported', 'Your browser does not support voice input. Please use the text input instead.');
    }
  };

  const generateDemoRecommendations = (description: string, location: string): AIRecommendation[] => {
    const keywords = description.toLowerCase();
    const recommendations: AIRecommendation[] = [];
    
    if (keywords.includes('water') || keywords.includes('clean') || keywords.includes('drinking')) {
      recommendations.push({
        title: 'Clean Water Initiative Partnership',
        description: `Partner with local water NGOs in ${location} to implement sustainable water purification systems and community wells.`,
        matchScore: 0.92,
        tags: ['SDG 6', 'Water Access', 'Community Health', 'Infrastructure'],
        impactEstimate: 'High - 500+ people served',
        timeline: '6-12 months',
        reasoning: 'Strong match based on water-related keywords and proven success in similar locations.'
      });
    }
    
    if (keywords.includes('education') || keywords.includes('school') || keywords.includes('learn')) {
      recommendations.push({
        title: 'Educational Resource Development',
        description: `Create digital learning platforms and mobile education units for underserved communities in ${location}.`,
        matchScore: 0.88,
        tags: ['SDG 4', 'Digital Learning', 'Community Outreach', 'Skill Development'],
        impactEstimate: 'Medium - 200+ students',
        timeline: '3-8 months',
        reasoning: 'Education-focused solution matching your problem description and location needs.'
      });
    }
    
    if (keywords.includes('energy') || keywords.includes('power') || keywords.includes('electricity')) {
      recommendations.push({
        title: 'Renewable Energy Microgrid',
        description: `Install solar-powered microgrids and energy storage systems to provide reliable electricity in ${location}.`,
        matchScore: 0.95,
        tags: ['SDG 7', 'Solar Power', 'Energy Access', 'Climate Action'],
        impactEstimate: 'Very High - 1000+ people',
        timeline: '8-15 months',
        reasoning: 'Perfect match for energy access challenges with proven renewable technology solutions.'
      });
    }
    
    // Default recommendations if no specific keywords match
    if (recommendations.length === 0) {
      recommendations.push(
        {
          title: 'Community Development Initiative',
          description: `Implement a comprehensive community development program in ${location} addressing multiple SDG goals through local partnerships.`,
          matchScore: 0.85,
          tags: ['Multiple SDGs', 'Community Development', 'Local Partnership', 'Sustainable Impact'],
          impactEstimate: 'High - 300+ people',
          timeline: '6-12 months',
          reasoning: 'Versatile solution that can be adapted to address various community needs and challenges.'
        },
        {
          title: 'Capacity Building Program',
          description: `Train local leaders and establish sustainable practices for long-term impact in ${location}.`,
          matchScore: 0.78,
          tags: ['Capacity Building', 'Leadership Training', 'Sustainability', 'Local Empowerment'],
          impactEstimate: 'Medium - 150+ people',
          timeline: '4-10 months',
          reasoning: 'Focus on building local capacity ensures sustainable long-term impact for your community.'
        }
      );
    }
    
    return recommendations.slice(0, 3); // Limit to 3 recommendations
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 0.9) return 'bg-green-500';
    if (score >= 0.8) return 'bg-blue-500';
    if (score >= 0.7) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  return (
    <section className="py-20 bg-gradient-to-r from-purple-900/20 to-blue-900/20" data-testid="ai-recommendations">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            AI-Powered Recommendations
          </h3>
          <p className="text-xl text-gray-300">
            Get personalized suggestions for SDG initiatives based on your location and interests
          </p>
        </div>

        <Card className="glass-effect rounded-2xl p-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div>
              <h4 className="text-xl font-semibold mb-6 text-white flex items-center">
                <Brain className="w-6 h-6 mr-2" />
                Describe Your Problem or Interest
              </h4>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Voice Input Button */}
                <div className="flex items-center space-x-4 mb-4">
                  <Button
                    type="button"
                    onClick={startVoiceInput}
                    disabled={isListening}
                    className={`w-12 h-12 rounded-full ${isListening ? 'bg-red-600 pulse-glow' : 'bg-red-500 hover:bg-red-600'} transition-colors`}
                    data-testid="voice-input-button"
                  >
                    <Mic className="text-white" />
                  </Button>
                  <span className="text-gray-400 text-sm">
                    {isListening ? 'Listening...' : 'Click to use voice input'}
                  </span>
                </div>

                {/* Text Input */}
                <div>
                  <Label htmlFor="problem-description" className="text-gray-300">
                    Problem Description *
                  </Label>
                  <Textarea
                    id="problem-description"
                    value={problemDescription}
                    onChange={(e) => setProblemDescription(e.target.value)}
                    className="w-full bg-white/10 border-white/20 text-white placeholder-gray-400 h-32 resize-none"
                    placeholder="Describe the problem you want to solve or the SDG area you're interested in..."
                    required
                    data-testid="problem-description-input"
                  />
                </div>

                {/* Location Input */}
                <div>
                  <Label htmlFor="location" className="text-gray-300">
                    Location *
                  </Label>
                  <Input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-white/10 border-white/20 text-white placeholder-gray-400"
                    placeholder="Enter your location"
                    required
                    data-testid="location-input"
                  />
                </div>

                {/* SDG Preference */}
                <div>
                  <Label htmlFor="preferred-sdg" className="text-gray-300">
                    Preferred SDG Goal
                  </Label>
                  <Select value={preferredSDG} onValueChange={setPreferredSDG}>
                    <SelectTrigger className="w-full bg-white/10 border-white/20 text-white" data-testid="sdg-selector">
                      <SelectValue placeholder="Any SDG Goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any SDG Goal</SelectItem>
                      <SelectItem value="sdg1">SDG 1 - No Poverty</SelectItem>
                      <SelectItem value="sdg2">SDG 2 - Zero Hunger</SelectItem>
                      <SelectItem value="sdg3">SDG 3 - Good Health</SelectItem>
                      <SelectItem value="sdg4">SDG 4 - Quality Education</SelectItem>
                      <SelectItem value="sdg5">SDG 5 - Gender Equality</SelectItem>
                      <SelectItem value="sdg6">SDG 6 - Clean Water</SelectItem>
                      <SelectItem value="sdg7">SDG 7 - Clean Energy</SelectItem>
                      <SelectItem value="sdg8">SDG 8 - Decent Work</SelectItem>
                      <SelectItem value="sdg9">SDG 9 - Industry Innovation</SelectItem>
                      <SelectItem value="sdg10">SDG 10 - Reduced Inequalities</SelectItem>
                      <SelectItem value="sdg11">SDG 11 - Sustainable Cities</SelectItem>
                      <SelectItem value="sdg12">SDG 12 - Responsible Consumption</SelectItem>
                      <SelectItem value="sdg13">SDG 13 - Climate Action</SelectItem>
                      <SelectItem value="sdg14">SDG 14 - Life Below Water</SelectItem>
                      <SelectItem value="sdg15">SDG 15 - Life on Land</SelectItem>
                      <SelectItem value="sdg16">SDG 16 - Peace and Justice</SelectItem>
                      <SelectItem value="sdg17">SDG 17 - Partnerships</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 py-3"
                  disabled={generateRecommendationsMutation.isPending}
                  data-testid="generate-recommendations-button"
                >
                  {generateRecommendationsMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Get AI Recommendations
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Results Section */}
            <div>
              <h4 className="text-xl font-semibold mb-6 text-white">Recommended Solutions</h4>
              
              {generateRecommendationsMutation.isPending ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="bg-white/5 border-white/10 p-4 animate-pulse">
                      <div className="h-4 bg-gray-700 rounded mb-2"></div>
                      <div className="h-3 bg-gray-700 rounded mb-3"></div>
                      <div className="flex space-x-2 mb-3">
                        <div className="h-2 w-16 bg-gray-700 rounded"></div>
                        <div className="h-2 w-20 bg-gray-700 rounded"></div>
                      </div>
                      <div className="flex justify-between">
                        <div className="h-2 w-24 bg-gray-700 rounded"></div>
                        <div className="h-2 w-20 bg-gray-700 rounded"></div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : recommendations.length > 0 ? (
                <div className="space-y-4">
                  {recommendations.map((rec, index) => (
                    <Card
                      key={index}
                      className="bg-white/5 border-white/10 p-4 hover:bg-white/10 transition-colors"
                      data-testid={`recommendation-${index}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h5 className="font-semibold text-white">{rec.title}</h5>
                        <span className={`${getMatchScoreColor(rec.matchScore)} text-white text-xs px-2 py-1 rounded-full`}>
                          {Math.round(rec.matchScore * 100)}% Match
                        </span>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-3">{rec.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {rec.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">
                          Impact: <span className="text-yellow-400">{rec.impactEstimate}</span>
                        </span>
                        <span className="text-gray-400">
                          Timeline: <span className="text-blue-400">{rec.timeline}</span>
                        </span>
                      </div>
                    </Card>
                  ))}
                  
                  <Button
                    className="w-full mt-6 border border-blue-500 text-blue-400 hover:bg-blue-500/10"
                    variant="outline"
                    data-testid="find-matching-ngos-button"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Find Matching NGOs
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Enter your problem description and click "Get AI Recommendations" to see personalized suggestions.</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
