import { put } from "@vercel/blob";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const blob = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true,
      storeId: process.env.BLOB2_STORE_ID,
    });

    return Response.json({
      success: true,
      url: blob.url,
      pathname: blob.pathname,
    });
  } catch (error) {
    console.error("Upload error:", error);

    return Response.json(
      {
        error: "Upload failed",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
