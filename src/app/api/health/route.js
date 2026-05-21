export async function GET() {
  return Response.json(
    { status: "healthy", timestamp: new Date().toISOString() },
    {
      status: 200,
      headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
    },
  );
}
