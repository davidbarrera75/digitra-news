const APIFY_BASE = "https://api.apify.com/v2";

function getToken() {
  const token = process.env.APIFY_TOKEN;
  if (!token) throw new Error("APIFY_TOKEN no configurado");
  return token;
}

export async function runActor(actorId: string, input: object, timeoutSecs = 300): Promise<string> {
  const encodedId = actorId.replace("/", "~");
  const res = await fetch(`${APIFY_BASE}/acts/${encodedId}/runs?token=${getToken()}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...input,
      timeoutSecs,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Apify run failed: ${res.status} ${err}`);
  }

  const run = await res.json();
  const runId = run.data.id;

  // Poll for completion
  let status = run.data.status;
  while (status === "RUNNING" || status === "READY") {
    await new Promise((r) => setTimeout(r, 5000));
    const pollRes = await fetch(`${APIFY_BASE}/actor-runs/${runId}?token=${getToken()}`);
    const pollData = await pollRes.json();
    status = pollData.data.status;

    if (status === "FAILED" || status === "TIMED-OUT" || status === "ABORTED") {
      throw new Error(`Apify run ${status}: ${runId}`);
    }
  }

  return run.data.defaultDatasetId;
}

export async function getDatasetItems<T = Record<string, unknown>>(datasetId: string): Promise<T[]> {
  const res = await fetch(`${APIFY_BASE}/datasets/${datasetId}/items?token=${getToken()}&format=json`);
  if (!res.ok) throw new Error(`Failed to get dataset: ${res.status}`);
  return res.json();
}
