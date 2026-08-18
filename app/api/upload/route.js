import { get } from "@vercel/blob";

export async function GET(request, { params }) {
  try {
    const { path } = await params;

    if (!path || path.length === 0) {
      return new Response("Missing media path", { status: 400 });
    }

    const pathname = path.join("/");

    const result = await get(pathname, {
      access: "public",
      token: process.env.BLOB2_READ_WRITE_TOKEN,
    });

    if (!result || !result.stream) {
      return new Response("Media not found", { status: 404 });
    }

    return new Response(result.stream, {
      status: result.statusCode || 200,
      headers: {
        "Content-Type": result.contentType || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Media proxy error:", error);

    return new Response("Media unavailable", {
      status: 404,
    });
  }
}
