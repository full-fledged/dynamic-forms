// Forked form https://github.com/hughsk/flat

export class FlatUtils {

  public static flatten(target, opts?) {
    opts = opts || {};

    const delimiter = opts.delimiter || '.';
    const maxDepth = opts.maxDepth;
    const output = {};

    function step(object, prev?, currentDepth?) {
      currentDepth = currentDepth || 1;
      Object.keys(object)
        .forEach((key) => {
          const value = object[key];
          const isarray = opts.safe && Array.isArray(value);
          const type = Object.prototype.toString.call(value);
          const isbuffer = FlatUtils.isBuffer(value);

          const isobject = opts.skipArrays ?
            (type === '[object Object]') :
            (type === '[object Object]' || type === '[object Array]');

          const newKey = prev
            ? prev + delimiter + key
            : key;

          if (!isarray && !isbuffer && isobject && Object.keys(value).length &&
            (!opts.maxDepth || currentDepth < maxDepth)) {
            return step(value, newKey, currentDepth + 1);
          }

          output[newKey] = value;
        });
    }

    step(target);

    return output;
  }

  public static unflatten(target, opts?) {
    opts = opts || {};

    const delimiter = opts.delimiter || '.';
    const overwrite = opts.overwrite || false;
    const result = {};

    const isbuffer = FlatUtils.isBuffer(target);
    if (isbuffer || Object.prototype.toString.call(target) !== '[object Object]') {
      return target;
    }

    // safely ensure that the key is
    // an integer.
    function getkey(key) {
      const parsedKey = Number(key);

      return (
        isNaN(parsedKey) ||
        key.indexOf('.') !== -1 ||
        opts.object
      ) ? key
        : parsedKey;
    }

    const sortedKeys = Object.keys(target)
      .sort((keyA, keyB) => {
        return keyA.length - keyB.length;
      });

    sortedKeys
      .forEach((key) => {
        const split = key.split(delimiter);
        let key1 = getkey(split.shift());
        let key2 = getkey(split[0]);
        let recipient = result;

        while (key2 !== undefined) {
          const type = Object.prototype.toString.call(recipient[key1]);
          const isobject = type === '[object Object]';

          // do not write over falsey, non-undefined values if overwrite is false
          if (!overwrite && !isobject && typeof recipient[key1] !== 'undefined') {
            return;
          }

          if ((overwrite && !isobject) || (!overwrite && recipient[key1] == null)) {
            recipient[key1] = (
              typeof key2 === 'number' &&
              !opts.object ? [] : {}
            );
          }

          recipient = recipient[key1];
          if (split.length > 0) {
            key1 = getkey(split.shift());
            key2 = getkey(split[0]);
          }
        }
        // unflatten again for 'messy objects'
        recipient[key1] = FlatUtils.unflatten(target[key], opts);
      });

    return result;
  }

  private static isBuffer(obj) {
    return obj != null && obj.constructor != null &&
      typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj);
  }
}
