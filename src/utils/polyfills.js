// src/utils/polyfills.js

export const applyArrayPolyfills = () => {
  if (!Array.prototype.findLast) {
    Object.defineProperty(Array.prototype, 'findLast', {
      value: function (predicate, thisArg) {
        for (let i = this.length - 1; i >= 0; i--) {
          if (predicate.call(thisArg, this[i], i, this)) return this[i];
        }
        return undefined;
      },
    });
  }

  if (!Array.prototype.findLastIndex) {
    Object.defineProperty(Array.prototype, 'findLastIndex', {
      value: function (predicate, thisArg) {
        for (let i = this.length - 1; i >= 0; i--) {
          if (predicate.call(thisArg, this[i], i, this)) return i;
        }
        return -1;
      },
    });
  }
};
