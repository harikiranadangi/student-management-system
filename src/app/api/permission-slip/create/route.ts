import { slipSchema } from "@/lib/formValidationSchemas";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = slipSchema.parse(body);

    const student = await prisma.student.findUnique({
      where: { id: data.studentId },
      include: {
        Class: {
          include: { Grade: true },
        },
      },
    });

    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found." },
        { status: 404 }
      );
    }

    if (data.classId !== undefined && student.classId !== data.classId) {
      return NextResponse.json(
        { success: false, message: "Selected class doesn't match student's actual class." },
        { status: 400 }
      );
    }

    if (data.gradeId !== undefined && student.Class?.gradeId !== data.gradeId) {
      return NextResponse.json(
        { success: false, message: "Selected grade doesn't match student's actual grade." },
        { status: 400 }
      );
    }

    const leaveDate = data.date
      ? new Date(data.date)
      : new Date(new Date().toDateString());

    const newSlip = await prisma.permissionSlip.create({
      data: {
        studentId: data.studentId,
        leaveType: data.leaveType,
        subReason: data.subReason,
        description: data.description,
        date: leaveDate,
        withWhom: data.withWhom,
        relation: data.relation,
      },
    });

    const pdfDoc = await PDFDocument.create();

    // 9cm x 9cm in points
    const pageWidth = 255;
    const pageHeight = 255;

    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Title
    page.drawText("KOTAK SALESIAN SCHOOL", {
      x: 40,
      y: pageHeight - 30,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });
    page.drawText("GATE SLIP", {
      x: 95,
      y: pageHeight - 45,
      size: 10,
      font: regularFont,
    });

    // Content
    const lines = [
      `Name: ${student.name}`,
      `Class: ${student.Class?.Grade.level} – ${student.Class?.section ?? ""}`,
      `Date & Time: ${leaveDate.toLocaleDateString("en-GB")} ${new Date().toLocaleTimeString("en-GB")}`,
      `Permission Type: ${data.leaveType}`,
      `Reason: ${data.subReason || "-"}`,
      `Description: ${data.description || "-"}`,
      `With Whom: ${data.withWhom || "-"}`,
      `Relation: ${data.relation || "-"}`,
    ];

    let y = pageHeight - 70;
    for (const line of lines) {
      page.drawText(line, {
        x: 20,
        y,
        size: 9,
        font: regularFont,
      });
      y -= 14;
    }

    // Footer: Signature fields
    page.drawText("Principal Signature", {
      x: 20,
      y: 20,
      size: 9,
      font: regularFont,
    });

    page.drawText("Signature", {
      x: pageWidth - 80,
      y: 20,
      size: 9,
      font: regularFont,
    });

    // Save the PDF and convert to base64
    const pdfBytes = await pdfDoc.save();
    const pdfBase64 = Buffer.from(pdfBytes).toString("base64");


    return NextResponse.json({
      success: true,
      slip: newSlip,
      gateSlipPdf: `data:application/pdf;base64,${pdfBase64}`,
    }, { status: 201 });
  } catch (error) {
    console.error("Permission slip creation error:", error);
    return NextResponse.json(
      { success: false, message: "Invalid input or server error." },
      { status: 400 }
    );
  }
}
