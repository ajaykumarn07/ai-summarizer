import { useEffect, useState } from "react";
import { copy, linkIcon, loader, tick } from "../assets";
import { summarizeArticle, summarizeDirectText } from "../services/article";

const ArticleSummarizer = ({ onOpenSettings, hasApiKey }) => {
  const [mode, setMode] = useState("url"); // "url" | "text"
  const [article, setArticle] = useState({
    url: "",
    title: "",
    summary: "",
    isLocalPreview: false,
  });

  const [pastedText, setPastedText] = useState("");
  const [allArticles, setAllArticles] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);
  const [copiedUrl, setCopiedUrl] = useState("");
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [summaryLength, setSummaryLength] = useState("medium");

  useEffect(() => {
    try {
      const articlesFromLocalStorage = JSON.parse(
        localStorage.getItem("articles")
      );
      if (Array.isArray(articlesFromLocalStorage)) {
        setAllArticles(articlesFromLocalStorage);
      }
    } catch (e) {
      console.error("Failed to load articles from localStorage:", e);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsFetching(true);
    setError(null);

    try {
      let data;
      if (mode === "url") {
        if (!article.url.trim()) return;
        data = await summarizeArticle(article.url.trim());
      } else {
        if (!pastedText.trim()) return;
        data = await summarizeDirectText(pastedText.trim());
      }

      const newArticle = {
        url: mode === "url" ? article.url.trim() : "Pasted Text",
        title: data.title || (mode === "url" ? article.url.trim() : "Custom Text"),
        summary: data.summary,
        summaries: data.summaries,
        summaryLength: "medium",
        isLocalPreview: Boolean(data.isLocalPreview),
      };

      // Deduplicate history
      const updatedAllArticles = [
        newArticle,
        ...allArticles.filter((item) => item.url !== newArticle.url || item.url === "Pasted Text"),
      ].slice(0, 10);

      setArticle(newArticle);
      setSummaryLength("medium");
      setAllArticles(updatedAllArticles);
      localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
    } catch (err) {
      console.error("Summarization error:", err);
      setError(err?.message || "Failed to process content.");
    } finally {
      setIsFetching(false);
    }
  };

  const handleCopyUrl = (e, targetUrl) => {
    e.stopPropagation();
    setCopiedUrl(targetUrl);
    navigator.clipboard.writeText(targetUrl);
    setTimeout(() => setCopiedUrl(""), 2500);
  };

  const handleDeleteItem = (e, targetUrl) => {
    e.stopPropagation();
    const updated = allArticles.filter((item) => item.url !== targetUrl);
    setAllArticles(updated);
    localStorage.setItem("articles", JSON.stringify(updated));

    if (article.url === targetUrl) {
      setArticle({ url: "", title: "", summary: "", isLocalPreview: false });
    }
  };

  const handleClearHistory = () => {
    if (window.confirm("Clear all recent article history?")) {
      setAllArticles([]);
      localStorage.removeItem("articles");
    }
  };

  const handleCopySummary = () => {
    const summary = article.summaries?.[summaryLength] || article.summary;
    if (!summary) return;
    navigator.clipboard.writeText(summary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  const visibleSummary = article.summaries?.[summaryLength] || article.summary;

  return (
    <section className="mt-12 w-full max-w-xl">
      <div className="flex flex-col w-full gap-3">
        {/* Mode Switcher */}
        <div className="flex items-center gap-2 text-xs text-gray-500 px-1">
          <div className="inline-flex rounded-lg border border-gray-200 bg-white/80 p-0.5 shadow-sm">
            <button
              type="button"
              onClick={() => {
                setMode("url");
                setError(null);
              }}
              className={`px-3 py-1 font-medium rounded-md transition-all ${
                mode === "url"
                  ? "bg-black text-white shadow-sm"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              URL Link
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("text");
                setError(null);
              }}
              className={`px-3 py-1 font-medium rounded-md transition-all ${
                mode === "text"
                  ? "bg-black text-white shadow-sm"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              Paste Text
            </button>
          </div>

        </div>

        {/* Input Form */}
        <form
          className="relative flex flex-col justify-center items-center gap-2"
          onSubmit={handleSubmit}
        >
          {mode === "url" ? (
            <div className="relative w-full">
              <img
                src={linkIcon}
                alt="linkIcon"
                className="absolute left-0 top-1/2 -translate-y-1/2 ml-3 w-5"
              />
              <input
                type="url"
                placeholder="Paste an article link (e.g. https://...)"
                value={article.url}
                onChange={(e) => {
                  setArticle({ ...article, url: e.target.value });
                  if (error) setError(null);
                }}
                required
                className="url_input peer"
              />
              <button
                type="submit"
                disabled={isFetching}
                className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700 hover:bg-gray-100"
                title="Summarize"
              >
                <p>↵</p>
              </button>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-2">
              <textarea
                rows={4}
                placeholder="Paste article text or paragraphs directly here..."
                value={pastedText}
                onChange={(e) => {
                  setPastedText(e.target.value);
                  if (error) setError(null);
                }}
                required
                className="w-full rounded-md border border-gray-200 bg-white p-3 text-sm shadow-md font-inter focus:border-black focus:outline-none"
              />
              <button
                type="submit"
                disabled={isFetching}
                className="self-end px-5 py-2 rounded-lg bg-black text-white text-xs font-medium hover:bg-gray-800 transition shadow-sm"
              >
                Summarize Text ↵
              </button>
            </div>
          )}
        </form>

        {/* Browse History */}
        {allArticles.length > 0 && (
          <div className="flex flex-col gap-1 mt-2">
            <div className="flex justify-between items-center px-1 text-xs text-gray-500 font-medium">
              <span>Recent Summaries ({allArticles.length})</span>
              <button
                type="button"
                onClick={handleClearHistory}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                Clear all
              </button>
            </div>

            <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto pr-1">
              {allArticles.map((item, index) => (
                <div
                  key={`link-${index}`}
                  onClick={() => {
                    setArticle(item);
                    setSummaryLength(item.summaryLength || "medium");
                  }}
                  className={`link_card transition-all hover:border-gray-400 ${
                    article.url === item.url ? "border-black shadow-sm" : ""
                  }`}
                >
                  <button
                    type="button"
                    className="copy_btn"
                    title="Copy Link/Text"
                    onClick={(e) => handleCopyUrl(e, item.url)}
                  >
                    <img
                      src={copiedUrl === item.url ? tick : copy}
                      alt="copy_icon"
                      className="w-3.5 h-3.5 object-contain"
                    />
                  </button>

                  <div className="flex-1 min-w-0">
                    {item.title && (
                      <p className="font-satoshi text-gray-800 text-xs font-semibold truncate">
                        {item.title}
                      </p>
                    )}
                    <p className="font-satoshi text-blue-600 font-medium text-xs truncate">
                      {item.url}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleDeleteItem(e, item.url)}
                    className="text-gray-300 hover:text-red-500 text-xs px-1.5 py-0.5 rounded transition-colors"
                    title="Remove from history"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Summary Output Area */}
      <div className="my-10 max-w-full flex justify-center items-center">
        {isFetching ? (
          <div className="flex flex-col items-center gap-2">
            <img src={loader} alt="loader" className="w-16 h-16 object-contain" />
            <p className="font-inter text-xs text-gray-500 animate-pulse">
              Reading article and creating summary styles...
            </p>
          </div>
        ) : error ? (
          <div className="w-full rounded-xl border border-red-200 bg-red-50/70 p-4 text-center">
            <p className="font-inter font-bold text-red-700 text-sm">
              Unable to read or summarize this content
            </p>
            <p className="font-satoshi text-xs text-red-600 mt-1 max-w-md mx-auto">
              {error}
            </p>
            <div className="flex justify-center gap-2 mt-3">
              <button
                type="button"
                onClick={() => setMode("text")}
                className="px-3 py-1 rounded-md border border-gray-300 bg-white text-xs font-medium hover:bg-gray-50"
              >
                Try Pasting Text Directly
              </button>
              {!hasApiKey && (
                <button
                  type="button"
                  onClick={onOpenSettings}
                  className="px-3 py-1 rounded-md bg-black text-white text-xs font-medium hover:bg-gray-800"
                >
                  Set Free Gemini Key
                </button>
              )}
            </div>
          </div>
        ) : (
          article.summary && (
            <div className="flex flex-col gap-3 w-full">
              <div className="flex justify-between items-center">
                <h2 className="font-satoshi font-bold text-gray-700 text-xl">
                  Article <span className="blue_gradient">Summary</span>
                </h2>
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-black border border-gray-200 rounded-lg px-2.5 py-1 bg-white shadow-sm transition"
                >
                  <img
                    src={copiedSummary ? tick : copy}
                    alt="copy"
                    className="w-3.5 h-3.5 object-contain"
                  />
                  <span>{copiedSummary ? "Copied!" : "Copy Summary"}</span>
                </button>
              </div>

              {article.title && (
                <p className="font-satoshi font-bold text-sm text-gray-900 border-b pb-2">
                  {article.title}
                </p>
              )}

              {article.summaries && (
                <div
                  className="inline-flex self-start rounded-lg border border-gray-200 bg-white/80 p-0.5 shadow-sm"
                  aria-label="Summary style"
                >
                  {[
                    { id: "short", label: "Key Bullets" },
                    { id: "medium", label: "Standard" },
                    { id: "long", label: "Detailed" },
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={summaryLength === option.id}
                      onClick={() => setSummaryLength(option.id)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                        summaryLength === option.id
                          ? "bg-black text-white shadow-sm"
                          : "text-gray-600 hover:text-black"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}

              {article.isLocalPreview && !hasApiKey && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <span>
                    ⚡ <strong>Quick preview:</strong> Connect your free Gemini key to get full AI bullet points & analysis.
                  </span>
                  <button
                    type="button"
                    onClick={onOpenSettings}
                    className="px-2.5 py-1 bg-amber-600 text-white rounded font-medium hover:bg-amber-700 shrink-0 text-xs shadow-sm"
                  >
                    Connect Free Key
                  </button>
                </div>
              )}

              <div className="summary_box">
                <p className="font-inter font-normal text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                  {visibleSummary}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default ArticleSummarizer;
