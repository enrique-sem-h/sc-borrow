import HandlerTestController from "@/server/controllers/handler-test-controller";
import handlers from "@/server/handlers/handlers";
import { NextApiRequest, NextApiResponse } from "next";

const controllers = [
  new HandlerTestController()
]

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("Handler");
  
  const method = req.method


  const query = req.query.route as string[]

  if (!query) {
    return
  }
  
  const handler = handlers.getHandlerByRoute(method, query)
  console.log("Handler", handler);
  
  

  if (handler) {
    handlers.runHandler(query, handler, req, res)
  } else {
    res.status(404)
    res.send("Route not found")
  }
  
}
