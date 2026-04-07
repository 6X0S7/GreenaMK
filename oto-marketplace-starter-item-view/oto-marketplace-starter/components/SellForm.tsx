'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { marketplaceCategories } from '@/lib/constants';
import { isFreeStuffCategory } from '@/lib/marketplace';
import type { ListingType, PriceUnit } from '@/lib/types';

const rentalUnits: Array<{ value: Exclude<PriceUnit, null>; label: string }> = [
  { value: 'hour', label: 'Per hour' },
  { value: 'day', label: 'Per day' },
  { value: 'month', label: 'Per month' },
];

const initialForm = {
  title: '',
  priceAmount: '',
  type: 'sale' as ListingType,
  priceUnit: '' as '' | Exclude<PriceUnit, null>,
  category: 'Free Stuff',
  location: '',
  quantityAvailable: '1',
  acceptsOffers: true,
  minimumOfferAmount: '',
  description: '',
};

export default function SellForm() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl('');
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(imageFile);
    setPreviewUrl(nextPreviewUrl);

    return () => URL.revokeObjectURL(nextPreviewUrl);
  }, [imageFile]);

  const needsUnit = form.type !== 'sale';
  const showOfferSettings = form.type === 'sale';
  const isFreeStuff = form.type === 'sale' && isFreeStuffCategory(form.category);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0] || null;
    setImageFile(nextFile);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const numericPrice = Number(form.priceAmount);
      if (form.type === 'sale' && isFreeStuff && numericPrice !== 0) {
        throw new Error('Free Stuff listings must use a price of 0.');
      }

      if (form.type === 'sale' && !isFreeStuff && (!Number.isFinite(numericPrice) || numericPrice < 0.5)) {
        throw new Error('Sale listings must be at least £0.50 unless they are in Free Stuff.');
      }

      const payload = new FormData();
      payload.append('title', form.title);
      payload.append('priceAmount', form.priceAmount);
      payload.append('type', form.type);
      payload.append('category', form.category);
      payload.append('location', form.location);
      payload.append('quantityAvailable', form.quantityAvailable);
      payload.append('acceptsOffers', String(form.acceptsOffers));
      payload.append('description', form.description);

      if (needsUnit) {
        payload.append('priceUnit', form.priceUnit);
      }

      if (showOfferSettings && form.acceptsOffers) {
        payload.append('minimumOfferAmount', form.minimumOfferAmount);
      }

      if (imageFile) {
        payload.append('image', imageFile);
      }

      const response = await fetch('/api/listings', {
        method: 'POST',
        body: payload,
      });

      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Failed to create listing.');
      }

      setForm(initialForm);
      setImageFile(null);
      router.push('/browse');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Create listing</h2>
        <p className="mt-1 text-slate-600">Upload a real image and configure stock and offer rules.</p>
      </div>

      <input
        className="w-full rounded-2xl border border-slate-200 px-4 py-3"
        placeholder="Title"
        value={form.title}
        onChange={(event) => setForm({ ...form, title: event.target.value })}
        required
      />

      <div className="grid gap-4 md:grid-cols-2">
        <select
          className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          value={form.type}
          onChange={(event) =>
            setForm({
              ...form,
              type: event.target.value as ListingType,
              priceUnit: event.target.value === 'sale' ? '' : form.priceUnit,
              acceptsOffers: event.target.value === 'sale' ? form.acceptsOffers : false,
              minimumOfferAmount: event.target.value === 'sale' ? form.minimumOfferAmount : '',
            })
          }
        >
          <option value="sale">For sale</option>
          <option value="rent">To rent</option>
          <option value="rent-to-own">Rent to own</option>
        </select>

        <div className={`grid gap-4 ${needsUnit ? 'grid-cols-[minmax(0,1fr)_180px]' : 'grid-cols-1'}`}>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">GBP</span>
            <input
              className="w-full rounded-2xl border border-slate-200 py-3 pl-14 pr-4"
              placeholder={isFreeStuff ? '0' : needsUnit ? '18' : '1700'}
              inputMode="decimal"
              value={form.priceAmount}
              onChange={(event) => setForm({ ...form, priceAmount: event.target.value })}
              min={isFreeStuff ? 0 : 0.5}
              required
            />
          </div>

          {needsUnit ? (
            <select
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
              value={form.priceUnit}
              onChange={(event) =>
                setForm({ ...form, priceUnit: event.target.value as Exclude<PriceUnit, null> })
              }
              required
            >
              <option value="">Choose unit</option>
              {rentalUnits.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <select
          className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          value={form.category}
          onChange={(event) => setForm({ ...form, category: event.target.value })}
        >
          {marketplaceCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <input
          className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          placeholder="Location"
          value={form.location}
          onChange={(event) => setForm({ ...form, location: event.target.value })}
          required
        />
      </div>

      {showOfferSettings ? (
        <p className="text-sm text-slate-500">
          {isFreeStuff ? 'Free Stuff listings must be priced at 0 and will display as Free.' : 'Sale listings must be at least £0.50.'}
        </p>
      ) : null}

      <div className={`grid gap-4 ${showOfferSettings ? 'md:grid-cols-[160px_minmax(0,1fr)]' : 'md:grid-cols-1'}`}>
        <input
          className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          placeholder="Quantity"
          inputMode="numeric"
          min={1}
          value={form.quantityAvailable}
          onChange={(event) => setForm({ ...form, quantityAvailable: event.target.value })}
          required
        />

        {showOfferSettings ? (
          <div className="rounded-2xl border border-slate-200 p-4">
            <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={form.acceptsOffers}
                onChange={(event) =>
                  setForm({
                    ...form,
                    acceptsOffers: event.target.checked,
                    minimumOfferAmount: event.target.checked ? form.minimumOfferAmount : '',
                  })
                }
              />
              Enable minimum offer
            </label>

            {form.acceptsOffers ? (
              <div className="relative mt-3">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">GBP</span>
                <input
                  className="w-full rounded-2xl border border-slate-200 py-3 pl-14 pr-4"
                  placeholder="Minimum offer"
                  inputMode="decimal"
                  value={form.minimumOfferAmount}
                  onChange={(event) => setForm({ ...form, minimumOfferAmount: event.target.value })}
                  required
                />
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500">Counter offers are turned off for this item.</p>
            )}
          </div>
        ) : null}
      </div>

      <div className="rounded-2xl border border-dashed border-slate-300 p-4">
        <label className="block text-sm font-medium text-slate-700">Upload image</label>
        <input
          type="file"
          accept="image/*"
          className="mt-3 block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
          onChange={handleImageChange}
          required
        />
        {previewUrl ? (
          <div className="mt-4 overflow-hidden rounded-2xl bg-slate-100">
            <img src={previewUrl} alt="Selected upload preview" className="h-48 w-full object-cover" />
          </div>
        ) : null}
      </div>

      <textarea
        className="min-h-[140px] w-full rounded-2xl border border-slate-200 px-4 py-3"
        placeholder="Describe the item or service"
        value={form.description}
        onChange={(event) => setForm({ ...form, description: event.target.value })}
        required
      />

      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-2xl bg-slate-900 px-5 py-3 text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? 'Publishing...' : 'Publish listing'}
      </button>
    </form>
  );
}
