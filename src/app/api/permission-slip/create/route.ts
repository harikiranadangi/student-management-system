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

    // ✅ Generate gate slip PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([400, 320]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const drawText = (text: string, y: number) => {
      page.drawText(text, {
        x: 30,
        y,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });
    };

    drawText(`Gate Slip`, 280);
    drawText(`Date: ${leaveDate.toLocaleDateString("en-GB")}`, 260);
    drawText(`Time: ${new Date().toLocaleTimeString("en-GB")}`, 240);
    drawText(`Student: ${student.name}`, 220);
    drawText(`Class: ${student.Class?.Grade.level} - ${student.Class?.section ?? ""}`, 200);
    drawText(`Leave Type: ${data.leaveType}`, 180);
    drawText(`Sub Reason: ${data.subReason || "-"}`, 160);
    drawText(`Description: ${data.description || "-"}`, 140);
    drawText(`With Whom: ${data.withWhom || "-"}`, 120);
    drawText(`Relation: ${data.relation || "-"}`, 100);

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
