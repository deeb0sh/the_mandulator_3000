export const statLoginValid = {
  type: 'object',
  required: ['login'],
  properties: {
    login: { 
      type: 'string',
      pattern: '^[a-zA-Z0-9]+$',
    }
  }
};