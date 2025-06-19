export const authPassValid = {
    type: 'object',
    required: ['id', 'password'],
    properties: {
        id: {
            type: 'string',
            minLength: 30,
            maxLength: 40,
            pattern: '^[a-zA-Z0-9-]+$'
        },
        password: {
            type: 'string',
            minLength: 9,
            maxLength: 11,
            pattern: '^[a-zA-Z0-9_-]+$',
        }
    } 
} 