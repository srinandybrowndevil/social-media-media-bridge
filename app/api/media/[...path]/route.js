export async function GET(request, { params }) {
  try {
    const { path } = await params;

    if (!path || path.length === 0) {
      return new Response("Missing media path", { status: 400 });
    }

    const blobUrl = `https://ddtbpf3zxngd1yj3.public.blob.vercel-storage.com/${path
      .map(encodeURIComponent)
      .join("/")}`;

    const response = await fetch(blobUrl, {
      cache: "no-store",
    });

    if (!response.ok) {
      return new Response("Media not found", {
        status: response.status,
      });
    }

    const contentType =
      response.headers.get("content-type") || "application/octet-stream";

    return new Response(response.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Disposition": "inline",
      },
    });
  } catch (error) {
    console.error("Media proxy error:", error);

    return new Response("Media proxy failed", {
      status: 500,
    });
  }
}
