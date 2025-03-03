export const regValid = {
    type: 'object',
    required: ['user', 'password', 'confirmPassword', 'inCode'],
    properties: {
        user: {
            type: 'string',
            minLength: 4,
            maxLength: 20,
            pattern: '^[a-zA-Z0-9_]+$',
        },
        password: {
            type: 'string',
            minLength: 4,
            maxLength: 20,
            pattern: '^[a-zA-Z0-9_]+$',
        },
        confirmPassword: {
            type: 'string',
            minLength: 4,
            maxLength: 20,
            pattern: '^[a-zA-Z0-9_]+$',
            const: { $data: '1/password' },
        },
        inCode: {
            type: 'string',
            minLength: 4,
            maxLength: 20,
            pattern: '^[a-zA-Z0-9_]+$',
        },
    },
};