export const successResponse = (description: string, schema?: any) => {
  return {
    status: 200,
    description,
    schema,
  };
};

export const createdResponse = (description: string, schema?: any) => {
  return {
    status: 201,
    description,
    schema,
  };
};

export const BadRequestResponse = (description: string) => {
  return {
    status: 400,
    description,
  };
};

export const InternalServerErrorResponse = (description: string) => {
  return {
    status: 500,
    description,
  };
};

export const NotFoundResponse = (description: string) => {
  return {
    status: 404,
    description,
  };
};

export const UnauthorizedResponse = (description: string) => {
  return {
    status: 401,
    description,
  };
};

export const ForbiddenResponse = (description: string) => {
  return {
    status: 403,
    description,
  };
};
