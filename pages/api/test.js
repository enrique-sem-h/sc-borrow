import { db } from "../../infra/database";

async function test(req, res) {
  let response = await db.execute("SELECT 1 + 1 AS solution");
  let result = response[0][0].solution;
  console.log(result);

  res.status(200).json({ result });
}

export default test;
