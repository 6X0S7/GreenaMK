import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getUsers } from '@/lib/file-db';
import { saveUsers } from '@/lib/file-db';
import { makeId } from '@/lib/format';

function compact(value: FormDataEntryValue | null) {
  return String(value || '').trim();
}

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  const origin = new URL(request.url).origin;

  if (!currentUser) {
    return NextResponse.redirect(new URL('/sign-in?next=%2Fsettings', origin));
  }

  const formData = await request.formData();
  const users = await getUsers();

  const addresses = [1, 2, 3]
    .map((slot) => {
      const label = compact(formData.get(`address_${slot}_label`));
      const line1 = compact(formData.get(`address_${slot}_line1`));
      const line2 = compact(formData.get(`address_${slot}_line2`));
      const city = compact(formData.get(`address_${slot}_city`));
      const postcode = compact(formData.get(`address_${slot}_postcode`));

      if (!label || !line1 || !city || !postcode) {
        return null;
      }

      return {
        id: compact(formData.get(`address_${slot}_id`)) || makeId(),
        label,
        line1,
        line2,
        city,
        postcode,
      };
    })
    .filter((address): address is NonNullable<typeof address> => Boolean(address));

  const nextUsers = users.map((user) =>
    user.id === currentUser.id
      ? {
          ...user,
          addresses,
        }
      : user
  );

  await saveUsers(nextUsers);
  return NextResponse.redirect(new URL('/settings', origin));
}
