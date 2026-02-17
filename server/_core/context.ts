import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret');

export interface Context {
  userId?: string;
  tenantId?: string;
  role?: string;
}

export async function createContext(opts?: FetchCreateContextFnOptions): Promise<Context> {
  const token = opts?.req?.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return {};
  }

  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return {
      userId: verified.payload.sub as string,
      tenantId: verified.payload.tenantId as string,
      role: verified.payload.role as string,
    };
  } catch (error) {
    return {};
  }
}
