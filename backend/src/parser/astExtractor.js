import { setLanguage, parseCode } from "./treeSitter.js";

export function extractFacts(code, language, path) {
  if (!setLanguage(language)) return null;
  const tree = parseCode(code);
  const root = tree.rootNode;

  const facts = {
    path,
    language,
    kind: "module",
    imports: [],
    exports: [],
    functions: [],
    classes: [],
    routes: [], // To be enriched by plugins or detected here
    components: [], // To be enriched by plugins
    visibility: "public",
  };

  if (language === "javascript" || language === "jsx") {
    extractJSFacts(root, facts);
  } else if (language === "python") {
    extractPythonFacts(root, facts);
  }

  return facts;
}

function extractJSFacts(node, facts) {
  // Simple traversal to find top-level declarations
  for (const child of node.children) {
    if (child.type === "import_statement") {
      facts.imports.push(child.text);
    } else if (child.type === "export_statement") {
      facts.exports.push(child.text);
    } else if (child.type === "function_declaration") {
      const nameNode = child.childForFieldName("name");
      if (nameNode)
        facts.functions.push({
          name: nameNode.text,
          async: child.text.includes("async"),
        });
    } else if (child.type === "class_declaration") {
      const nameNode = child.childForFieldName("name");
      if (nameNode) facts.classes.push({ name: nameNode.text });
    } else if (child.type === "expression_statement") {
      // Crude route detection for MVP - can be refined in plugins
      const text = child.text;
      if (
        text.includes("app.get(") ||
        text.includes("app.post(") ||
        text.includes("router.get(") ||
        text.includes("router.post(")
      ) {
        detectRoutes(child, facts);
      }
    }
  }
}

function detectRoutes(node, facts) {
  // Very basic extraction for now
  const text = node.text;
  const match = text.match(
    /(app|router)\.(get|post|put|delete|patch)\(['"](.+?)['"]/
  );
  if (match) {
    facts.routes.push({
      method: match[2].toUpperCase(),
      path: match[3],
      handler: "anonymous", // simplified
    });
  }
}

function extractPythonFacts(node, facts) {
  for (const child of node.children) {
    if (
      child.type === "import_statement" ||
      child.type === "import_from_statement"
    ) {
      facts.imports.push(child.text);
    } else if (child.type === "function_definition") {
      const nameNode = child.childForFieldName("name");
      if (nameNode) facts.functions.push({ name: nameNode.text });
    } else if (child.type === "class_definition") {
      const nameNode = child.childForFieldName("name");
      if (nameNode) facts.classes.push({ name: nameNode.text });
    }
  }
}
