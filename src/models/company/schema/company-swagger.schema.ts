// Swagger schema for Candidate Register endpoint (multipart/form-data)

export const CompanyRegisterApiResponse = {
  description: 'Company registered successfully',
  schema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'UUID of the candidate',
        example: 'uuid',
      },
      name: {
        type: 'string',
        description: 'Full name of the candidate',
        example: 'John Doe',
      },
      email: {
        type: 'string',
        description: 'Email address of the candidate',
        example: 'john@example.com',
      },
      phone: {
        type: 'string',
        description: 'Phone number',
        example: '08123456789',
      },
    },
  },
};
