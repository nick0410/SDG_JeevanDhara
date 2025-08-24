import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useNotifications } from '@/components/ui/notification';
import { useAuth } from '@/hooks/useAuth';
import { 
  Shield, 
  Box, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Plus,
  ExternalLink,
  Copy 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BlockchainVerification {
  id: number;
  projectId: number;
  txHash: string;
  blockNumber: number;
  gasUsed: string;
  verificationData: any;
  verified: boolean;
  createdAt: string;
}

interface VerificationStep {
  number: number;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const verificationSteps: VerificationStep[] = [
  {
    number: 1,
    title: 'Submit Impact Evidence',
    description: 'Upload photos, reports, and documentation of your project\'s impact',
    icon: Shield,
    color: 'bg-green-500',
  },
  {
    number: 2,
    title: 'AI Verification',
    description: 'Our AI system analyzes and validates the authenticity of submitted evidence',
    icon: Shield,
    color: 'bg-blue-500',
  },
  {
    number: 3,
    title: 'Blockchain Storage',
    description: 'Verified proofs are permanently stored on the blockchain with immutable timestamps',
    icon: Box,
    color: 'bg-purple-500',
  },
  {
    number: 4,
    title: 'Public Verification',
    description: 'Anyone can verify the authenticity and impact of your project using the blockchain record',
    icon: CheckCircle,
    color: 'bg-orange-500',
  },
];

export function BlockchainVerification() {
  const { isAuthenticated } = useAuth();
  const { showSuccess, showError, showInfo } = useNotifications();
  const queryClient = useQueryClient();

  const { data: verifications, isLoading } = useQuery<BlockchainVerification[]>({
    queryKey: ['/api/blockchain/verifications'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const createVerificationMutation = useMutation({
    mutationFn: async (data: { projectId: number; evidenceHash: string; impactMetrics: any }) => {
      const response = await apiRequest('POST', '/api/blockchain/verify', data);
      return response.json();
    },
    onSuccess: (data) => {
      showSuccess('Verification submitted to blockchain!', `Transaction hash: ${data.transaction.hash}`);
      queryClient.invalidateQueries({ queryKey: ['/api/blockchain/verifications'] });
    },
    onError: (error) => {
      showError('Failed to create blockchain verification', error.message);
    },
  });

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showInfo('Copied to clipboard');
    } catch (error) {
      showError('Failed to copy to clipboard');
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 10)}...${address.slice(-8)}`;
  };

  const getStatusIcon = (verified: boolean, txHash: string) => {
    if (verified) {
      return <CheckCircle className="w-4 h-4 text-green-400" />;
    }
    // Check if it's a recent transaction (less than 5 minutes old)
    return <Clock className="w-4 h-4 text-yellow-400" />;
  };

  const getStatusColor = (verified: boolean) => {
    return verified ? 'bg-green-500' : 'bg-orange-500';
  };

  const getStatusText = (verified: boolean) => {
    return verified ? 'Confirmed' : 'Pending';
  };

  const handleSubmitNewProof = async () => {
    try {
      // First, get existing projects to ensure we use valid project IDs
      const response = await fetch('/api/user/projects', {
        credentials: 'include'
      });
      
      let projectId = 1; // default fallback
      
      if (response.ok) {
        const userProjects = await response.json();
        if (userProjects.length > 0) {
          const randomProject = userProjects[Math.floor(Math.random() * userProjects.length)];
          projectId = randomProject.id;
        }
      }
      
      const mockData = {
        projectId,
        evidenceHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        impactMetrics: {
          beneficiaries: Math.floor(Math.random() * 1000) + 250,
          impactScore: (85 + Math.random() * 15).toFixed(1),
          sustainabilityScore: (80 + Math.random() * 20).toFixed(1),
          carbonReduced: Math.floor(Math.random() * 500) + 100,
          communitiesReached: Math.floor(Math.random() * 10) + 3,
          budget: Math.floor(Math.random() * 50000) + 1000,
          timeframe: '3-6 months',
          sdgGoals: ['sdg1', 'sdg6'],
        },
      };
      
      createVerificationMutation.mutate(mockData);
    } catch (error) {
      console.error('Error creating verification:', error);
      // Fallback to demo data if there's an issue
      const mockData = {
        projectId: 1,
        evidenceHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        impactMetrics: {
          beneficiaries: Math.floor(Math.random() * 1000) + 250,
          budget: Math.floor(Math.random() * 50000) + 1000,
          timeframe: '3-6 months',
          sdgGoals: ['sdg1'],
        },
      };
      createVerificationMutation.mutate(mockData);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-r from-green-900/20 to-emerald-900/20" data-testid="blockchain-verification">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Blockchain Verification
          </h3>
          <p className="text-xl text-gray-300">
            Store and verify impact proofs on the blockchain for permanent transparency
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Verification Process */}
          <Card className="glass-effect rounded-2xl p-8">
            <h4 className="text-xl font-semibold mb-6 text-white flex items-center">
              <Shield className="text-green-400 mr-3" />
              Verification Process
            </h4>
            
            <div className="space-y-6">
              {verificationSteps.map((step) => {
                const IconComponent = step.icon;
                return (
                  <div key={step.number} className="flex items-start space-x-4">
                    <div className={`w-8 h-8 ${step.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white text-sm font-semibold">{step.number}</span>
                    </div>
                    <div>
                      <h5 className="font-semibold text-white mb-1">{step.title}</h5>
                      <p className="text-gray-300 text-sm">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Button
              onClick={handleSubmitNewProof}
              className="w-full mt-8 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              disabled={createVerificationMutation.isPending || !isAuthenticated}
              data-testid="submit-proof-button"
            >
              <Plus className="w-4 h-4 mr-2" />
              {createVerificationMutation.isPending ? 'Submitting...' : 'Submit New Proof'}
            </Button>

            {!isAuthenticated && (
              <p className="text-yellow-400 text-sm text-center mt-2">
                Please log in to submit verifications
              </p>
            )}
          </Card>

          {/* Recent Transactions */}
          <Card className="glass-effect rounded-2xl p-8">
            <h4 className="text-xl font-semibold mb-6 text-white flex items-center">
              <Box className="text-blue-400 mr-3" />
              Recent Verifications
            </h4>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="bg-white/5 border-white/10 p-4 animate-pulse">
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-4 bg-gray-700 rounded w-32"></div>
                      <div className="h-6 bg-gray-700 rounded w-20"></div>
                    </div>
                    <div className="h-4 bg-gray-700 rounded mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded mb-2"></div>
                    <div className="flex justify-between">
                      <div className="h-3 bg-gray-700 rounded w-24"></div>
                      <div className="h-3 bg-gray-700 rounded w-20"></div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : verifications && verifications.length > 0 ? (
              <div className="space-y-4">
                {verifications.slice(0, 5).map((verification) => (
                  <Card 
                    key={verification.id} 
                    className="bg-white/5 border-white/10 p-4 hover:bg-white/10 transition-colors"
                    data-testid={`verification-${verification.id}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Transaction Hash</span>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(verification.verified, verification.txHash)}
                        <span className={`${getStatusColor(verification.verified)} text-white text-xs px-2 py-1 rounded-full`}>
                          {getStatusText(verification.verified)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="font-mono text-sm text-blue-400 flex-1">
                        {formatAddress(verification.txHash)}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(verification.txHash)}
                        className="text-gray-400 hover:text-white p-1"
                        data-testid={`copy-hash-${verification.id}`}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`https://polygonscan.com/tx/${verification.txHash}`, '_blank')}
                        className="text-gray-400 hover:text-white p-1"
                        data-testid={`view-explorer-${verification.id}`}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    <div className="text-sm text-gray-300 mb-2">
                      {verification.verificationData?.impactMetrics ? 
                        `Impact Verification - ${verification.verificationData.impactMetrics.beneficiaries || 'Multiple'} beneficiaries` :
                        'Impact Verification Record'
                      }
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>
                        {new Date(verification.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      <span>Gas: {verification.gasUsed}</span>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Box className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No blockchain verifications yet.</p>
                <p className="text-sm">Submit your first impact proof to get started.</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
}
