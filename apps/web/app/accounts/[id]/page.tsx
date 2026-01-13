const sections = [
  { title: 'Contacts', items: ['Sophia Carter', 'Mark Stone'] },
  { title: 'Deals', items: ['Enterprise Renewal', 'Expansion Opportunity'] },
  { title: 'Activities', items: ['Call logged', 'Meeting scheduled'] },
  { title: 'Tasks', items: ['Prepare proposal', 'Send follow-up email'] }
];

export default function AccountDetailPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Northwind Traders</h2>
        <p className="mt-2 text-slate-600">Manufacturing · Owned by Ava Diaz</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {sections.map((section) => (
          <div key={section.title} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-lg font-semibold">{section.title}</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {section.items.map((item) => (
                <li key={item} className="rounded-md bg-slate-50 px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
