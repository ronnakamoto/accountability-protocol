import prisma from "~~/prisma/prisma";

function bigIntReplacer(_key: any, value: any) {
  if (typeof value === "bigint") {
    return value.toString(10);
  }
  return value;
}

export default async function create(req: any, res: any) {
  try {
    const createdMilestone = await prisma.milestone.create({
      data: req.body,
    });
    res.status(201).json(JSON.parse(JSON.stringify(createdMilestone, bigIntReplacer)));
  } catch (error: any) {
    console.log("error: ", error);
    res.status(400).json({ error: error.message });
  }
}
