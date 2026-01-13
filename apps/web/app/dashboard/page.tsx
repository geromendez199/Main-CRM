export default function DashboardPage() {
  const kpis = [
    { label: 'Open Deals', value: '42' },
    { label: 'Pipeline Value', value: '$1.2M' },
    { label: 'Tasks Due', value: '14' },
    { label: 'Accounts', value: '128' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">{kpi.label}</p>
            <p className="text-2xl font-semibold text-slate-900">{kpi.value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold">Activity summary</h3>
        <p className="mt-2 text-slate-600">Your team closed 6 deals this week and logged 24 activities.</p>
      </div>
    </div>
  );
}
