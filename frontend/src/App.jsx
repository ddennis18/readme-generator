import { useState } from "react";
import { Github, Globe, Mail, Twitter, Linkedin, Sparkles } from "lucide-react";
import RepoInput from "./components/RepoInput";
import ReadmeViewer from "./components/ReadmeViewer";
import StatusPanel from "./components/StatusPanel";

function App() {
  const [loading, setLoading] = useState(false);
  const [readme, setReadme] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState(null);

  const handleGenerate = async (url, projectName, description) => {
    setLoading(true);
    setError("");
    setReadme("");
    setStatus(null);

    try {
      const response = await fetch("/generate-readme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoUrl: url,
          projectName,
          projectDescription: description,
        }),
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setReadme(data.readme);
      setStatus({ confidence: data.confidence, warnings: data.warnings });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 p-8 font-sans flex flex-col">
      <div className="max-w-4xl mx-auto space-y-8 flex-grow w-full">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            README Generator
          </h1>
          <p className="text-neutral-400">
            Deterministic AST-based documentation for your codebase.
          </p>
        </header>

        <RepoInput onGenerate={handleGenerate} loading={loading} />

        {error && (
          <div className="bg-red-900/50 border border-red-500/50 text-red-200 p-4 rounded-lg">
            {error}
          </div>
        )}

        {status && <StatusPanel status={status} />}

        {readme && <ReadmeViewer content={readme} />}
      </div>

      <footer className="max-w-4xl mx-auto w-full mt-16 pt-8 border-t border-neutral-800 pb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2 text-center md:text-left">
            <p className="text-sm font-medium text-neutral-500 flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              This project was{" "}
              <span className="text-neutral-300">vibe coded</span> by{" "}
              <span className="text-blue-400 font-semibold">Darius Dennis</span>
            </p>
            <p className="text-xs text-neutral-600">
              Built with Tree-sitter + Google Gemini
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://dariusdennis-webspace.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors text-neutral-400 hover:text-white"
              title="Portfolio"
            >
              <Globe className="h-5 w-5" />
            </a>
            <a
              href="mailto:osemwonken18@gmail.com"
              className="p-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors text-neutral-400 hover:text-white"
              title="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
            <a
              href="https://x.com/dennis_builds"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors text-neutral-400 hover:text-white"
              title="Twitter / X"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/osemwonken-osemwegie-84ba5a299/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors text-neutral-400 hover:text-white"
              title="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
