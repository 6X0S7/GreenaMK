import Link from 'next/link';
import ReplyComposer from '@/components/ReplyComposer';
import SectionHeader from '@/components/SectionHeader';
import { requireUser } from '@/lib/auth';
import { getListings, getMessages } from '@/lib/file-db';
import { formatRelativeDate } from '@/lib/format';
import { getThreadKey } from '@/lib/marketplace';

export const dynamic = 'force-dynamic';

export default async function MessagesPage({
  searchParams,
}: {
  searchParams?: { view?: string; thread?: string; error?: string };
}) {
  const currentUser = await requireUser('/messages');
  const [messages, listings] = await Promise.all([getMessages(), getListings()]);
  const activeView = searchParams?.view === 'selling' ? 'selling' : 'buying';
  const listingMap = new Map(listings.map((listing) => [listing.id, listing]));

  const relevantMessages = messages.filter((message) => {
    const listing = listingMap.get(message.listingId);
    if (!listing) {
      return false;
    }

    if (activeView === 'selling') {
      return listing.sellerId === currentUser.id;
    }

    return listing.sellerId !== currentUser.id && (message.senderId === currentUser.id || message.recipientId === currentUser.id);
  });

  const threads = Array.from(
    relevantMessages.reduce((map, message) => {
      const key = getThreadKey(message);
      const existing = map.get(key) || [];
      existing.push(message);
      map.set(key, existing);
      return map;
    }, new Map<string, typeof relevantMessages>())
  )
    .map(([, threadMessages]) => {
      const sortedMessages = threadMessages.sort(
        (left, right) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime()
      );
      const latest = sortedMessages[sortedMessages.length - 1];
      const counterpart =
        latest.senderId === currentUser.id
          ? { id: latest.recipientId, name: latest.recipientName }
          : { id: latest.senderId, name: latest.senderName };
      const listing = listingMap.get(latest.listingId);

      return {
        id: getThreadKey(latest),
        listingTitle: latest.listingTitle,
        listingId: latest.listingId,
        listingImage: listing?.image || '',
        listingPrice: listing?.price || '',
        listingRating: listing?.rating || 5,
        profileId: counterpart.id,
        counterpart,
        latest,
        messages: sortedMessages,
      };
    })
    .sort(
      (left, right) =>
        new Date(right.latest.createdAt).getTime() - new Date(left.latest.createdAt).getTime()
    );

  const selectedThread = threads.find((thread) => thread.id === searchParams?.thread) ?? threads[0] ?? null;

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <SectionHeader title="Messages" />

      {searchParams?.error ? (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {searchParams.error}
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href="/messages?view=buying"
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            activeView === 'buying' ? 'bg-slate-900 text-white' : 'border border-slate-200 bg-white text-slate-700'
          }`}
        >
          Buying
        </Link>
        <Link
          href="/messages?view=selling"
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            activeView === 'selling' ? 'bg-slate-900 text-white' : 'border border-slate-200 bg-white text-slate-700'
          }`}
        >
          Selling
        </Link>
      </div>

      <div className="mt-6 grid h-[calc(100vh-220px)] min-h-[620px] gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="flex h-full flex-col rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div className="mb-3 px-2 text-sm font-semibold text-slate-500">
            {activeView === 'buying' ? 'Items you are interested in' : 'Enquiries on your items'}
          </div>

          {threads.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 ring-1 ring-slate-200">
              No conversations in this view yet.
            </div>
          ) : (
            <div className="flex-1 space-y-2 overflow-y-auto pr-1">
              {threads.map((thread) => {
                const previewHref = `/messages?view=${activeView}&thread=${encodeURIComponent(thread.id)}`;
                const isSelected = selectedThread?.id === thread.id;
                const previewText = `${thread.counterpart.name}: ${thread.latest.message}`;

                return (
                  <Link
                    key={thread.id}
                    href={previewHref}
                    className={`flex items-center gap-3 rounded-2xl p-3 transition ${
                      isSelected ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900 ring-1 ring-slate-200'
                    }`}
                  >
                    <div
                      className="h-16 w-16 shrink-0 rounded-2xl bg-slate-200 bg-cover bg-center"
                      style={{ backgroundImage: `url(${thread.listingImage})` }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className={`truncate text-sm font-semibold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                        {thread.listingTitle} / {thread.listingPrice}
                      </div>
                      <div className={`mt-1 truncate text-sm ${isSelected ? 'text-slate-200' : 'text-slate-600'}`}>
                        {previewText}
                      </div>
                      <div className={`mt-1 text-xs ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                        {formatRelativeDate(thread.latest.createdAt)}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </aside>

        <section className="flex h-full flex-col rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          {!selectedThread ? (
            <div className="rounded-2xl bg-slate-50 p-6 text-slate-600 ring-1 ring-slate-200">
              Select a chat to read the full conversation.
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex min-w-0 items-center gap-4">
                  <Link
                    href={`/listings/${selectedThread.listingId}`}
                    className="h-20 w-20 shrink-0 rounded-3xl bg-slate-200 bg-cover bg-center"
                    style={{ backgroundImage: `url(${selectedThread.listingImage})` }}
                    aria-label={`Open ${selectedThread.listingTitle}`}
                  />
                  <div className="min-w-0">
                    <Link href={`/listings/${selectedThread.listingId}`} className="block truncate text-2xl font-bold text-slate-900 hover:text-slate-700">
                      {selectedThread.listingTitle} / {selectedThread.listingPrice}
                    </Link>
                    <Link href={`/users/${selectedThread.profileId}`} className="mt-1 block text-sm text-slate-600 hover:text-slate-900">
                      {selectedThread.counterpart.name}
                    </Link>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-sm font-semibold text-slate-900">{selectedThread.listingRating.toFixed(1)} / 5</div>
                  <div className="mt-1 text-xs text-slate-500">{formatRelativeDate(selectedThread.latest.createdAt)}</div>
                </div>
              </div>

              <div className="mt-4 flex-1 space-y-3 overflow-y-auto pr-2">
                {selectedThread.messages.map((message) => {
                  const isMine = message.senderId === currentUser.id;

                  return (
                    <div
                      key={message.id}
                      className={`w-fit max-w-[78%] rounded-[22px] px-4 py-3 ${
                        isMine
                          ? 'ml-auto bg-slate-900 text-white'
                          : 'bg-slate-50 text-slate-900 ring-1 ring-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="text-sm font-semibold">{isMine ? 'You' : message.senderName}</div>
                        <div className={`text-xs ${isMine ? 'text-slate-300' : 'text-slate-500'}`}>
                          {formatRelativeDate(message.createdAt)}
                        </div>
                      </div>
                      <p className={`mt-1 text-sm leading-6 ${isMine ? 'text-slate-100' : 'text-slate-700'}`}>
                        {message.message}
                      </p>
                    </div>
                  );
                })}
              </div>

              <ReplyComposer
                listingId={selectedThread.listingId}
                listingTitle={selectedThread.listingTitle}
                recipientId={selectedThread.counterpart.id}
                buttonLabel="Reply"
                afterSendPath={`/messages?view=${activeView}&thread=${encodeURIComponent(selectedThread.id)}`}
              />
            </>
          )}
        </section>
      </div>
    </main>
  );
}
