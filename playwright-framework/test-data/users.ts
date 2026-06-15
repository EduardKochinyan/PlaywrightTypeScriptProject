export interface User {
  username: string;
  password: string;
  role?: string;
}

export const users = {
  standard: {
    username: process.env.STANDARD_USER || 'standard_user',
    password: process.env.USER_PASSWORD || 'secret_sauce',
    role: 'standard',
  },
  locked: {
    username: 'locked_out_user',
    password: 'secret_sauce',
    role: 'locked',
  },
  problem: {
    username: 'problem_user',
    password: 'secret_sauce',
    role: 'problem',
  },
  performance: {
    username: 'performance_glitch_user',
    password: 'secret_sauce',
    role: 'performance',
  },
  error: {
    username: 'error_user',
    password: 'secret_sauce',
    role: 'error',
  },
  visual: {
    username: 'visual_user',
    password: 'secret_sauce',
    role: 'visual',
  },
  invalid: {
    username: 'invalid_user',
    password: 'wrong_password',
    role: 'invalid',
  },
  apiAdmin: {
    username: process.env.API_ADMIN_USER || 'admin',
    password: process.env.API_ADMIN_PASS || 'password123',
    role: 'api-admin',
  },
} satisfies Record<string, User>;
