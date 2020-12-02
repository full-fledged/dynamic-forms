import {FlatUtils} from './flat.utils';

export class NgCommonsUtils {

  /**
   * order array by property e.g.
   * sort([{value: 'a'}, {value: 'c'}, {value: 'b'}]).by('value') > [{value: 'a'}, {value: 'b'}, {value: 'c'}]
   */
  public static sort<T>(items: T[]): { by: (property: string) => T[] } {
    const output = (property: string) => {
      const parseValue = (it) => {
        const parts = property.split('.');
        let value = {...it};
        parts.forEach((part) => value = value && value[part]);
        return isNaN(+value) ? value : +value;
      };
      return items && [...items]
        .sort((a, b) => {
          if (parseValue(a) > parseValue(b)) {
            return 1;
          }
          if (parseValue(a) < parseValue(b)) {
            return -1;
          }
          return 0;
        });
    };
    return {
      by: output
    };
  }

  /**
   * Flatten object
   * {a: {b: 123}} > {a.b: 123}
   */
  public static flatten(input) {
    return {...FlatUtils.flatten(input, {skipArrays: true})};
  }

  /**
   * expand flattened object e.g.
   * {a.b: 123} > {a: {b: 123}}
   */
  public static expand(input) {
    return {...FlatUtils.unflatten(input)};
  }

  /**
   * Filter function to get an array of unique items e.g.
   * [{value: '1'}, {value: '2'}, {value: '1'}].filter(distinctBy('value')) -> [{value: '1'}, {value: '2'}]
   */
  public static distinctBy(property) {
    const output = (value, index, self) => self.findIndex(item => item[property] === value[property]) === index;
    return output;
  }
}

