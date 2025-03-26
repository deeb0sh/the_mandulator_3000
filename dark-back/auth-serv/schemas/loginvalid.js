export const loginValid = {
    type: 'object',
    required: ['user', 'password', 'fingerprint'],
    properties: {
        user: {
            type: 'string',
            pattern: '^[a-zA-Z0-9_]+$',
            errorMessage: {
                type: 'только строка',
                pattern: 'Недопустимые сиволы'
            },
        },
        password: {
            type: 'string',
            pattern: '^[a-zA-Z0-9_]+$',
            errorMessage: {
                type: 'только строка',
                pattern: 'Недопустимые сиволы'
            },
        },
        fingerprint: {
            type: 'string',
            pattern: '^[a-zA-Z0-9_]+$',
            errorMessage: {
                type: 'только строка',
                pattern: 'Недопустимые сиволы'
            }   
        }
    },
    errorMessage: {
        required: {
            user: 'Логин обязателен',
            password: 'Пароль обязателен',
            fingerprint: 'браузер инвалид'
        },
    },
};