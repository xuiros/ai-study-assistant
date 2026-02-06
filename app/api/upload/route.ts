import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const file = form.get("file") as File | null
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // NOTE: This is a simple mock. Real PDF/Text extraction should
    // be implemented using a library (pdf-parse, textract, etc.) on the server.
    const text = await file.text()

    const id = Date.now().toString()
    const name = (file as any).name || `document-${id}`

    // Simulate some cleaning/processing
    const extractedText = text.slice(0, 400) || "(extracted text placeholder)"

    // Save to DB here (mocked)

    return NextResponse.json({ id, name, extractedText })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
