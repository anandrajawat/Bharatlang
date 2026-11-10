import React from 'react';
import { Bot, Mic, MessageSquare, BookOpen, BarChart3, Cpu, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeScreen: string;
  setActiveScreen: (screen: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  isModelReady: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeScreen,
  setActiveScreen,
  selectedLanguage,
  setSelectedLanguage,
  isModelReady
}) => {
  const navItems = [
    { id: 'home', label: 'गृह (Home)', icon: Bot },
    { id: 'voice', label: 'आवाज सहाय्यक (Voice)', icon: Mic },
    { id: 'chat', label: 'संभाषण (Chat)', icon: MessageSquare },
    { id: 'kb', label: 'ज्ञान भांडार (Knowledge Base)', icon: BookOpen },
    { id: 'eval', label: 'मूल्यांकन (Evaluation)', icon: BarChart3 }
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Product Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveScreen('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  BharatLangTech AI
                </span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800">
                  Dialect-Aware
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                स्थानिक भाषा व बोलीभाषा बहुभाषिक सहाय्यक
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveScreen(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Hardware status & Language Selector */}
          <div className="flex items-center space-x-3">
            {/* Apple Silicon Hardware Chip */}
            <div className="hidden lg:flex items-center space-x-1.5 text-xs px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>Apple M2 (MPS)</span>
            </div>

            {/* Language Selection */}
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              aria-label="भाषा निवडा (Select Language)"
              className="bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              <option value="mr">मराठी (Marathi)</option>
              <option value="mr-varhadi">वऱ्हाडी (Varhadi - Vidarbha)</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="md:hidden flex overflow-x-auto px-2 py-2 border-t border-slate-800 space-x-1 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveScreen(item.id)}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
                isActive ? 'bg-indigo-600 text-white' : 'text-slate-300 bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};

