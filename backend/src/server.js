import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chalk from "chalk";
import {
  fetchRepoMetadata,
  fetchFileTree,
  fetchFileContent,
} from "./github/githubClient.js";
import { getLanguageByExtension } from "./parser/languageRegistry.js";
import { extractFacts } from "./parser/astExtractor.js";
import { pluginManager } from "./plugins/pluginManager.js";
import { expressPlugin } from "./plugins/express.plugin.js";
import { reactPlugin } from "./plugins/react.plugin.js";
import { aggregate } from "./analysis/aggregator.js";
import { generateReadme } from "./generator/readmeGenerator.js";

import { fileURLToPath } from "url";
import path from "path";

dotenv.config();

// Register plugins
pluginManager.register(expressPlugin);
pluginManager.register(reactPlugin);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files from the frontend/dist directory
const frontendDistPath = path.join(__dirname, "../../frontend/dist");
app.use(express.static(frontendDistPath));

app.post("/generate-readme", async (req, res) => {
  const { repoUrl, projectName, projectDescription } = req.body;
  if (!repoUrl) {
    return res.status(400).json({ error: "repoUrl is required" });
  }

  try {
    console.log(chalk.blue(`Analyzing repository: ${repoUrl}`));

    const [owner, repo] = repoUrl.replace("https://github.com/", "").split("/");
    if (!owner || !repo) {
      throw new Error("Invalid GitHub URL");
    }

    // 1. Fetch metadata and file tree
    const metadata = await fetchRepoMetadata(owner, repo);
    const fileTree = await fetchFileTree(owner, repo);

    // 2. Filter relevant files and parse
    const fileFacts = [];
    let dependencies = {};

    for (const item of fileTree) {
      const language = getLanguageByExtension(item.path);
      if (language) {
        console.log(chalk.gray(`Parsing: ${item.path}`));
        const content = await fetchFileContent(owner, repo, item.path);
        if (content) {
          const facts = extractFacts(content, language, item.path);
          if (facts) {
            // Enrich with plugins
            pluginManager.enrich(facts, { dependencies, metadata });
            fileFacts.push(facts);
          }
        }
      } else if (item.path === "package.json") {
        const content = await fetchFileContent(owner, repo, item.path);
        if (content) {
          const pkg = JSON.parse(content);
          dependencies = { ...pkg.dependencies, ...pkg.devDependencies };
        }
      }
    }

    // 3. Aggregate
    const aggregatedData = aggregate(fileFacts, metadata, dependencies);
    console.log(chalk.green(`Aggregation complete for ${metadata.name}`));

    // 4. Generate README
    const readme = await generateReadme(aggregatedData, {
      projectName,
      projectDescription,
    });

    res.json({
      readme,
      confidence: "high",
      warnings: [],
    });
  } catch (error) {
    console.error(chalk.red("Error generating README:"), error.message);
    res.status(500).json({ error: error.message });
  }
});

// All other GET requests not handled before will return the React app
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendDistPath, "index.html"));
});

app.listen(port, () => {
  console.log(
    chalk.magenta(`Backend server running on http://localhost:${port}`)
  );
});
