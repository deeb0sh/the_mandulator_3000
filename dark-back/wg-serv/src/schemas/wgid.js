export const wgid = {
    type: 'object',
    required: ['id'],
    properties: {
        id: {
            type: 'string',
            minLength: 1,
            maxLength: 15,
            pattern: '^[0-9]+$',
        },
    },
};