import { useState } from "react";
import RepoInput from "./components/RepoInput";
import ReadmeViewer from "./components/ReadmeViewer";
import StatusPanel from "./components/StatusPanel";

function App() {
  const [loading, setLoading] = useState(false);
  const [readme, setReadme] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState(null);

  const handleGenerate = async (url) => {
    setLoading(true);
    setError("");
    setReadme("");
    setStatus(null);

    try {
      const response = await fetch("http://localhost:3000/generate-readme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl: url }),
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
    <div className="min-h-screen bg-neutral-900 text-neutral-100 p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
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
    </div>
  );
}

export default App;
