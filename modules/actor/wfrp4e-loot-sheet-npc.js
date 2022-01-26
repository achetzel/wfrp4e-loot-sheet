import ActorSheetWfrp4eNPC from "/systems/wfrp4e/modules/actor/sheet/npc-sheet.js";
import { Permission } from "../utility/permission.js";
import {Inventory} from "../utility/inventory";

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

    this._prepareGMSettings(sheetData.actor);

    let itemContents = sheetData.actor.items;

    // Booleans
    sheetData.isGM = (game.user.isGM) ? true : false;

    // Items
    sheetData.items = itemContents;

    return sheetData;

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

  /* -------------------------------------------- */
  /* -------------------------------------------- */

  /**
   * Prepares GM settings to be rendered by the loot sheet.
   * @private
   * @param {Actor|object} actorData
   */

  _prepareGMSettings(actorData) {
    const playerData = [],
      observers = [],
      permissionsInfo = Permission.getPermissionInfo();
    let players = game.users.players,
      commonPlayersPermission = -1;

    for (let player of players) {
      // get the name of the primary actor for a player
      const actor = game.actors.get(player.data.character);

      if (actor) {
        player.actor = actor.data.name;
        player.actorId = actor.data._id;
        player.playerId = player.data._id;
        player.lootPermission = Permission.getLootPermissionForPlayer(actorData, player);

        if (player.lootPermission >= 2 && !observers.includes(actor.data._id)) {
          observers.push(actor.data._id);
        }

        if (commonPlayersPermission < 0) {
          commonPlayersPermission = player.lootPermission;
        } else if (commonPlayersPermission !== player.lootPermission) {
          commonPlayersPermission = 0;
        }

        const lootPermissionInfo = Permission.getPermissionInfo(player.lootPermission);
        player.class = lootPermissionInfo.class;
        player.lootPermissionDescription = lootPermissionInfo.description;
        playerData.push(player);
      }
    }

    // calculate the split of coins between all observers of the sheet.
    let currencySplit = duplicate(Inventory.convertCurrencyFromObject(actorData.data.currency));
    for (let c in currencySplit) {
      if (observers.length) {
        if (currencySplit[c] != null) {
          currencySplit[c] = Math.floor(currencySplit[c] / observers.length);
        } else {
          currencySplit[c] = 0;
        }
      }
    }

    let loot = {}
    loot.players = playerData;
    loot.observerCount = observers.length;
    loot.currency = currencySplit;
    loot.permissions = permissionsInfo;
    loot.playersPermission = commonPlayersPermission;
    loot.playersPermissionIcon = Permission.getPermissionInfo(commonPlayersPermission);
    loot.playersPermissionDescription = Permission.getPermissionInfo(commonPlayersPermission)?.description;
    actorData.flags.loot = loot;
  }

}

export { Wfrp4eLootSheetNpc };