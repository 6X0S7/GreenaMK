import SectionHeader from '@/components/SectionHeader';
import SellForm from '@/components/SellForm';
import { requireUser } from '@/lib/auth';

export default async function SellPage() {
  const currentUser = await requireUser('/sell');

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <SectionHeader
        title="List an item"
        subtitle={`Signed in as ${currentUser.name}. New listings will appear under your seller profile.`}
      />
      <div className="mt-6">
        <SellForm />
      </div>
    </main>
  );
}
