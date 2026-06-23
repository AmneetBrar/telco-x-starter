// Fetch wrapper for all three pages.
const API = {
  async searchLocations(q = '') {
    const res = await fetch(`/api/locations${q ? `?q=${encodeURIComponent(q)}` : ''}`);
    if (!res.ok) throw new Error('search_failed');
    return res.json();
  },
  async getLocation(id) {
    const res = await fetch(`/api/locations/${encodeURIComponent(id)}`);
    if (res.status === 404) throw new Error('not_found');
    if (!res.ok) throw new Error('fetch_failed');
    return res.json();
  },
  async getTechnology(id) {
    const res = await fetch(`/api/locations/${encodeURIComponent(id)}/technology`);
    if (!res.ok) throw new Error('tech_failed');
    return res.json();
  },
  async getProducts(tech) {
    const res = await fetch(`/api/technology/${encodeURIComponent(tech)}/products`);
    if (!res.ok) throw new Error('products_failed');
    return res.json();
  },
  async getSubscriber(id) {
    const res = await fetch(`/api/locations/${encodeURIComponent(id)}/subscriber`);
    if (res.status === 403) throw Object.assign(new Error('not_active'), { status: 403 });
    if (res.status === 404) throw Object.assign(new Error('not_found'), { status: 404 });
    if (!res.ok) throw new Error('subscriber_failed');
    return res.json();
  },
  async getNetwork(id) {
    const res = await fetch(`/api/locations/${encodeURIComponent(id)}/network`);
    if (!res.ok) throw new Error('network_failed');
    return res.json();
  },
  async getService(id) {
    const res = await fetch(`/api/locations/${encodeURIComponent(id)}/service`);
    if (!res.ok) throw new Error('service_failed');
    return res.json();
  },
  async getProviders(tech) {
    const res = await fetch(`/api/technology/${encodeURIComponent(tech)}/providers`);
    if (!res.ok) throw new Error('providers_failed');
    return res.json();
  },
};
