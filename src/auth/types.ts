import { Request } from 'express';

export type UserPayload = {
  sub: string;
  email: string;
  username: string;
};

export interface AuthReq extends Request {
  user: UserPayload;
}
