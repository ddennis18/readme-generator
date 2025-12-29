export class PluginManager {
  constructor() {
    this.plugins = [];
  }

  register(plugin) {
    this.plugins.push(plugin);
  }

  detectFrameworks(context) {
    const frameworks = [];
    for (const plugin of this.plugins) {
      if (plugin.detect(context)) {
        frameworks.push(plugin.name);
      }
    }
    return frameworks;
  }

  enrich(fileAst, context) {
    for (const plugin of this.plugins) {
      if (plugin.detect(context)) {
        plugin.enrich(fileAst, context);
      }
    }
  }
}

export const pluginManager = new PluginManager();
