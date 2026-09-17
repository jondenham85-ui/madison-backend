const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getBackendHealth() {
  const res = await fetch(`${BASE_URL}/api/health`);
  return res.json();
}

export async function getDiagnostic() {
  const res = await fetch(`${BASE_URL}/api/system/diagnostic`);
  return res.json();
}

export async function getOwnerStatus() {
  const res = await fetch(`${BASE_URL}/api/owner/status`);
  return res.json();
}
