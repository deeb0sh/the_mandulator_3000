export const paramReqValid = {
  type: 'object',
  required: ['server'],
  properties: {
    server: { 
      type: 'string',
      enum: ['RU', 'DE', 'FI']
    }
  }
};