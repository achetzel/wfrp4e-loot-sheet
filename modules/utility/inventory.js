class Inventory {

  /**
   *
   * @param {Array<object>} items
   * @param {number} chanceOfDamagedItems
   * @param {number} damagedItemsMultiplier
   * @param {number} removeDamagedItems
   *
   * @returns {Array<Items>} items Filtered lootable items
   */
  static _getLootableItems(
    items,
    options = undefined
  ) {
    options = LootSheetNPC5eHelper._getOptionsDefault(options);

    return items
      /** .map((item) => {
                return item.toObject();
            })*/
      .filter((item) => {
        if (item.type == 'weapon') {
          return item.data.weaponType != 'natural';
        }

        if (item.type == 'equipment') {
          if (!item.data.armor) return true;
          return item.data.armor.type != 'natural';
        }

        return !['class', 'spell', 'feat'].includes(item.type);
      })
      .filter((item) => {
        if (LootSheetNPC5eHelper._isItemDamaged(item, options.chanceOfDamagedItems)) {
          if (options.removeDamagedItems) return false;

          item.name += ' (Damaged)';
          item.data.price *= options.damagedItemsMultiplier;
        }

        return true;
      })
      .map((item) => {
        item.data.equipped = false;
        return item;
      });
  }

}

export { Inventory };