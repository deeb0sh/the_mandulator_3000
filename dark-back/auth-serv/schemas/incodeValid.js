export const incodeValid = {
    type: 'object',
    required: ['incode', 'role'],
    properties: {
        incode: {
            type: 'string',
            pattern: '^[A-Z0-9-]+$',
            errorMessage: {
                type: 'только строка',
                pattern: 'Недопустимые сиволы'
            }
        },
        role: {
            type: 'string',
            pattern: '^[0-9]+$',
            errorMessage: {
                type: 'только строка',
                pattern: 'Недопустимые сиволы'
            }
        }
    },
    errorMessage: {
        required: {
            incode: 'пустое поле',
            role: 'пустое поле'
        },
    },
};