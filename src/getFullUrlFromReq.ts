import { Request } from 'express';

export const getFullUrlFromReq = (req: Request) => {
  return new URL(`${req.protocol}://${req.get('Host')}${req.url}`);
};
