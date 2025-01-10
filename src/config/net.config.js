export const netConfig = {
  baseURL: import.meta.env.VITE_BACKEND_URL,
  cors: true,
  contentType: 'application/json;charset=UTF-8',
  messageDuration: 3000,
  requestTimeout: 9000000,
  successCode: [200, 0],
  invalidCode: 401,
  noPermissionCode: 403,
};
