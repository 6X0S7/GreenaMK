import Link from 'next/link';

const waysToUseGreena = [
  'Find free stuff locally',
  'Buy things nearby',
  'Rent when you only need it for a bit',
  'Rent to own bigger items',
  'Get it delivered or collect it yourself',
];

export default function Hero() {
  return (
    <section className="border-b border-slate-200 bg-[#f6f7f4]">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            A friendlier way to buy, rent, or pass things on locally.
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Browse everyday things from people nearby, from electronics and tools to books, garden
            gear, furniture and free stuff.
          </p>
        </div>

        <div className="mt-5 overflow-x-auto">
          <div className="flex min-w-max gap-2.5">
            {waysToUseGreena.map((item) => (
              <div
                key={item}
                className="border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2.5">
          <Link href="/browse" className="bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white">
            Browse listings
          </Link>
          <Link href="/sell" className="border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800">
            List something
          </Link>
        </div>
      </div>
    </section>
  );
}
