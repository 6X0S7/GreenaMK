'use client';

import ReplyComposer from './ReplyComposer';

type Props = {
  listingId: string;
  listingTitle: string;
  recipientId: string;
  recipientName: string;
  afterSendPath?: string;
};

export default function MessageForm({ listingId, listingTitle, recipientId, recipientName, afterSendPath }: Props) {
  return (
    <div className="space-y-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Message seller</h2>
        <p className="mt-1 text-slate-600">
          Your message will be sent directly to {recipientName} about this listing.
        </p>
      </div>
      <ReplyComposer
        listingId={listingId}
        listingTitle={listingTitle}
        recipientId={recipientId}
        buttonLabel="Send enquiry"
        afterSendPath={afterSendPath}
      />
    </div>
  );
}
