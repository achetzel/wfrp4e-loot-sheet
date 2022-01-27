import ActorSheetWfrp4eNPC from "/systems/wfrp4e/modules/actor/sheet/npc-sheet.js";
import { Permission } from "../utility/permission.js";
import { Inventory } from "../utility/inventory.js";

class Wfrp4eLootSheetNpc extends ActorSheetWfrp4eNPC {

  static get defaultOptions() {
    const options = super.defaultOptions;
    mergeObject(options,
      {
        classes: ["wfrp4e sheet actor npc npc-sheet loot-sheet-npc"],
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
      "modules/wfrp4e-loot-sheet/template/partials/header.html",
      "modules/wfrp4e-loot-sheet/template/partials/inventory.html",
      "modules/wfrp4e-loot-sheet/template/partials/notes.html"
    ];

    if (game.user.isGM) {
      templateList.push("modules/wfrp4e-loot-sheet/template/partials/gm-sidebar.html");
    }

    loadTemplates(templateList);

    if (!game.user.isGM && this.actor.limited) return "systems/wfrp4e/templates/actors/limited-sheet.html";

    return "modules/wfrp4e-loot-sheet/template/loot-sheet.html";

  }

  async getData() {

    console.log("Loot Sheet | Get Data");

    const sheetData = super.getData();
    sheetData.data = sheetData.data.data // project system data so that handlebars has the same name and value paths

    let items = {};
    items.inventory = this.constructInventory(sheetData);

    sheetData.items = items;

    console.log(sheetData);

    return sheetData;
  }

  constructInventory(sheetData) {
    // Inventory object is for the Trappings tab - each sub object is for an individual inventory section
    const categories = {
      weapons: {
        label: game.i18n.localize("WFRP4E.TrappingType.Weapon"),  // Label - what is displayed in the inventory section header
        items: sheetData.actor.getItemTypes("weapon"),            // Array of items in the sectio.filter(i => !i.location.value)n
      //  toggle: true,                                             // Is there a toggle in the section? (Equipped, worn, etc.)
      //  toggleName: game.i18n.localize("Equipped"),               // What is the name of the toggle in the header
        show: false,                                              // Should this section be shown (if an item exists in this list, it is set to true)
        dataType: "weapon"                                        // What type of FVTT Item is in this section (used by the + button to add an item of this type)
      },
      armor: {
        label: game.i18n.localize("WFRP4E.TrappingType.Armour"),
        items: sheetData.actor.getItemTypes("armour"),
      //  toggle: true,
      //  toggleName: game.i18n.localize("Worn"),
        show: false,
        dataType: "armour"
      },
      ammunition: {
        label: game.i18n.localize("WFRP4E.TrappingType.Ammunition"),
        items: sheetData.actor.getItemTypes("ammunition"),
        show: false,
        dataType: "ammunition"
      },
      clothingAccessories: {
        label: game.i18n.localize("WFRP4E.TrappingType.ClothingAccessories"),
        items: sheetData.actor.getItemTypes("trapping").filter(i => i.trappingType.value == "clothingAccessories"),
      //  toggle: true,
      //  toggleName: game.i18n.localize("Worn"),
        show: false,
        dataType: "trapping"
      },
      booksAndDocuments: {
        label: game.i18n.localize("WFRP4E.TrappingType.BooksDocuments"),
        items: sheetData.actor.getItemTypes("trapping").filter(i => i.trappingType.value == "booksAndDocuments"),
        show: false,
        dataType: "trapping"
      },
      toolsAndKits: {
        label: game.i18n.localize("WFRP4E.TrappingType.ToolsKits"),
        items: sheetData.actor.getItemTypes("trapping").filter(i => i.trappingType.value == "toolsAndKits" || i.trappingType.value == "tradeTools"),
        show: false,
        dataType: "trapping"
      },
      foodAndDrink: {
        label: game.i18n.localize("WFRP4E.TrappingType.FoodDrink"),
        items: sheetData.actor.getItemTypes("trapping").filter(i => i.trappingType.value == "foodAndDrink"),
        show: false,
        dataType: "trapping"
      },
      drugsPoisonsHerbsDraughts: {
        label: game.i18n.localize("WFRP4E.TrappingType.DrugsPoisonsHerbsDraughts"),
        items: sheetData.actor.getItemTypes("trapping").filter(i => i.trappingType.value == "drugsPoisonsHerbsDraughts"),
        show: false,
        dataType: "trapping"
      },
      misc: {
        label: game.i18n.localize("WFRP4E.TrappingType.Misc"),
        items: sheetData.actor.getItemTypes("trapping").filter(i => i.trappingType.value == "misc" || !i.trappingType.value),
        show: true,
        dataType: "trapping"
      },
      cargo: {
        label: game.i18n.localize("WFRP4E.TrappingType.Cargo"),
        items: sheetData.actor.getItemTypes("cargo"),
        show: false,
        dataType: "cargo"
      }
    }

    // Money and ingredients are not in inventory object because they need more customization - note in actor-inventory.html that they do not exist in the main inventory loop
    const ingredients = {
      label: game.i18n.localize("WFRP4E.TrappingType.Ingredient"),
      items: sheetData.actor.getItemTypes("trapping").filter(i => i.trappingType.value == "ingredient"),
      show: false,
      dataType: "trapping"
    }
    const money = {
      items: sheetData.actor.getItemTypes("money"),
      total: 0,     // Total coinage value
      show: true
    }
    const containers = {
      items: sheetData.actor.getItemTypes("container"),
      show: false
    }

    const misc = {}
    let inContainers = []; // inContainers is the temporary storage for items within a container
    for (let itemCategory in categories) {
      inContainers = this._filterItemCategory(categories[itemCategory], inContainers);
    }

    categories.misc.items = categories.misc.items.concat(ingredients.items)

    misc.totalShieldDamage = categories["weapons"].items.reduce((prev, current) => prev += current.damageToItem.shield, 0)

    money.total = money.items.reduce((prev, current) => { return prev + (current.coinValue.value * current.quantity.value) }, 0)

    categories.misc.show = true

    return {
      categories,
      ingredients,
      money,
      containers,
      misc
    }
  }

  _filterItemCategory(category, itemsInContainers) {
    itemsInContainers = itemsInContainers.concat(category.items.filter(i => !!i.location?.value))
    category.items = category.items.filter(i => !i.location?.value)
    category.show = category.items.length > 0
    return itemsInContainers
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
    // let currencySplit = duplicate(Inventory.convertCurrencyFromObject(actorData.data.currency));
    // for (let c in currencySplit) {
    //   if (observers.length) {
    //     if (currencySplit[c] != null) {
    //       currencySplit[c] = Math.floor(currencySplit[c] / observers.length);
    //     } else {
    //       currencySplit[c] = 0;
    //     }
    //   }
    // }

    let loot = {};
    loot.players = playerData;
    loot.observerCount = observers.length;
//    loot.currency = currencySplit;
    loot.permissions = permissionsInfo;
    loot.playersPermission = commonPlayersPermission;
    loot.playersPermissionIcon = Permission.getPermissionInfo(commonPlayersPermission);
    loot.playersPermissionDescription = Permission.getPermissionInfo(commonPlayersPermission)?.description;
    actorData.flags.loot = loot;
  }

}

export { Wfrp4eLootSheetNpc };