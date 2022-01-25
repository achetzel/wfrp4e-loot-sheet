import { Wfrp4eLootSheetNpc } from './modules/actor/wfrp4e-loot-sheet-actor.js';
import { Wfrp4eLootSheetHooks } from './modules/hooks/LootsheetNPC5eHooks.js';

//Register the loot sheet
Actors.registerSheet("wfrp4e", Wfrp4eLootSheetNpc, {
  types: ["npc"],
  makeDefault: false
});

