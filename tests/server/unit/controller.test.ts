import handlers, { HandlerMethod }  from '../../../server/handlers/handlers'
import BaseController from '../../../server/controllers/base-controller'
import { NextApiRequest, NextApiResponse } from 'next'
import { expect, test, vi , describe} from 'vitest'

const asdd = []

function Router(method: HandlerMethod, route: string) {
  return function(ctr: Function) {
    handlers.addHandler({
      route: route.split('/'),
      method
    })
  }
}

function loggedMethod(constructor: Function) {
  
}


@loggedMethod
class TestController extends BaseController {
  public exposeUse(func) {
    this.use(func)
  }

  public run(req: any, res: any, ...rest: any[]) {
    this.handleRequest(req, res, ...rest)
  }


  @Router("GET", "router")
  public routerTest() {

  }
}

describe("BaseController", () => {

test('if middlwares are being called correctly', () => {
  const fn1 = vi.fn((req: NextApiRequest, res: NextApiResponse, next) => {
    next()
  })

  const fn2 = vi.fn((req: NextApiRequest, res: NextApiResponse, next) => {
    next()
  })

  const fn3 = vi.fn((req: NextApiRequest, res: NextApiResponse, next) => {
    next()
  })

  const testController = new TestController()

  const req = () => {}
  const res = () => {}

  testController.exposeUse(fn1)
  testController.exposeUse(fn2)

  testController.run(req, res, fn3)

  expect(fn1).toHaveBeenCalledTimes(1)
  expect(fn2).toHaveBeenCalledTimes(1)
})

test('if middlwares are being called in correct order', () => {

  const order: number[] = []

  const fn1 = vi.fn((req: NextApiRequest, res: NextApiResponse, next) => {
    order.push(1)
    next()
  })

  const fn2 = vi.fn((req: NextApiRequest, res: NextApiResponse, next) => {
    order.push(2)
    next()
  })

  const fn3 = vi.fn((req: NextApiRequest, res: NextApiResponse, next) => {
    order.push(3)
    next()
  })

  const testController = new TestController()

  const req = () => {}
  const res = () => {}

  testController.exposeUse(fn1)
  testController.exposeUse(fn2)

  testController.run(req, res, fn3)

  expect(order).toEqual([1, 2, 3])

})
})

test('if middlwares dont propagate if one fails', () => {

  const order: number[] = []

  const fn1 = vi.fn((req: NextApiRequest, res: NextApiResponse, next) => {
    order.push(1)
    next()
  })

  const fn2 = vi.fn((req: NextApiRequest, res: NextApiResponse, next) => {
    // Simulate check error
    if (false) {
      next()
    }
  })

  const fn3 = vi.fn((req: NextApiRequest, res: NextApiResponse, next) => {
    //This function can't be called because of check error
  })

  const testController = new TestController()

  const req = () => {}
  const res = () => {}

  testController.exposeUse(fn1)
  testController.exposeUse(fn2)
  testController.exposeUse(fn3)

  testController.run(req, res)


  expect(fn1).toHaveBeenCalledTimes(1)
  expect(fn2).toHaveBeenCalledTimes(1)
  expect(fn3).toHaveBeenCalledTimes(0)
})
