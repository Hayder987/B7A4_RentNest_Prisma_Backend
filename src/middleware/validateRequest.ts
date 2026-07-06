import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const validateRequest =
  (schema: z.ZodType) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };