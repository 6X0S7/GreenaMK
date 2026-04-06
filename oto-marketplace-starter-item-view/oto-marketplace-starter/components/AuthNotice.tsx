import Link from 'next/link';

type AuthNoticeProps = {
  title: string;
  body: string;
  nextPath?: string;
};

export default function AuthNotice({ title, body, nextPath = '/' }: AuthNoticeProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      <p className="mt-2 text-slate-600">{body}</p>
      <Link
        href={`/sign-in?next=${encodeURIComponent(nextPath)}`}
        className="mt-5 inline-flex rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white"
      >
        Sign in to continue
      </Link>
    </div>
  );
}
