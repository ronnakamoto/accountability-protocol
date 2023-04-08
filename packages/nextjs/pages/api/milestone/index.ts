import all from "./all";
import create from "./create";
import update from "./update";

export default async function handler(req: any, res: any) {
  const { method } = req;

  switch (method) {
    case "GET":
      await all(req, res);
      break;
    case "POST":
      await create(req, res);
      break;
    case "PATCH":
      await update(req, res);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "PATCH"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
