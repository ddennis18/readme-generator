export const expressPlugin = {
  name: "express",
  detect(context) {
    // Detect express in dependencies or by common patterns
    const hasExpressDep =
      context.dependencies &&
      (context.dependencies.express || context.dependencies.fastify);
    const hasExpressImports =
      context.allImports &&
      context.allImports.some((i) => i.includes("express"));
    return hasExpressDep || hasExpressImports;
  },
  enrich(fileAst, context) {
    // Further refine route detection if needed
    // Already handled basically in astExtractor, but could be more specific here
    if (fileAst.routes.length > 0) {
      fileAst.kind = "api-route";
    }
  },
};
