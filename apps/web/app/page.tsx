import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Main CRM Overview</h2>
        <p className="mt-2 text-slate-600">Use the navigation to access CRM workflows.</p>
        <Link className="mt-4 inline-flex rounded-md bg-slate-900 px-4 py-2 text-white" href="/dashboard">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
