import Link from 'next/link';

const featuredCategories = [
  {
    name: 'Free Stuff',
    image:
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Electronics',
    image:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Power Tools & DIY',
    image:
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Gardening',
    image:
      'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Furniture',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Books',
    image:
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=1200&auto=format&fit=crop',
  },
];

export default function CategoryGrid() {
  return (
    <section className="bg-[#f6f7f4] py-8">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Featured categories</h2>
            <p className="mt-1.5 text-sm text-slate-600">A few easy places to start.</p>
          </div>
          <Link href="/browse" className="text-sm font-medium text-slate-700 hover:text-slate-950">
            See all
          </Link>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCategories.map((category) => (
            <Link
              key={category.name}
              href={
                category.name === 'Free Stuff'
                  ? '/browse?mode=free'
                  : `/browse?category=${encodeURIComponent(category.name)}`
              }
              className="overflow-hidden border border-slate-200 bg-white"
            >
              <img src={category.image} alt={category.name} className="h-36 w-full object-cover" />
              <div className="p-3">
                <div className="text-base font-semibold text-slate-900">{category.name}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
