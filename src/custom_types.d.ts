/* eslint-disable @typescript-eslint/no-unused-vars */
import express from 'express';

declare module 'express' {
  interface Request {
    user?: {
      uuid: string;
    };
  }
}
