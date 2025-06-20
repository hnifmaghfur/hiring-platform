// Swagger schema for Candidate Register endpoint (multipart/form-data)

export const JobPostRegisterApiResponse = {
  description: 'Job post created successfully',
  schema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'UUID of the job post',
        example: 'uuid',
      },
      title: {
        type: 'string',
        description: 'Title of the job post',
        example: 'Senior Software Engineer',
      },
      description: {
        type: 'string',
        description: 'Description of the job post',
        example: 'Description of the job post',
      },
      skill: {
        type: 'string',
        description: 'Skill of the job post',
        example: 'Backend, NodeJS, ExpressJS',
      },
      location: {
        type: 'string',
        description: 'Location of the job post',
        example: 'Jakarta',
      },
      salary: {
        type: 'number',
        description: 'Salary of the job post',
        example: 100000,
      },
      company_id: {
        type: 'string',
        description: 'Company ID of the job post',
        example: 'uuid',
      },
    },
  },
};
