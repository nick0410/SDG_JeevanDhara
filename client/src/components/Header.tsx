import React, { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { Globe, Wallet, User, LogOut, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { currentLanguage, changeLanguage, t, getAvailableLanguages } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  const connectWallet = async () => {
    try {
      if (typeof (window as any).ethereum !== 'undefined') {
        const accounts = await (window as any).ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        setWalletAddress(accounts[0]);
        setIsWalletConnected(true);
      } else {
        alert('MetaMask is not installed. Please install it to connect your wallet.');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const disconnectWallet = () => {
    setIsWalletConnected(false);
    setWalletAddress('');
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="glass-effect border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center space-x-4" data-testid="logo-link">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
              <Globe className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                {t('sdg_impact')}
              </h1>
              <p className="text-sm text-gray-400">{t('verified_impact')}</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/explore" className="text-gray-300 hover:text-white transition-colors" data-testid="nav-explore">
              {t('explore_ngos')}
            </Link>
            <Link href="/submit" className="text-gray-300 hover:text-white transition-colors" data-testid="nav-submit">
              {t('submit_problems')}
            </Link>
            <Link href="/verify" className="text-gray-300 hover:text-white transition-colors" data-testid="nav-verify">
              {t('verify_proofs')}
            </Link>
            {isAuthenticated && (
              <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors" data-testid="nav-dashboard">
                {t('dashboard')}
              </Link>
            )}
          </nav>

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Selector */}
            <select 
              value={currentLanguage}
              onChange={(e) => changeLanguage(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white"
              data-testid="language-selector"
            >
              {getAvailableLanguages().map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>

            {/* MetaMask Wallet Connection */}
            {!isWalletConnected ? (
              <Button 
                onClick={connectWallet}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                data-testid="connect-wallet-button"
              >
                <Wallet className="w-4 h-4 mr-2" />
                {t('connect_wallet')}
              </Button>
            ) : (
              <div className="flex items-center space-x-3 bg-white/10 rounded-lg px-4 py-2" data-testid="wallet-connected">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <Wallet className="text-white text-sm" />
                </div>
                <div className="text-sm">
                  <div className="font-medium">{formatAddress(walletAddress)}</div>
                  <div className="text-gray-400">Connected</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={disconnectWallet}
                  className="text-gray-400 hover:text-white"
                  data-testid="disconnect-wallet-button"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Authentication */}
            {!isLoading && !isAuthenticated ? (
              <Button 
                onClick={() => window.location.href = '/api/login'}
                variant="outline" 
                className="border-white/20 hover:bg-white/10"
                data-testid="login-button"
              >
                {t('login')}
              </Button>
            ) : isAuthenticated && user ? (
              <div className="flex items-center space-x-3 bg-white/10 rounded-lg px-4 py-2" data-testid="user-profile">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  {(user as any).profileImageUrl ? (
                    <img 
                      src={(user as any).profileImageUrl} 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="text-white text-sm" />
                  )}
                </div>
                <div className="text-sm">
                  <div className="font-medium">{(user as any).firstName || (user as any).email}</div>
                  <div className="text-gray-400">Verified</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.location.href = '/api/logout'}
                  className="text-gray-400 hover:text-white"
                  data-testid="logout-button"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="mobile-menu-button"
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/10 pt-4" data-testid="mobile-menu">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/explore" 
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Explore NGOs
              </Link>
              <Link 
                href="/submit" 
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Submit Problems
              </Link>
              <Link 
                href="/verify" 
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Verify Proofs
              </Link>
              {isAuthenticated && (
                <Link 
                  href="/dashboard" 
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
            </nav>
            
            <div className="mt-4 space-y-3">
              {!isWalletConnected ? (
                <Button 
                  onClick={connectWallet}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </Button>
              ) : (
                <div className="flex items-center justify-between bg-white/10 rounded-lg px-4 py-2">
                  <span className="text-sm font-medium">{formatAddress(walletAddress)}</span>
                  <Button variant="ghost" size="sm" onClick={disconnectWallet}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {!isLoading && !isAuthenticated ? (
                <Button 
                  onClick={() => window.location.href = '/api/login'}
                  variant="outline" 
                  className="w-full border-white/20"
                >
                  Login
                </Button>
              ) : isAuthenticated ? (
                <Button
                  onClick={() => window.location.href = '/api/logout'}
                  variant="outline"
                  className="w-full border-white/20"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
