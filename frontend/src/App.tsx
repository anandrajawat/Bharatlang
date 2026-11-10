import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeScreen } from './pages/HomeScreen';
import { VoiceAssistantScreen } from './pages/VoiceAssistantScreen';
import { ChatAssistantScreen } from './pages/ChatAssistantScreen';
import { KnowledgeBaseScreen } from './pages/KnowledgeBaseScreen';
import { EvaluationScreen } from './pages/EvaluationScreen';
import { apiClient } from './services/api';
import { SystemHealth } from './types';

export function App() {
  const [activeScreen, setActiveScreen] = useState<string>('home');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('mr');
  const [passedChatQuery, setPassedChatQuery] = useState<string>('');
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);

  // Poll system health on initial startup
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const health = await apiClient.getHealth();
        setSystemHealth(health);
      } catch (err) {
        console.warn('Backend service offline or initializing:', err);
      }
    };
    checkHealth();
  }, []);

  const handleSelectSampleQuery = (query: string) => {
    setPassedChatQuery(query);
    setActiveScreen('chat');
  };

  const handleSubmitFromVoice = (query: string, language: string) => {
    setSelectedLanguage(language);
    setPassedChatQuery(query);
    setActiveScreen('chat');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        isModelReady={!!systemHealth?.services.ollama_local_llm.is_running}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeScreen === 'home' && (
          <HomeScreen
            onNavigate={setActiveScreen}
            systemHealth={systemHealth}
            onSelectSampleQuery={handleSelectSampleQuery}
          />
        )}

        {activeScreen === 'voice' && (
          <VoiceAssistantScreen
            onSubmitQueryToChat={handleSubmitFromVoice}
            selectedLanguage={selectedLanguage}
          />
        )}

        {activeScreen === 'chat' && (
          <ChatAssistantScreen
            initialQuery={passedChatQuery}
            selectedLanguage={selectedLanguage}
          />
        )}

        {activeScreen === 'kb' && <KnowledgeBaseScreen />}

        {activeScreen === 'eval' && <EvaluationScreen />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-4 px-6 text-center">
        <p>
          © 2026 BharatLangTech AI — Dialect-Aware Multilingual Voice Intelligence Platform for Indian Citizens.
          All inference runs 100% locally on Apple Silicon (M2). No proprietary cloud APIs.
        </p>
      </footer>
    </div>
  );
}

export default App;

