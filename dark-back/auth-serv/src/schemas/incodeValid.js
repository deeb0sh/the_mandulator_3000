export const incodeValid = {
    type: 'object',
    required: ['incode'],
    properties: {
        incode: {
            type: 'string',
            pattern: '^[A-Z0-9-]+$',
            errorMessage: {
                type: 'только строка',
                pattern: 'Недопустимые сиволы'
            }
        },
    },
    errorMessage: {
        required: {
            incode: 'пустое поле',
        },
    },
};