export const DYNAMIC_FORMS_DATA_TYPE_MAPPING = {
  number: (value) => {
    const i = parseInt(value, undefined);
    return isNaN(i) ? value : i;
  },
  boolean: (value) => value === 'true' || value === true,
  date: (value) => {
    return !!value && typeof value.format === 'function' ?
      value.format('YYYY-MM-DDTHH:mm:ss') :
      value;
  }
};
