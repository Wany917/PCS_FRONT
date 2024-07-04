export interface User {
  id: string;
  firstname?: string;
  lastname?: string;
  avatar?: string;
  email?: string;

  [key: string]: unknown;
}
