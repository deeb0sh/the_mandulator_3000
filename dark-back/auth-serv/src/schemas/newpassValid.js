export const newpassValid = {
    type: 'object',
    required: ['password', 'confirmPassword'],
    properties: {
        password: {
            type: 'string',
            minLength: 4,
            maxLength: 20,
            pattern: '^[a-zA-Z0-9_-]+$'
        },
        confirmPassword: {
            type: 'string',
            minLength: 4,
            maxLength: 20,
            pattern: '^[a-zA-Z0-9_-]+$',
            const: { $data: '1/password' }
        }
    } 
}   
   