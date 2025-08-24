import React from 'react';
import { Header } from '@/components/Header';
import { BlockchainVerification } from '@/components/BlockchainVerification';
import { Card } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { 
  Shield, 
  CheckCircle, 
  ExternalLink, 
  Clock,
  TrendingUp,
  Globe,
  Lock,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Verification {
  id: number;
  projectId: number;
  txHash: string;
  blockNumber: number;
  gasUsed: number;
  verificationData: {
    projectId: number;
    evidenceHash: string;
    impactMetrics: any;
    verification: {
      method: string;
      verifier: string;
      confidence: number;
    };
  };
  verified: boolean;
  createdAt: string;
}

export default function Verify() {
  const { data: verifications, isLoading } = useQuery<Verification[]>({
    queryKey: ['/api/blockchain/verifications']
  });

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
            Blockchain Verification
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Transparent, immutable proof of impact powered by blockchain technology
          </p>
        </div>

        {/* Verification Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="glass-effect p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{verifications?.length || 0}</div>
            <div className="text-gray-400 text-sm">Total Verifications</div>
          </Card>

          <Card className="glass-effect p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{verifications?.filter(v => v.verified).length || 0}</div>
            <div className="text-gray-400 text-sm">Verified Proofs</div>
          </Card>

          <Card className="glass-effect p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">98.5%</div>
            <div className="text-gray-400 text-sm">Verification Rate</div>
          </Card>

          <Card className="glass-effect p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Globe className="text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">Polygon</div>
            <div className="text-gray-400 text-sm">Network</div>
          </Card>
        </div>

        {/* How Verification Works */}
        <Card className="glass-effect p-8 mb-12">
          <h3 className="text-xl font-semibold text-white mb-6 text-center">How Blockchain Verification Works</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Lock className="text-white" />
              </div>
              <h4 className="text-white font-medium mb-2">1. Evidence Collection</h4>
              <p className="text-gray-400 text-sm">Project evidence is collected and hashed using cryptographic algorithms</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="text-white" />
              </div>
              <h4 className="text-white font-medium mb-2">2. Smart Contract Storage</h4>
              <p className="text-gray-400 text-sm">Impact proof is stored immutably on the Polygon blockchain</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Eye className="text-white" />
              </div>
              <h4 className="text-white font-medium mb-2">3. Public Verification</h4>
              <p className="text-gray-400 text-sm">Anyone can verify the authenticity and integrity of impact data</p>
            </div>
          </div>
        </Card>

        {/* Recent Verifications */}
        <Card className="glass-effect p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Shield className="mr-3 text-green-400" />
            Recent Verifications
          </h3>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-4 animate-pulse">
                  <div className="flex justify-between items-start mb-3">
                    <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                    <div className="h-6 bg-gray-700 rounded w-20"></div>
                  </div>
                  <div className="h-3 bg-gray-700 rounded mb-2 w-1/2"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : verifications && verifications.length > 0 ? (
            <div className="space-y-4">
              {verifications.map((verification) => (
                <div 
                  key={verification.id} 
                  className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
                  data-testid={`verification-${verification.id}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-white font-medium">
                          Project #{verification.projectId}
                        </h4>
                        <Badge className={verification.verified ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}>
                          {verification.verified ? 'Verified' : 'Pending'}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-400">
                        Transaction: <span className="text-blue-400 font-mono">{formatHash(verification.txHash)}</span>
                      </div>
                      <div className="text-sm text-gray-400">
                        Block: #{verification.blockNumber} • Gas: {verification.gasUsed.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400 mb-1">
                        {formatDate(verification.createdAt)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Confidence: {Math.round(verification.verificationData.verification.confidence * 100)}%
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-400">
                      Verified by: {verification.verificationData.verification.verifier}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-gray-400 hover:text-white"
                        data-testid={`view-verification-${verification.id}`}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-gray-400 hover:text-white"
                        data-testid={`view-transaction-${verification.id}`}
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View on Explorer
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="mb-2">No verifications yet</p>
              <p className="text-sm">Submit projects to start creating blockchain verified impact proofs</p>
            </div>
          )}
        </Card>

        {/* Blockchain Verification Component */}
        <BlockchainVerification />
      </div>
    </div>
  );
}