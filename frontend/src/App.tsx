import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeScreen } from './pages/HomeScreen';
import { VoiceAssistantScreen } from './pages/VoiceAssistantScreen';
import { ChatAssistantScreen } from './pages/ChatAssistantScreen';
import { KnowledgeBaseScreen } from './pages/KnowledgeBaseScreen';
import { EvaluationScreen } from './pages/EvaluationScreen';
import { apiClient } from './services/api';
import { SystemHealth } from './types';
import { getTranslation } from './i18n/translations';

export function App() {
  const [activeScreen, setActiveScreen] = useState<string>('home');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('mr');
  const [passedChatQuery, setPassedChatQuery] = useState<string>('');
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);

  const t = getTranslation(selectedLanguage);

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
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        isModelReady={!!systemHealth?.services.ollama_local_llm.is_running}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeScreen === 'home' && (
          <HomeScreen
            onNavigate={setActiveScreen}
            systemHealth={systemHealth}
            onSelectSampleQuery={handleSelectSampleQuery}
            selectedLanguage={selectedLanguage}
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

        {activeScreen === 'kb' && (
          <KnowledgeBaseScreen selectedLanguage={selectedLanguage} />
        )}

        {activeScreen === 'eval' && (
          <EvaluationScreen selectedLanguage={selectedLanguage} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-5 px-6 text-center">
        <p className="max-w-4xl mx-auto leading-relaxed">
          {t.footer.text}
        </p>
      </footer>
    </div>
  );
}

export default App;
