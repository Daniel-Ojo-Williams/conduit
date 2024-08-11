import { Request } from 'express';

export type UserPayload = {
  sub: string;
  email: string;
};

export interface AuthReq extends Request {
  user: UserPayload;
}
