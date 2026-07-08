import { Request } from 'express';
import { IJwtPayload } from '../interfaces';

export type AuthenticatedRequest = Request & {
  user?: IJwtPayload;
};
