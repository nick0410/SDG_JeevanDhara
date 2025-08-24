import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  MapPin, 
  Star, 
  Users, 
  CheckCircle, 
  ExternalLink,
  Filter,
  Globe,
  Heart,
  TrendingUp
} from 'lucide-react';

interface NGO {
  id: number;
  name: string;
  description: string;
  location: string;
  sdgGoals: string[];
  website?: string;
  contactEmail?: string;
  impactScore: number;
  verified: boolean;
  activeProjects: number;
  foundedYear: number;
}

export default function Explore() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSDG, setSelectedSDG] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const { data: ngos, isLoading } = useQuery<NGO[]>({
    queryKey: ['/api/ngos'],
    initialData: [
      {
        id: 1,
        name: "Clean Water Initiative",
        description: "Providing clean water solutions to rural communities across developing nations through innovative technology and community partnerships.",
        location: "Kenya, Uganda, Tanzania",
        sdgGoals: ["SDG 6 - Clean Water", "SDG 3 - Good Health"],
        website: "https://cleanwater.org",
        contactEmail: "info@cleanwater.org",
        impactScore: 95,
        verified: true,
        activeProjects: 12,
        foundedYear: 2015
      },
      {
        id: 2,
        name: "Education for All Foundation",
        description: "Building schools and providing quality education resources to underserved communities worldwide.",
        location: "India, Bangladesh, Nepal",
        sdgGoals: ["SDG 4 - Quality Education", "SDG 1 - No Poverty"],
        website: "https://educationforall.org",
        contactEmail: "contact@educationforall.org",
        impactScore: 88,
        verified: true,
        activeProjects: 8,
        foundedYear: 2012
      },
      {
        id: 3,
        name: "Sustainable Energy Solutions",
        description: "Implementing renewable energy projects in remote areas to provide sustainable power solutions.",
        location: "Sub-Saharan Africa",
        sdgGoals: ["SDG 7 - Clean Energy", "SDG 13 - Climate Action"],
        website: "https://sustenergysolv.org",
        contactEmail: "hello@sustenergysolv.org",
        impactScore: 92,
        verified: true,
        activeProjects: 15,
        foundedYear: 2018
      }
    ]
  });

  const filteredNGOs = ngos?.filter(ngo => {
    const matchesSearch = ngo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ngo.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSDG = !selectedSDG || selectedSDG === 'any' || ngo.sdgGoals.some(goal => goal.includes(selectedSDG));
    const matchesLocation = !selectedLocation || ngo.location.toLowerCase().includes(selectedLocation.toLowerCase());
    return matchesSearch && matchesSDG && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
            Explore Verified NGOs
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover trusted organizations working on UN Sustainable Development Goals and make a real impact
          </p>
        </div>

        {/* Filters */}
        <Card className="glass-effect p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search NGOs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
                  data-testid="search-ngos"
                />
              </div>
            </div>
            
            <Select value={selectedSDG} onValueChange={setSelectedSDG}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white" data-testid="sdg-filter">
                <SelectValue placeholder="SDG Goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any SDG Goal</SelectItem>
                <SelectItem value="SDG 1">SDG 1 - No Poverty</SelectItem>
                <SelectItem value="SDG 3">SDG 3 - Good Health</SelectItem>
                <SelectItem value="SDG 4">SDG 4 - Quality Education</SelectItem>
                <SelectItem value="SDG 6">SDG 6 - Clean Water</SelectItem>
                <SelectItem value="SDG 7">SDG 7 - Clean Energy</SelectItem>
                <SelectItem value="SDG 13">SDG 13 - Climate Action</SelectItem>
              </SelectContent>
            </Select>
            
            <Input
              placeholder="Location..."
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder-gray-400"
              data-testid="location-filter"
            />
            
            <Button className="bg-gradient-to-r from-blue-500 to-green-500" data-testid="apply-filters">
              <Filter className="w-4 h-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </Card>

        {/* NGO Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="glass-effect p-6 animate-pulse">
                <div className="h-4 bg-gray-700 rounded mb-3"></div>
                <div className="h-3 bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-700 rounded mb-4 w-3/4"></div>
                <div className="flex space-x-2">
                  <div className="h-6 bg-gray-700 rounded w-16"></div>
                  <div className="h-6 bg-gray-700 rounded w-20"></div>
                </div>
              </Card>
            ))
          ) : (
            filteredNGOs?.map((ngo) => (
              <Card key={ngo.id} className="glass-effect p-6 hover:bg-white/10 transition-all duration-300 hover-lift" data-testid={`ngo-${ngo.id}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1 flex items-center">
                      {ngo.name}
                      {ngo.verified && (
                        <CheckCircle className="w-5 h-5 text-green-400 ml-2" />
                      )}
                    </h3>
                    <div className="flex items-center text-sm text-gray-400 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {ngo.location}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-400">{ngo.impactScore}</div>
                    <div className="text-xs text-gray-400">Impact Score</div>
                  </div>
                </div>

                <p className="text-gray-300 text-sm mb-4 line-clamp-3">{ngo.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {ngo.sdgGoals.map((goal, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-blue-500/20 text-blue-300">
                      {goal.split(' - ')[0]}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <span className="flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {ngo.activeProjects} active projects
                  </span>
                  <span>Founded {ngo.foundedYear}</span>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-500 to-green-500" data-testid={`connect-${ngo.id}`}>
                    <Heart className="w-4 h-4 mr-2" />
                    Connect
                  </Button>
                  <Button size="sm" variant="outline" className="border-white/20" data-testid={`view-${ngo.id}`}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>

        {filteredNGOs?.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Globe className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No NGOs found</h3>
            <p className="text-gray-400">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}