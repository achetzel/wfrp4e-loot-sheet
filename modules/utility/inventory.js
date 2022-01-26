class Inventory {

  /**
   * Handles Currency from currency.TYPE.value to currency.TYPE for backwords support
   * @param {string} folderPath - The directory to loop through
   */
  static convertCurrencyFromObject(currency) {
    Object.entries(currency).map(([key, value]) => {
      currency[key] = value.value ?? value;
    });
    return currency;
  }

}

export { Inventory };