import create from "./create";

export default async function handler(req: any, res: any) {
  const { method } = req;

  switch (method) {
    case "GET":
      // Get data from your database
      break;
    case "POST":
      await create(req, res);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
