import { NextApiRequest, NextApiResponse } from "next";
import handlers, { HandlerMethod } from "../handlers/handlers";

export type NextFunction = () => void | undefined;
export type ControllerMiddleware<T extends NextApiRequest = NextApiRequest> = (
  req: T,
  res: NextApiResponse,
  next: NextFunction,
) => void;

export function Router(method: HandlerMethod, route: string) {
  return function (descriptor) {
    const originalMethod = descriptor.descriptor.value;

    handlers.addHandler({
      route: route.split("/"),
      method,
      func: originalMethod,
    });

    return descriptor;
  };
}

class BaseController {
  private middlewares: ControllerMiddleware[] = [];

  protected use(middleware: ControllerMiddleware) {
    this.middlewares.push(middleware);
  }

  protected handleRequest(
    req: NextApiRequest,
    res: NextApiResponse,
    ...all: ControllerMiddleware[]
  ) {
    const allMiddlewares = [...this.middlewares, ...all];

    let index = 0;

    const next = () => {
      if (index > allMiddlewares.length - 1) {
        return;
      }
      const current = allMiddlewares[index++];

      current(req, res, next);
    };

    return next();
  }
}

export default BaseController;
