export const regValid = {
    type: 'object',
    required: ['user', 'password', 'confirmPassword', 'inCode'],
    properties: {
        user: {
            type: 'string',
            minLength: 4,
            maxLength: 20,
            pattern: '^[a-zA-Z0-9_-]+$',
            errorMessage: {
                type: 'только строка',
                minLength: 'минимум 4 символов',
                maxLength: 'Привышена длина.',
                pattern: 'Недопустимые сиволы',
            },
        },
        password: {
            type: 'string',
            minLength: 4,
            maxLength: 20,
            pattern: '^[a-zA-Z0-9_-]+$',
            errorMessage: {
                type: 'только строка',
                minLength: 'минимум 4 символов',
                maxLength: 'Привышена длина.',
                pattern: 'Недопустимые сиволы',
            },
        },
        confirmPassword: {
            type: 'string',
            minLength: 4,
            maxLength: 20,
            pattern: '^[a-zA-Z0-9_-]+$',
            const: { $data: '1/password' },
            errorMessage: {
                type: 'только строка',
                minLength: 'минимум 4 символов',
                maxLength: 'Привышена длина.',
                pattern: 'Недопустимые сиволы',
            },
        },
        inCode: {
            type: 'string',
            minLength: 4,
            maxLength: 20,
            pattern: '^[a-zA-Z0-9_-]+$',
            errorMessage: {
                type: 'только строка',
                minLength: 'минимум 4 символов',
                maxLength: 'Привышена длина.',
                pattern: 'Недопустимые сиволы',
            },
        },
    },
    errorMessage: {
        required: {
            user: 'Логин обязателен',
            password: 'Пароль обязателен',
            confirmPassword: 'Подтверждение пароля обязательно',
            inCode: 'Инвайт-код обязателен',
        },
    },
};