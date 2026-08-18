import { put } from "@vercel/blob";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file.arrayBuffer !== "function") {
      return Response.json(
        { success: false, error: "No valid file provided" },
        { status: 400 }
      );
    }

    const blob = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true,
      token: process.env.BLOB2_READ_WRITE_TOKEN,
    });

    return Response.json({
      success: true,
      url: blob.url,
      pathname: blob.pathname,
      contentType: file.type || "application/octet-stream",
    });
  } catch (error) {
    console.error("Upload error:", error);

    return Response.json(
      {
        success: false,
        error: "Upload failed",
        message: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
