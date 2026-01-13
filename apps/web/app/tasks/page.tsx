const tasks = [
  { title: 'Prepare onboarding deck', due: 'Today', priority: 'High' },
  { title: 'Follow up with Lumina', due: 'Tomorrow', priority: 'Medium' },
  { title: 'Review pipeline notes', due: 'Friday', priority: 'Low' }
];

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Tasks</h2>
          <p className="text-slate-600">Keep track of your daily actions.</p>
        </div>
        <button className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white">New Task</button>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.title} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4">
            <div>
              <p className="font-medium text-slate-900">{task.title}</p>
              <p className="text-sm text-slate-500">Due {task.due}</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{task.priority}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
