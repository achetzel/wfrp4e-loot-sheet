import { Wfrp4eLootSheetNpc } from './modules/actor/wfrp4e-loot-sheet-npc.js';
import { Wfrp4eLootSheetHooks } from './modules/hooks/wfrp4e-loot-sheet-hooks.js';

//Register the loot sheet
Actors.registerSheet("wfrp4e", Wfrp4eLootSheetNpc, {
  types: ["npc"],
  makeDefault: false
});

Wfrp4eLootSheetHooks.init();
