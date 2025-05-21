import { google } from "googleapis";
import { NextResponse } from "next/server";
import { Readable } from "stream";
import path from "path";

// Credenciales de servicio
const auth = new google.auth.GoogleAuth({
  keyFile: path.resolve(process.cwd(), "src/google/credentials.json"),
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});

const CARPETA_DRIVE_ID = "1tuX2Y08_TVtGtxEZHL5A3EC_XlEfNAir";

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file) {
    return NextResponse.json({ error: "No se recibió archivo" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const driveService = google.drive({ version: "v3", auth: await auth.getClient() });

  const fileMetadata = {
    name: file.name,
    parents: [CARPETA_DRIVE_ID], // ✅ Aquí se indica en qué carpeta guardarlo
  };

  const media = {
    mimeType: file.type,
    body: Readable.from(buffer),
  };

  try {
    const response = await driveService.files.create({
      requestBody: fileMetadata,
      media,
      fields: "id",
    });

    return NextResponse.json({ success: true, fileId: response.data.id });
  } catch (error) {
    console.error("Error subiendo a Drive:", error);
    return NextResponse.json({ error: "Error al subir a Google Drive" }, { status: 500 });
  }
}
