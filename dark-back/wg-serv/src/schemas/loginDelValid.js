export const loginDelValid = {
    type: 'object',
    required: ['login'],
    properties: {
        login: {
            type: 'string',
            minLength: 1,
            maxLength: 15,
            pattern: '^[a-zA-Z0-9]+$',
        }
    },
};