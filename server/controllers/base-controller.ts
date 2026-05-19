import { NextApiRequest, NextApiResponse } from "next"

type ControllerMiddleware = (req: NextApiRequest, res: NextApiResponse, next?: () => void) => void

class BaseController {
  private middlewares: ControllerMiddleware[] = []

  protected use(middleware: ControllerMiddleware) {
    this.middlewares.push(middleware)
  }

  protected handleRequest(req: NextApiRequest, res: NextApiResponse, ...all: (ControllerMiddleware)[]) {
    const allMiddlewares = [
      ...this.middlewares,
      ...all,
    ]
    

    let index = 0
    

    const next = () => {

      if (index > allMiddlewares.length  - 1) {
        return null
      }
      const current = allMiddlewares[index++]
      

      current(req, res, next)
    }

    return next()
  }
}

export default BaseController
