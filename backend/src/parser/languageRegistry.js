export const EXTENSION_MAP = {
  ".js": "javascript",
  ".jsx": "jsx",
  ".mjs": "javascript",
  ".cjs": "javascript",
  ".py": "python",
  ".html": "html",
  ".htm": "html",
};

export function getLanguageByExtension(filename) {
  const ext = "." + filename.split(".").pop().toLowerCase();
  return EXTENSION_MAP[ext] || null;
}
