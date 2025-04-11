export const wgNameValid = {
    type: 'object',
    required: ['wguser', 'location'],
    properties: {
        wguser: {
            type: 'string',
            minLength: 2,
            maxLength: 15,
            pattern: '^[a-zA-Z0-9]+$',
        },
        location: {
            type: 'string',
            enum: ['RU', 'DE', 'FI'], // Только эти значения разрешены
          },
    },
};