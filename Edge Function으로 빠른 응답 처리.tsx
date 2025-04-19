// app/api/hello/route.ts
export const runtime = 'edge';

export async function GET() {
  return new Response(JSON.stringify({ message: 'Edge에서 응답!' }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
