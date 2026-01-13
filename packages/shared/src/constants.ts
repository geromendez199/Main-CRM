export const API_BASE_PATH = '/api/v1';
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
export const REQUEST_ID_HEADER = 'x-request-id';
export const PASSWORD_POLICY_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/;
export const PASSWORD_POLICY_MESSAGE =
  'Password must be at least 12 characters and include uppercase, lowercase, number, and special character.';
