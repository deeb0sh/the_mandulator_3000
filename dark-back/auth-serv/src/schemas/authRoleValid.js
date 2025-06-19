export const authRoleValid = {
    type: 'object',
    required: ['id', 'password'],
    properties: {
        id: {
            type: 'string',
            minLength: 10,
            maxLength: 30,
            pattern: '^[a-zA-Z0-9-]+$'
        },
        role: {
            type: 'string',
            minLength: 1,
            maxLength: 1,
            pattern: '^[0-9]+$',
        }
    } 
} 