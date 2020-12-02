export const DYNAMIC_FORMS_ERROR_MESSAGE_MAPPING = {
  required: 'Dit veld is verplicht',
  email: 'Dit e-mail adres is ongeldig',
  minlength: (error) => `Dit veld moet minstens ${error.requiredLength} tekens bevatten`,
  matDatepickerParse: 'Deze datum is ongeldig'
};
