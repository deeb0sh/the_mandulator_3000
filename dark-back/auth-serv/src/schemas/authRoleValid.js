export const authRoleValid = {
    type: 'object',
    required: ['id', 'newrole'],
    properties: {
        id: {
            type: 'string',
            minLength: 30,
            maxLength: 40,
            pattern: '^[a-zA-Z0-9-]+$'
        },
        newrole: {
            type: 'string',
            minLength: 1,
            maxLength: 1,
            pattern: '^[0-9]+$',
        }
    } 
} 