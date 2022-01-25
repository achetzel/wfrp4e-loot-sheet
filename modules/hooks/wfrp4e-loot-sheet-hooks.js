class Wfrp4eLootSheetHooks {
  /**
   * Hooks on game hooks and attaches methods
   */
  static init() {
    Hooks.once("init", Wfrp4eLootSheetHooks.foundryInit);
    Hooks.once("ready", Wfrp4eLootSheetHooks.foundryReady);
  }

  static foundryInit() {
    Handlebars.registerHelper('ifeq', function (a, b, options) {
      return (a == b) ? options.fn(this) : options.inverse(this);
    });
  }

  static foundryReady() {
    Handlebars.registerHelper('ifeq', function (a, b, options) {
      return (a == b) ? options.fn(this) : options.inverse(this);
    });
  }

}

export { Wfrp4eLootSheetHooks };