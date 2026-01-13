const columns = [
  {
    title: 'Lead',
    deals: ['Acme Expansion', 'Globex Pilot']
  },
  {
    title: 'Qualified',
    deals: ['Northwind Renewal']
  },
  {
    title: 'Proposal',
    deals: ['Lumina Upgrade']
  },
  {
    title: 'Negotiation',
    deals: ['Contoso Rollout']
  },
  {
    title: 'Won',
    deals: ['Initech Enterprise']
  }
];

export default function DealsPipelinePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Deals Pipeline</h2>
          <p className="text-slate-600">Track opportunities across stages.</p>
        </div>
        <button className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white">New Deal</button>
      </div>
      <div className="grid gap-4 overflow-x-auto md:grid-cols-2 lg:grid-cols-5">
        {columns.map((column) => (
          <div key={column.title} className="min-w-[200px] rounded-lg border border-slate-200 bg-white p-4">
            <h3 className="font-semibold text-slate-900">{column.title}</h3>
            <div className="mt-3 space-y-2">
              {column.deals.map((deal) => (
                <div key={deal} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                  {deal}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
