// Swagger schema for Candidate Register endpoint (multipart/form-data)
export const CandidateRegisterApiBody = {
  description: 'Candidate Register data and resume file',
  schema: {
    type: 'object',
    properties: {
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
      password: {
        type: 'string',
        description: 'Password (will be hashed)',
        example: 'yourpassword',
      },
      skill: {
        type: 'string',
        description: 'Skill of the candidate',
        example: 'Node.js,TypeScript,Golang,Backend',
      },
      phone: {
        type: 'string',
        description: 'Phone number',
        example: '08123456789',
      },
      resume: {
        type: 'string',
        format: 'binary',
        description: 'Resume file',
      },
    },
    required: ['name', 'email', 'password', 'skill', 'phone', 'resume'],
  },
};

export const CandidateRegisterApiResponse = {
  description: 'Candidate registered successfully',
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
      skill: {
        type: 'string',
        description: 'Skill of the candidate',
        example: 'Node.js,TypeScript,Golang,Backend',
      },
      phone: {
        type: 'string',
        description: 'Phone number',
        example: '08123456789',
      },
    },
  },
};
