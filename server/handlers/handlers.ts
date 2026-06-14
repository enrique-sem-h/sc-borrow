import { NextApiRequest, NextApiResponse } from "next";

export type HandlerMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
type Handler = {
  route: string[];
  method: HandlerMethod;
  func: (req: NextApiRequest, res: NextApiResponse, params?: {
    [key: string]: string;
  }) => void;
}

type HandlerObj = {
  handlers: Handler[];
  addHandler: (handler: Handler) => void;
  getHandlerByRoute: (method: HandlerMethod, route: string[]) => Handler | undefined;
  runHandler: (originalRoute: string[], handler: Handler, req: NextApiRequest, res: NextApiResponse) => void;
}

const handlers: HandlerObj = {
  handlers: [],
  addHandler(handler: Handler) {
    this.handlers.push(handler)
  },
  getHandlerByRoute(method: HandlerMethod, route: string[]) {

    const withSameLengthAndMethod = this.handlers.filter(handler => handler.route.length === route.length && handler.method === method)

    const params: {[key: string]: string;} = {}

    let index = 0;
    const resultItem: string[] = []
    for (const routeItem of route) {

      const currentRouteItemWithParams = withSameLengthAndMethod.filter(_route => _route.route[index].includes('[')).map(_route => _route.route[index])
      const currentRouteItemWithoutParams = withSameLengthAndMethod.filter(_route => !_route.route[index].includes('[')).map(_route => _route.route[index])

      const all = [
        ...currentRouteItemWithoutParams,
        ...currentRouteItemWithParams
      ]
      

      for (const currentRouteItem of all) {

        const paramMatch = currentRouteItem.match(/\[(.*)\]/)
        const isParam = !!paramMatch
        
        if (isParam) {
          const paramName = paramMatch[1]

          const paramValue = currentRouteItem
          params[paramName] = paramValue

          resultItem.push(currentRouteItem)
          break
        } else {
          if (currentRouteItem === routeItem) {
            resultItem.push(currentRouteItem)
            break
          }
        }

      }
      index += 1
    }
    

    const handler = withSameLengthAndMethod.find(handler => {
      return handler.route.every((route, index) => {
        
        return route === resultItem[index]
      })
    })

    return handler
  },
  runHandler(originalRoute: string[], handler: Handler, req: NextApiRequest, res: NextApiResponse) {

    const handlerRoute = handler.route

    let index = 0
      const params: {
        [key: string]: string;
      } = {}

    for (const routeItem in handlerRoute) {
      const paramMatch = routeItem.match(/\[(.*)\]/)

      if (!paramMatch) {
        continue;
      }

      const paramName = paramMatch[1]
      const paramValue = originalRoute[index]

      params[paramName] = paramValue

      index += 1
    }

    handler.func(req, res, params)
  }

}
export default handlers

