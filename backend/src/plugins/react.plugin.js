export const reactPlugin = {
  name: "react",
  detect(context) {
    const hasReactDep =
      context.dependencies &&
      (context.dependencies.react || context.dependencies.next);
    const hasReactFiles =
      context.fileExtensions &&
      (context.fileExtensions.includes(".jsx") ||
        context.fileExtensions.includes(".tsx"));
    return hasReactDep || hasReactFiles;
  },
  enrich(fileAst, context) {
    if (fileAst.language === "jsx") {
      fileAst.kind = "component";
      // Basic component detection: exported functions starting with uppercase
      const exportedFunctions = fileAst.functions.filter((f) =>
        /^[A-Z]/.test(f.name)
      );
      if (exportedFunctions.length > 0) {
        fileAst.components = exportedFunctions.map((f) => f.name);
      }
    }
  },
};
