type ReplyComposerProps = {
  listingId: string;
  listingTitle: string;
  recipientId: string;
  buttonLabel?: string;
  afterSendPath?: string;
};

export default function ReplyComposer({
  listingId,
  listingTitle,
  recipientId,
  buttonLabel = 'Send message',
  afterSendPath,
}: ReplyComposerProps) {
  return (
    <form action="/api/messages/send" method="POST" className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <input type="hidden" name="listingId" value={listingId} />
      <input type="hidden" name="listingTitle" value={listingTitle} />
      <input type="hidden" name="recipientId" value={recipientId} />
      <input type="hidden" name="returnTo" value={afterSendPath || ''} />

      <div className="flex items-end gap-3">
        <textarea
          name="message"
          className="min-h-[56px] flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
          placeholder="Write a reply..."
          required
        />

        <button
          type="submit"
          className="shrink-0 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white"
        >
          {buttonLabel}
        </button>
      </div>
    </form>
  );
}
