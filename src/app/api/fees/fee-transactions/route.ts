import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    // Extract query parameters from the URL
    const url = new URL(request.url);
    const receiptDate = url.searchParams.get('receiptDate'); // Get receiptDate from query params

    // Use current date as fallback if receiptDate is not provided
    const currentDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
    const dateToUse = receiptDate || currentDate; // Use provided date or fallback to current date

    // Prepare filter conditions
    const whereConditions: any = {
      receiptDate: {
        equals: new Date(dateToUse), // Make sure the date is parsed correctly
      },
    };

    // Fetch transactions from the database with optional date filtering
    const receipts = await prisma.feeTransaction.findMany({
      where: whereConditions, // Apply the filter condition
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

    // Return the filtered receipts as JSON
    return Response.json(receipts);
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Error fetching fee transactions" }, { status: 500 });
  }
}
