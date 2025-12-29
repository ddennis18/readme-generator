import { useState } from "react";
import { Search, Loader2 } from "lucide-react";

export default function RepoInput({ onGenerate, loading }) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url) onGenerate(url);
  };

  return (
    <form onSubmit={handleSubmit} className="relative group">
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
        className="block w-full pl-11 pr-32 py-4 bg-neutral-800 border border-neutral-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-neutral-600"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading || !url}
        className="absolute inset-y-2 right-2 px-6 bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
      >
        {loading ? "Generating..." : "Generate"}
      </button>
    </form>
  );
}
