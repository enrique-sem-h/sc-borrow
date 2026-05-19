import { NextApiRequest, NextApiResponse } from "next";
import BaseController, { Router } from "./base-controller";


class HandlerTestController extends BaseController {



    @Router("GET", "asd/test1")
    static testRouterMethod(asd: NextApiRequest) {
      

    }

    @Router("GET", "asd/test2")
    static testRouterMethod2(req: NextApiRequest, res: NextApiResponse) {
      res.send("WEOFHJEW MEU PAU")

    }


}

export default HandlerTestController
