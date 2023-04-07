import prisma from "~~/prisma/prisma";

function bigIntReplacer(_key: any, value: any) {
  if (typeof value === "bigint") {
    return value.toString() + "n";
  }
  return value;
}

export default async function update(req: any, res: any) {
  try {
    const { id, ...dataToUpdate } = req.body;
    const updatedProject = await prisma.project.update({
      where: {
        id,
      },
      data: dataToUpdate,
    });
    res.status(201).json(JSON.stringify(updatedProject, bigIntReplacer));
  } catch (error: any) {
    console.log("error: ", error);
    res.status(400).json({ error: error.message });
  }
}
