import { NextResponse } from 'next/server';
import { getListingById } from '@/lib/file-db';

export const dynamic = 'force-dynamic';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const listing = await getListingById(params.id);

  if (!listing) {
    return NextResponse.json({ ok: false, error: 'Listing not found.' }, { status: 404 });
  }

  return NextResponse.json({ ok: true, data: listing });
}
