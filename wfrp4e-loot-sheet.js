import { Wfrp4eLootSheetNpc } from './modules/actor/wfrp4e-loot-sheet-actor.js';

//Register the loot sheet
Actors.registerSheet("wfrp4e", Wfrp4eLootSheetNpc, {
  types: ["actor"],
  makeDefault: false
});

