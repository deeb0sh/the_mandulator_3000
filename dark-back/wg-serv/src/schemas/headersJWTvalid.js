export const headersJwtValid = {
    type: 'object',
    properties: {
        authorization: { 
            type: 'string',
            pattern: '^Bearer [a-zA-Z0-9._-]+$', 
        }, 
    },
  required: ['authorization'] // Оба один заголовка обязательны
}