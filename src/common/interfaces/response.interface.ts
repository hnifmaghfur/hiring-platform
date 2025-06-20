export interface StandardResponse<T> {
  statusCode: number;
  message: string;
  data?: T;
}

export interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface StandardPaginatedResponse<T> {
  statusCode: number;
  message: string;
  data: T[];
  meta: PaginationMeta;
}

export const createResponse = <T>(
  statusCode: number,
  message: string,
  data?: T,
): StandardResponse<T> => ({
  statusCode,
  message,
  ...(data && { data }),
});

// Helper functions for common responses
export const successResponse = <T>(
  data: T,
  message = 'Success',
): StandardResponse<T> => createResponse(200, message, data);

export const createdResponse = <T>(
  data: T,
  message = 'Resource created successfully',
): StandardResponse<T> => createResponse(201, message, data);

export const errorResponse = (
  message: string,
  statusCode = 400,
): StandardResponse<null> => createResponse(statusCode, message);

export const notFoundResponse = (
  message = 'Resource not found',
): StandardResponse<null> => createResponse(404, message);

export const serverErrorResponse = (
  message = 'Internal server error',
): StandardResponse<null> => createResponse(500, message);

export const paginatedResponse = <T>(
  data: T[],
  meta: PaginationMeta,
  message = 'Data retrieved successfully',
): StandardPaginatedResponse<T> => ({
  statusCode: 200,
  message,
  data,
  meta,
});

export const paginatedErrorResponse = <T = any>(
  message: string = 'Internal server error',
  statusCode: number = 500,
  data: T[] = [],
  meta: PaginationMeta = {
    totalItems: 0,
    itemCount: 0,
    itemsPerPage: 10,
    totalPages: 0,
    currentPage: 1,
  },
): StandardPaginatedResponse<T> => ({
  statusCode,
  message,
  data,
  meta,
});
