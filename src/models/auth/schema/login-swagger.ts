// Swagger schema for Candidate Register endpoint (multipart/form-data)
export const LoginApiBody = {
  description: 'Login data',
  schema: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        description: 'Email address',
        example: 'john@example.com',
      },
      password: {
        type: 'string',
        description: 'Password (will be hashed)',
        example: 'yourpassword',
      },
    },
    required: ['email', 'password'],
  },
};

export const LoginApiResponse = {
  description: 'Login successfully',
  schema: {
    type: 'object',
    properties: {
      token: {
        type: 'string',
        description: 'Token',
        example: 'uuid',
      },
    },
  },
};
