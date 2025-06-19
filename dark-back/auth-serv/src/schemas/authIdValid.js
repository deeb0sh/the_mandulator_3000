export const authIdValid = {
    type: 'object',
    required: ['id'],
    properties: {
        id: {
            type: 'string',
            minLength: 30,
            maxLength: 40,
            pattern: '^[a-zA-Z0-9-]+$'
        }
    } 
} 