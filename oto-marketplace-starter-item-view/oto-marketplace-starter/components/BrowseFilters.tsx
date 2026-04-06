type BrowseFiltersProps = {
  categories: string[];
  selectedCategory?: string;
  selectedMinPrice?: string;
  selectedMaxPrice?: string;
  selectedDistance?: string;
  selectedMode?: string;
  query?: string;
  isFreeStuffMode?: boolean;
};

export default function BrowseFilters({
  categories,
  selectedCategory = '',
  selectedMinPrice = '',
  selectedMaxPrice = '',
  selectedDistance = '',
  selectedMode = 'buy',
  query = '',
  isFreeStuffMode = false,
}: BrowseFiltersProps) {
  return (
    <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <form action="/browse">
        <input type="hidden" name="q" value={query} />
        <input type="hidden" name="mode" value={selectedMode} />

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Filters</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">Refine results</h2>
          <p className="mt-2 text-sm text-slate-600">
            Narrow listings by category and how far you want to search.
          </p>
        </div>

        <div className="mt-6 space-y-6">
          <section>
            <h3 className="text-sm font-semibold text-slate-900">Category</h3>
            <select
              name="category"
              defaultValue={selectedCategory}
              className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </section>

          {!isFreeStuffMode ? (
            <section>
              <h3 className="text-sm font-semibold text-slate-900">Price range</h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="minPrice" className="mb-2 block text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                    Min
                  </label>
                  <input
                    id="minPrice"
                    name="minPrice"
                    type="number"
                    min={0}
                    step="1"
                    defaultValue={selectedMinPrice}
                    placeholder="Any"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="maxPrice" className="mb-2 block text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                    Max
                  </label>
                  <input
                    id="maxPrice"
                    name="maxPrice"
                    type="number"
                    min={0}
                    step="1"
                    defaultValue={selectedMaxPrice}
                    placeholder="Any"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
                  />
                </div>
              </div>
            </section>
          ) : null}

          <section>
            <h3 className="text-sm font-semibold text-slate-900">Distance</h3>
            <div className="mt-3 space-y-3">
              <label className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-700">
                <input
                  type="radio"
                  name="distanceMode"
                  value=""
                  className="h-4 w-4 border-slate-300 text-slate-900"
                  defaultChecked={!selectedDistance}
                />
                <span>Anywhere</span>
              </label>
              <label className="block rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-700">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="distanceMode"
                    value="range"
                    className="h-4 w-4 border-slate-300 text-slate-900"
                    defaultChecked={Boolean(selectedDistance)}
                  />
                  <span>Range</span>
                </div>
                <input
                  name="distance"
                  type="number"
                  min={1}
                  step="1"
                  defaultValue={selectedDistance}
                  placeholder="Miles"
                  className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
                />
              </label>
            </div>
          </section>
        </div>

        <div className="mt-6 flex gap-3">
          <button type="submit" className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white">
            Apply filters
          </button>
          <a
            href={selectedMode === 'buy' ? '/browse' : `/browse?mode=${encodeURIComponent(selectedMode)}`}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700"
          >
            Reset
          </a>
        </div>
      </form>
    </aside>
  );
}
