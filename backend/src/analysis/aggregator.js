import { pluginManager } from "../plugins/pluginManager.js";

export function aggregate(fileFacts, metadata, dependencies) {
  const context = {
    dependencies,
    allImports: fileFacts.flatMap((f) => f.imports),
    fileExtensions: fileFacts.map((f) => `.${f.path.split(".").pop()}`),
    metadata,
  };

  const techStack = pluginManager.detectFrameworks(context);
  if (dependencies) {
    Object.keys(dependencies).forEach((dep) => {
      if (!techStack.includes(dep) && isSignificantDep(dep)) {
        techStack.push(dep);
      }
    });
  }

  const features = [];
  const allRoutes = fileFacts.flatMap((f) => f.routes);
  if (allRoutes.length > 0) features.push("REST API");
  if (techStack.includes("react")) features.push("Frontend Components");
  if (techStack.includes("express")) features.push("Backend Server");

  const structure = {};
  fileFacts.forEach((f) => {
    const dir = f.path.split("/")[0];
    if (dir && dir !== f.path) {
      structure[dir] = structure[dir] || [];
      if (structure[dir].length < 5) {
        // Limit for readability
        structure[dir].push(f.path);
      }
    }
  });

  return {
    name: metadata.name,
    description: metadata.description,
    techStack,
    features,
    routes: allRoutes.map((r) => `${r.method} ${r.path}`),
    projectType: techStack.includes("react")
      ? "Frontend Web App"
      : techStack.includes("express")
      ? "Backend API"
      : "General Project",
    structure,
    entryPoints: findEntryPoints(fileFacts),
  };
}

function isSignificantDep(dep) {
  const common = [
    "lodash",
    "axios",
    "dotenv",
    "chalk",
    "nodemon",
    "jest",
    "mocha",
  ];
  return (
    common.includes(dep) || dep.includes("middleware") || dep.includes("client")
  );
}

function findEntryPoints(fileFacts) {
  const common = [
    "index.js",
    "main.js",
    "app.js",
    "server.js",
    "index.jsx",
    "main.jsx",
  ];
  return fileFacts
    .filter((f) => common.includes(f.path.split("/").pop()))
    .map((f) => f.path);
}
