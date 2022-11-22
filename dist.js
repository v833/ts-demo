"use strict";
(() => {
  // src/localStorageFactory.ts
  var LocalStorageFactory = class {
    constructor() {
    }
    setItem(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    }
    getItem(key) {
      const result = localStorage.getItem(key);
      return result ? JSON.parse(result) : null;
    }
  };
  var myLocal = new LocalStorageFactory();

  // src/index.ts
  console.log("myLocal: ", myLocal);
})();
