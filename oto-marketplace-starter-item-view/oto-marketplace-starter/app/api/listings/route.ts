import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { getCurrentUser } from '@/lib/auth';
import { addListing, getListings } from '@/lib/file-db';
import { makeId } from '@/lib/format';
import { isFreeStuffCategory } from '@/lib/marketplace';
import { Listing, PriceUnit } from '@/lib/types';
import { corsPreflight, withCors } from '@/lib/cors';

export const dynamic = 'force-dynamic';

export async function GET() {
  const listings = await getListings();
  return withCors(NextResponse.json({ ok: true, data: listings }));
}

export function OPTIONS() {
  return corsPreflight();
}

function formatPrice(amount: number, type: Listing['type'], unit: PriceUnit) {
  const currency = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);

  if (type === 'sale' || !unit) {
    return currency;
  }

  return `${currency}/${unit}`;
}

function getListingPrice(amount: number, type: Listing['type'], unit: PriceUnit, category: string) {
  if (type === 'sale' && isFreeStuffCategory(category) && amount === 0) {
    return 'Free';
  }

  return formatPrice(amount, type, unit);
}

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return withCors(NextResponse.json({ ok: false, error: 'Sign in to create a listing.' }, { status: 401 }));
  }

  const formData = await request.formData();
  const title = String(formData.get('title') || '').trim();
  const rawPriceAmount = String(formData.get('priceAmount') || '').trim();
  const type = String(formData.get('type') || '').trim() as Listing['type'];
  const rawPriceUnit = String(formData.get('priceUnit') || '').trim();
  const location = String(formData.get('location') || '').trim();
  const category = String(formData.get('category') || '').trim();
  const description = String(formData.get('description') || '').trim();
  const rawQuantity = String(formData.get('quantityAvailable') || '1').trim();
  const rawAcceptsOffers = String(formData.get('acceptsOffers') || 'false').trim();
  const rawMinimumOfferAmount = String(formData.get('minimumOfferAmount') || '').trim();
  const file = formData.get('image');
  const priceAmount = Number(rawPriceAmount);
  const quantityAvailable = Number(rawQuantity);
  const priceUnit: PriceUnit = rawPriceUnit ? (rawPriceUnit as PriceUnit) : null;
  const acceptsOffers = type === 'sale' && rawAcceptsOffers === 'true';
  const minimumOfferAmount =
    acceptsOffers && rawMinimumOfferAmount ? Number(rawMinimumOfferAmount) : null;
  const isFreeStuff = isFreeStuffCategory(category);

  if (!title || !type || !location || !category || !description || !rawPriceAmount) {
    return withCors(NextResponse.json({ ok: false, error: 'All listing fields are required.' }, { status: 400 }));
  }

  if (!Number.isFinite(priceAmount) || priceAmount < 0) {
    return withCors(NextResponse.json({ ok: false, error: 'Enter a valid price amount.' }, { status: 400 }));
  }

  if (type === 'sale' && isFreeStuff) {
    if (priceAmount !== 0) {
      return withCors(NextResponse.json({ ok: false, error: 'Free Stuff listings must use a price of 0.' }, { status: 400 }));
    }
  } else if (type === 'sale' && priceAmount < 0.5) {
    return withCors(NextResponse.json({ ok: false, error: 'Sale listings must be at least £0.50 unless they are in Free Stuff.' }, { status: 400 }));
  } else if (type !== 'sale' && priceAmount <= 0) {
    return withCors(NextResponse.json({ ok: false, error: 'Rental listings must be priced above 0.' }, { status: 400 }));
  }

  if (!Number.isInteger(quantityAvailable) || quantityAvailable < 1) {
    return withCors(NextResponse.json({ ok: false, error: 'Quantity must be at least 1.' }, { status: 400 }));
  }

  if (type !== 'sale' && !priceUnit) {
    return withCors(NextResponse.json({ ok: false, error: 'Choose a pricing unit for rental listings.' }, { status: 400 }));
  }

  if (acceptsOffers && (!Number.isFinite(minimumOfferAmount) || (minimumOfferAmount ?? 0) <= 0)) {
    return withCors(NextResponse.json({ ok: false, error: 'Enter a valid minimum offer.' }, { status: 400 }));
  }

  if (!(file instanceof File) || file.size === 0) {
    return withCors(NextResponse.json({ ok: false, error: 'Please upload at least one image.' }, { status: 400 }));
  }

  if (!file.type.startsWith('image/')) {
    return withCors(NextResponse.json({ ok: false, error: 'Uploaded file must be an image.' }, { status: 400 }));
  }

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(uploadsDir, { recursive: true });

  const extension = path.extname(file.name) || '.jpg';
  const fileName = `${makeId()}${extension}`;
  const outputPath = path.join(uploadsDir, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(outputPath, buffer);

  const listing: Listing = {
    id: makeId(),
    title,
    price: getListingPrice(priceAmount, type, priceUnit, category),
    priceAmount,
    priceUnit,
    rating: 5,
    ratingCount: 1,
    condition: type === 'sale' ? 'Used - good' : 'Available to rent',
    fulfillment: ['Collection', 'Delivery'],
    acceptsOffers,
    minimumOfferAmount,
    quantityAvailable,
    soldCount: 0,
    galleryImages: [`/uploads/${fileName}`],
    type,
    location,
    category,
    sellerId: currentUser.id,
    sellerName: currentUser.name,
    distanceMiles: 5,
    image: `/uploads/${fileName}`,
    description,
    createdAt: new Date().toISOString(),
  };

  await addListing(listing);
  return withCors(NextResponse.json({ ok: true, data: listing }, { status: 201 }));
}
