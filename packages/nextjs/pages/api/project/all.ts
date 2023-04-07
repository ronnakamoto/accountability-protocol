import prisma from "~~/prisma/prisma";

function bigIntReplacer(_key: any, value: any) {
  if (typeof value === "bigint") {
    return value.toString() + "n";
  }
  return value;
}

export default async function all(req: any, res: any) {
  try {
    const allProjects = await prisma.project.findMany({
      where: {
        createdBy: req.body.createdBy,
      },
    });
    res.status(201).json(JSON.parse(JSON.stringify(allProjects, bigIntReplacer)));
  } catch (error: any) {
    console.log("error: ", error);
    res.status(400).json({ error: error.message });
  }
}
