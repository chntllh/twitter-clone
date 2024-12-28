import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { errorHandler } from "./errorHandler";

interface CustomRequest extends Request {
  user?: string | JwtPayload;
}

export const protect = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token =
    req.cookies.access_token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(
      errorHandler(401, "Unauthorized: No token provided", {
        code: "NO_TOKEN",
        description: "No token in request",
        field: "token",
      })
    );
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET!,
    (err: jwt.VerifyErrors | null, user: JwtPayload | string | undefined) => {
      if (err) {
        return next(
          errorHandler(401, "Unauthorized: Invalid or expired token", {
            code: "INVALID_TOKEN",
            description: "Token invalid or token expired",
            field: "token",
          })
        );
      }
      req.user = user;
      next();
    }
  );
};
