import SectionHeader from '@/components/SectionHeader';
import { requireUser } from '@/lib/auth';

export default async function SettingsPage() {
  const currentUser = await requireUser('/settings');
  const addresses = currentUser.addresses || [];

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <SectionHeader
        title="Settings"
        subtitle="Manage the shipping addresses you can choose from when buying through Greena."
      />

      <form action="/api/settings" method="POST" className="mt-6 space-y-5 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        {[0, 1, 2].map((index) => {
          const address = addresses[index];
          const slot = index + 1;

          return (
            <section key={slot} className="rounded-2xl border border-slate-200 p-4">
              <input type="hidden" name={`address_${slot}_id`} defaultValue={address?.id || ''} />
              <div className="text-lg font-semibold text-slate-900">Address {slot}</div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <input
                  name={`address_${slot}_label`}
                  defaultValue={address?.label || ''}
                  placeholder="Label e.g. Home"
                  className="rounded-2xl border border-slate-200 px-4 py-3"
                />
                <input
                  name={`address_${slot}_line1`}
                  defaultValue={address?.line1 || ''}
                  placeholder="Address line 1"
                  className="rounded-2xl border border-slate-200 px-4 py-3"
                />
                <input
                  name={`address_${slot}_line2`}
                  defaultValue={address?.line2 || ''}
                  placeholder="Address line 2"
                  className="rounded-2xl border border-slate-200 px-4 py-3"
                />
                <input
                  name={`address_${slot}_city`}
                  defaultValue={address?.city || ''}
                  placeholder="City"
                  className="rounded-2xl border border-slate-200 px-4 py-3"
                />
                <input
                  name={`address_${slot}_postcode`}
                  defaultValue={address?.postcode || ''}
                  placeholder="Postcode"
                  className="rounded-2xl border border-slate-200 px-4 py-3"
                />
              </div>
            </section>
          );
        })}

        <button type="submit" className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
          Save settings
        </button>
      </form>
    </main>
  );
}
