import { useState } from "react";
import { getActiveApiKey, setActiveApiKey } from "../services/article";

const ApiKeyModal = ({ isOpen, onClose, onKeyUpdated }) => {
  const [keyInput, setKeyInput] = useState(getActiveApiKey() || "");
  const [savedStatus, setSavedStatus] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setActiveApiKey(keyInput.trim());
    setSavedStatus(true);
    if (onKeyUpdated) onKeyUpdated();
    setTimeout(() => {
      setSavedStatus(false);
      onClose();
    }, 800);
  };

  const handleClear = () => {
    setKeyInput("");
    setActiveApiKey("");
    if (onKeyUpdated) onKeyUpdated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 flex flex-col gap-4">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="font-satoshi font-bold text-gray-800 text-lg">
            API Configuration
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 font-bold text-lg p-1"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed font-inter">
          This project uses Google&apos;s latest high-speed <strong>Gemini 3.8 Flash</strong> for summarization. 
          Get a 100% free API key from Google AI Studio (no credit card required).
        </p>

        <a
          href="https://aistudio.google.com/app/apikey"
          target="_blank"
          rel="noreferrer"
          className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-medium"
        >
          ↗ Get your free Gemini API Key at Google AI Studio
        </a>

        <form onSubmit={handleSave} className="flex flex-col gap-3">
          <label className="text-xs font-semibold text-gray-700">
            Gemini API Key
          </label>
          <input
            type="password"
            placeholder="AIzaSy..."
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-red-500 hover:underline"
            >
              Clear Key
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg border border-gray-300 text-xs text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-black text-xs text-white hover:bg-gray-800 transition"
              >
                {savedStatus ? "Saved!" : "Save Key"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApiKeyModal;
