import ActorSheetWfrp4eNPC from "/systems/wfrp4e/modules/actor/sheet/actor-sheet.js";

class Wfrp4eLootSheetNpc extends ActorSheetWfrp4eNPC {

  static get defaultOptions() {
    const options = super.defaultOptions;
    mergeObject(options,
      {
        classes: ["wfrp4e actor npc npc-sheet"],
      });
    return options;
  }

  /**
   * Get the correct HTML template path to use for rendering this particular sheet
   * @type {String}
   */
  get template() {

    const sheetType = 'default';

    let templateList = [
      "modules/wfrp4e-loot-sheet/template/loot-sheet.html",
      "modules/wfrp4e-loot-sheet/template/partials/inventory.html"
    ];

    if (game.user.isGM) {
      templateList.push("modules/wfrp4e-loot-sheet/template/partials/gm-sidebar.html");
    }

    loadTemplates(templateList);

    if (!game.user.isGM && this.actor.limited) return "systems/wfrp4e/templates/actors/limited-sheet.html";

    return "modules/wfrp4e-loot-sheet/template/loot-sheet.html";

  }

  async getData() {
    console.log("Loot Sheet | getData")

    const sheetData = await super.getData();
  }

  /* -------------------------------------------- */
  /*  Event Listeners and Handlers
  /* -------------------------------------------- */

  /**
   * Activate event listeners using the prepared sheet HTML
   * @param html {HTML}   The prepared HTML object ready to be rendered into the DOM
   */
  async activateListeners(html) {
    console.log("Loot Sheet | activateListeners")
    super.activateListeners(html);
  }

  async _onSubmit(e) {
    e.preventDefault();
    let options = {},
      inventorySettings = document.querySelector('.inventory-settings');

    if (game.user.isGM && inventorySettings && inventorySettings.contains(e.currentTarget)) {
      options.preventClose = true;
      options.preventRender = true;
    }

    super._onSubmit(e, options);
  }

}

export { Wfrp4eLootSheetNpc };