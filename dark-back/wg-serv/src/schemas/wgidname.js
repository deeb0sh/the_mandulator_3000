export const wgIdName = {
    type: 'object',
    required: ['id', 'wgname'],
    properties: {
        id: {
            type: 'string',
            minLength: 1,
            maxLength: 15,
            pattern: '^[0-9]+$',
        },
        wgname: {
            type: 'string',
            minLength: 1,
            maxLength: 15,
            pattern: '^[a-zA-Z0-9]+$' 
        }

    },
};