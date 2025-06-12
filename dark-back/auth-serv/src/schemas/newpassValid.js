export const newpassValid = {
    type: 'object',
    required: ['password', 'confirmPassword'],
    properties: {
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
        }
    } 
}   
   