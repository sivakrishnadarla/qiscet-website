import { readMedia } from '@/lib/cms/store';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const media = await readMedia(params.id).catch(() => null);
  if (!media) return new Response('Not found', { status: 404 });
  return new Response(new Uint8Array(media.buffer), {
    headers: {
      'Content-Type': media.mime,
      'Cache-Control': 'public, max-age=86400',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
