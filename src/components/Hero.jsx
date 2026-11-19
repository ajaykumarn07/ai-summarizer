import { logo } from "../assets";

const Hero = ({ onOpenSettings, hasApiKey }) => {
  return (
    <header className="w-full flex justify-center items-center flex-col">
      <nav className="flex justify-between items-center w-full mb-10 pt-3 gap-2">
        <img className="w-28 object-contain" src={logo} alt="sumz-Logo" />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenSettings}
            className={`text-xs sm:text-sm font-medium py-1.5 px-3.5 rounded-full border transition-all ${
              hasApiKey
                ? "border-emerald-500 text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                : "border-amber-500 text-amber-700 bg-amber-50 hover:bg-amber-100"
            }`}
          >
            {hasApiKey ? "● AI Ready" : "⚡ Set API Key"}
          </button>
          <button
            className="black_btn"
            type="button"
            onClick={() => window.open("https://github.com/ajaykumarn07", "_blank")}
          >
            GitHub
          </button>
        </div>
      </nav>

      <h1 className="head_text">
        Summarize Articles with <br className="max-md:hidden" />
        <span className="orange_gradient">AI & Gemini</span>
      </h1>
      <h2 className="desc">
        Simplify your reading with Summize, a modern article summarizer
        that transforms lengthy web articles into clear, concise takeaways.
      </h2>
    </header>
  );
};

export default Hero;
