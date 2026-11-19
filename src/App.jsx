import { useState, useEffect } from "react";
import Hero from "./components/Hero";
import ArticleSummarizer from "./components/ArticleSummarizer";
import ApiKeyModal from "./components/ApiKeyModal";
import { getActiveApiKey } from "./services/article";
import "./App.css";

const App = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(Boolean(getActiveApiKey()));

  const checkApiKey = () => {
    setHasApiKey(Boolean(getActiveApiKey()));
  };

  useEffect(() => {
    checkApiKey();
  }, []);

  return (
    <main>
      <div className="main">
        <div className="gradient" />
      </div>

      <div className="app">
        <Hero
          onOpenSettings={() => setIsSettingsOpen(true)}
          hasApiKey={hasApiKey}
        />
        <ArticleSummarizer
          onOpenSettings={() => setIsSettingsOpen(true)}
          hasApiKey={hasApiKey}
        />
      </div>

      <ApiKeyModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onKeyUpdated={checkApiKey}
      />
    </main>
  );
};

export default App;
