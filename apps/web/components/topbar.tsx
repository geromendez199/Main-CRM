export function Topbar() {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">Welcome back</h1>
        <p className="text-sm text-slate-500">Track your pipeline performance</p>
      </div>
      <div className="flex items-center gap-3">
        <button className="rounded-md border border-slate-200 px-3 py-1 text-sm">Help</button>
        <div className="h-9 w-9 rounded-full bg-slate-200" />
      </div>
    </header>
  );
}
