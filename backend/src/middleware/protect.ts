import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { errorHandler } from "./errorHandler";

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.access_token;

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
    (
      err: jwt.VerifyErrors | null,
      decoded: JwtPayload | string | undefined
    ) => {
      if (
        err ||
        !decoded ||
        !(typeof decoded === "object" && "id" in decoded)
      ) {
        return next(
          errorHandler(
            err ? 401 : 400,
            err
              ? "Unauthorized: Invalid or expired token"
              : "Invalid token: ID not found in payload",
            {
              code: err ? "INVALID_TOKEN" : "MISSING_ID",
              description: err
                ? "Token invalid or token expired"
                : "Token payload does not contain an ID",
              field: "token",
            }
          )
        );
      }

      req.user = (decoded as JwtPayload).id;
      next();
    }
  );
};
