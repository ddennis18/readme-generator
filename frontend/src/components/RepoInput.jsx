import { useState } from "react";
import { Search, Loader2, Type, AlignLeft } from "lucide-react";

export default function RepoInput({ onGenerate, loading }) {
  const [url, setUrl] = useState("");
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url) onGenerate(url, projectName, description);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 space-y-4 shadow-xl"
    >
      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-400 ml-1">
          GitHub Repository URL
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            {loading ? (
              <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
            ) : (
              <Search className="h-5 w-5 text-neutral-500" />
            )}
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://github.com/user/repo"
            className="block w-full pl-11 pr-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-neutral-600"
            disabled={loading}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-400 ml-1">
            Project Name (Optional)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Type className="h-4 w-4 text-neutral-500" />
            </div>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g. Awesome App"
              className="block w-full pl-11 pr-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-neutral-600"
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-400 ml-1">
            Brief Description (Optional)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <AlignLeft className="h-4 w-4 text-neutral-500" />
            </div>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this do?"
              className="block w-full pl-11 pr-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-neutral-600"
              disabled={loading}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !url}
        className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:from-neutral-700 disabled:to-neutral-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Analyzing Core AST...
          </>
        ) : (
          "Generate Production README"
        )}
      </button>
    </form>
  );
}
