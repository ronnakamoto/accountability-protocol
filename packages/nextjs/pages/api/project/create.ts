import prisma from "~~/prisma/prism";

function bigIntReplacer(_key: any, value: any) {
  if (typeof value === "bigint") {
    return value.toString() + "n";
  }
  return value;
}

export default async function create(req: any, res: any) {
  try {
    console.log("req.body: ", req.body);
    const createdProject = await prisma.project.create({
      data: req.body,
    });
    res.status(201).json(JSON.stringify(createdProject, bigIntReplacer));
  } catch (error: any) {
    console.log("error: ", error);
    res.status(400).json({ error: error.message });
  }
}
