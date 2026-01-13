const baseUrl = process.env.API_BASE_URL ?? 'http://localhost:4000';
const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@maincrm.local';
const password = process.env.SEED_ADMIN_PASSWORD ?? 'ChangeMe123!';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const request = async (path, options = {}) => {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {})
    }
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Request failed ${response.status}: ${text}`);
  }
  return response.json();
};

const main = async () => {
  const login = await request('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });

  const accessToken = login.data.accessToken;
  if (!accessToken) {
    throw new Error('Missing access token');
  }

  const authHeaders = { Authorization: `Bearer ${accessToken}` };

  const account = await request('/api/v1/accounts', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ name: `Smoke Account ${Date.now()}` })
  });

  const accountId = account.data.id;

  const pipelines = await request('/api/v1/pipelines', { headers: authHeaders });
  const pipelineId = pipelines.data.items[0]?.id;
  if (!pipelineId) {
    throw new Error('No pipeline found');
  }

  const stages = await request('/api/v1/stages', { headers: authHeaders });
  const wonStage = stages.data.items.find((stage) => stage.key === 'WON');
  const leadStage = stages.data.items.find((stage) => stage.key === 'LEAD');
  if (!wonStage || !leadStage) {
    throw new Error('Missing stage configuration');
  }

  const deal = await request('/api/v1/deals', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      name: `Smoke Deal ${Date.now()}`,
      accountId,
      pipelineId,
      stageId: leadStage.id
    })
  });

  const dealId = deal.data.id;

  await request(`/api/v1/deals/${dealId}`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({ stageId: wonStage.id })
  });

  let tasksResponse;
  for (let attempt = 0; attempt < 10; attempt += 1) {
    tasksResponse = await request(`/api/v1/tasks?dealId=${dealId}`, { headers: authHeaders });
    if (tasksResponse.data.items.length > 0) {
      break;
    }
    await sleep(1000);
  }

  if (!tasksResponse || tasksResponse.data.items.length === 0) {
    throw new Error('Automation tasks not created');
  }

  const auditLogs = await request('/api/v1/audit-logs', { headers: authHeaders });
  const hasDealAudit = auditLogs.data.items.some((entry) => entry.entityId === dealId);
  if (!hasDealAudit) {
    throw new Error('Audit log entries missing for deal');
  }

  console.log('Smoke test passed');
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
