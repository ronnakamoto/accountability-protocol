import prisma from "~~/prisma/prisma";

function bigIntReplacer(_key: any, value: any) {
  if (typeof value === "bigint") {
    return value.toString(10);
  }
  return value;
}

export default async function create(req: any, res: any) {
  try {
    const createdProject = await prisma.project.create({
      data: req.body,
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    });
    res.status(201).json(JSON.parse(JSON.stringify(createdProject, bigIntReplacer)));
  } catch (error: any) {
    console.log("error: ", error);
    res.status(400).json({ error: error.message });
  }
}
