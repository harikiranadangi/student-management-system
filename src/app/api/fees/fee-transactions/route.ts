import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const receipts = await prisma.feeTransaction.findMany({
      include: {
        student: {
          select: {
            id: true,
            name: true,
            Class: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    return Response.json(receipts);
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Error fetching fee transactions" }, { status: 500 });
  }
}
