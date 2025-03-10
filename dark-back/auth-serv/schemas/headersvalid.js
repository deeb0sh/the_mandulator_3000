export const headersValid = {
    type: 'object',
    properties: {
        authorization: { 
            type: 'string',
            pattern: '^Bearer [a-zA-Z0-9._-]+$', 
        }, 
        'x-fingerprint': { 
            type: 'string',
            minLength: 20, 
            pattern: '^[a-z0-9]+$' 
        } 
    },
  required: ['authorization', 'x-fingerprint'] // Оба заголовка обязательны
}