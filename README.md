# Full-Stack README Generator (AST + Gemini)

A production-grade tool that generates high-quality `README.md` files by performing deterministic AST analysis on your codebase.

## Architecture

- **Backend**: Node.js, Express, Tree-sitter, Google Gemini API.
- **Frontend**: React, Tailwind CSS, Vite.
- **Analysis**: Pure AST extraction (no regex), plugin-based enrichment.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Google Gemini API Key](https://ai.google.dev/)
- [GitHub Personal Access Token](https://github.com/settings/tokens)

### Setup

1. **Clone the repo**
2. **Setup Backend**
   ```bash
   cd backend
   # Create .env and add your keys
   npm install
   npm start
   ```
3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Environment Variables

Create a `backend/.env` file:
```env
GITHUB_TOKEN=your_github_token
GEMINI_API_KEY=your_gemini_api_key
PORT=3000
```

## How it works

1. **AST Extraction**: Tree-sitter parses your code into a concrete syntax tree.
2. **Fact Normalization**: We extract language-agnostic facts (imports, exports, routes, components).
3. **Plugin Enrichment**: Framework-specific plugins (Express, React) add semantic meaning to the facts.
4. **LLM Synthesis**: The aggregated JSON facts are sent to Google Gemini to write the final README prose. No raw code ever leaves your machine.
