import ActorSheetWfrp4eNPC from "/systems/wfrp4e/modules/actor/sheet/actor-sheet.js";

class Wfrp4eLootSheetNpc extends ActorSheetWfrp4eNPC {

  static get defaultOptions() {
    const options = super.defaultOptions;
    mergeObject(options,
      {
        classes: options.classes.concat(["wfrp4e", "actor", "actor-sheet"]),
        width: 610,
        height: 740,
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

}