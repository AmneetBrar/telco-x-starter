// Telco X — API test suite covering the full acceptance-criteria path matrix.
const request = require('supertest');
const app = require('../server');

// ── Tool 1 (worked example) ──────────────────────────────────────────────────
describe('Tool 1 — Locations', () => {
  test('returns all ten addresses', async () => {
    const res = await request(app).get('/api/locations');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(10);
  });

  test('search narrows results by suburb', async () => {
    const res = await request(app).get('/api/locations?q=brunswick');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body.every(l => /brunswick/i.test(l.suburb))).toBe(true);
  });

  test('unknown address returns a helpful 404', async () => {
    const res = await request(app).get('/api/locations/LOC-999');
    expect(res.status).toBe(404);
    expect(res.body.message).toBeTruthy();
  });

  test('known address includes coordinates for the map pin', async () => {
    const res = await request(app).get('/api/locations/LOC-001');
    expect(res.status).toBe(200);
    expect(typeof res.body.latitude).toBe('number');
    expect(typeof res.body.longitude).toBe('number');
  });

  test('known address includes connection_status', async () => {
    const res = await request(app).get('/api/locations/LOC-001');
    expect(res.status).toBe(200);
    expect(['active', 'previous', 'never']).toContain(res.body.connection_status);
  });
});

// ── Tool 2 — Technology ──────────────────────────────────────────────────────
describe('Tool 2 — Technology', () => {
  test('returns technology for a known location', async () => {
    const res = await request(app).get('/api/locations/LOC-001/technology');
    expect(res.status).toBe(200);
    expect(res.body.technology).toBe('FTTP');
    expect(res.body.max_speed_mbps).toBe(1000);
  });

  test('returns technology for a non-active location (LOC-005 is previous)', async () => {
    const res = await request(app).get('/api/locations/LOC-005/technology');
    expect(res.status).toBe(200);
    expect(res.body.technology).toBeTruthy();
  });

  test('returns 404 for unknown location', async () => {
    const res = await request(app).get('/api/locations/LOC-999/technology');
    expect(res.status).toBe(404);
  });
});

// ── Tool 3 — Products ────────────────────────────────────────────────────────
describe('Tool 3 — Products', () => {
  test('returns FTTP product list (5 plans)', async () => {
    const res = await request(app).get('/api/technology/FTTP/products');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(5);
  });

  test('returns HFC product list (3 plans)', async () => {
    const res = await request(app).get('/api/technology/HFC/products');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(3);
  });

  test('returns Fixed Wireless product list (2 plans)', async () => {
    const res = await request(app).get('/api/technology/Fixed%20Wireless/products');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  test('returns empty array for unknown technology', async () => {
    const res = await request(app).get('/api/technology/UNKNOWN/products');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  });
});

// ── Tool 4 — Subscriber (AC-04, AC-10) ──────────────────────────────────────
describe('Tool 4 — Subscriber (active guard)', () => {
  test('returns subscriber record for active location (LOC-001)', async () => {
    const res = await request(app).get('/api/locations/LOC-001/subscriber');
    expect(res.status).toBe(200);
    expect(res.body.account_ref).toBeTruthy();
    expect(res.body.current_product_name).toBeTruthy();
    expect(res.body).toHaveProperty('upgrade_eligible');
  });

  test('AC-10: non-active location (LOC-005 previous) returns 403', async () => {
    const res = await request(app).get('/api/locations/LOC-005/subscriber');
    expect(res.status).toBe(403);
  });

  test('AC-10: never-connected location (LOC-007) returns 403', async () => {
    const res = await request(app).get('/api/locations/LOC-007/subscriber');
    expect(res.status).toBe(403);
  });

  test('LOC-001 upgrade_eligible is false (AC-08)', async () => {
    const res = await request(app).get('/api/locations/LOC-001/subscriber');
    expect(res.status).toBe(200);
    expect(res.body.upgrade_eligible).toBe(false);
  });

  test('LOC-002 upgrade_eligible is true (AC-07)', async () => {
    const res = await request(app).get('/api/locations/LOC-002/subscriber');
    expect(res.status).toBe(200);
    expect(res.body.upgrade_eligible).toBe(true);
  });
});

// ── Tool 5 — Network (AC-05, AC-10) ─────────────────────────────────────────
describe('Tool 5 — Network (active guard)', () => {
  test('returns network record for active location (LOC-001)', async () => {
    const res = await request(app).get('/api/locations/LOC-001/network');
    expect(res.status).toBe(200);
    expect(['green', 'amber', 'red']).toContain(res.body.network_status);
    expect(typeof res.body.sync_down_mbps).toBe('number');
  });

  test('AC-10: non-active location (LOC-005) returns 403', async () => {
    const res = await request(app).get('/api/locations/LOC-005/network');
    expect(res.status).toBe(403);
  });

  test('AC-10: never-connected location (LOC-007) returns 403', async () => {
    const res = await request(app).get('/api/locations/LOC-007/network');
    expect(res.status).toBe(403);
  });
});

// ── Tool 6 — Service (AC-06, AC-10) ─────────────────────────────────────────
describe('Tool 6 — Service (active guard)', () => {
  test('returns service record for active location (LOC-001)', async () => {
    const res = await request(app).get('/api/locations/LOC-001/service');
    expect(res.status).toBe(200);
    expect(['green', 'amber', 'red']).toContain(res.body.service_health);
    expect(typeof res.body.open_tickets).toBe('number');
  });

  test('AC-10: non-active location (LOC-005) returns 403', async () => {
    const res = await request(app).get('/api/locations/LOC-005/service');
    expect(res.status).toBe(403);
  });

  test('AC-10: never-connected location (LOC-008) returns 403', async () => {
    const res = await request(app).get('/api/locations/LOC-008/service');
    expect(res.status).toBe(403);
  });
});

// ── Tool 7 — Providers (AC-14, AC-15) ───────────────────────────────────────
describe('Tool 7 — Providers (AC-15: count + names exact)', () => {
  test('FTTP has exactly 5 providers', async () => {
    const res = await request(app).get('/api/technology/FTTP/providers');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(5);
  });

  test('FTTP provider names match Tool 7 exactly', async () => {
    const res = await request(app).get('/api/technology/FTTP/providers');
    expect(res.body).toEqual(['Aurora Telecom', 'BlueWave', 'Corelink', 'Meridian Net', 'Skyline Broadband']);
  });

  test('HFC has exactly 4 providers', async () => {
    const res = await request(app).get('/api/technology/HFC/providers');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(4);
  });

  test('FTTN has exactly 3 providers', async () => {
    const res = await request(app).get('/api/technology/FTTN/providers');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(3);
  });

  test('FTTC has exactly 4 providers', async () => {
    const res = await request(app).get('/api/technology/FTTC/providers');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(4);
  });

  test('Fixed Wireless has exactly 2 providers', async () => {
    const res = await request(app).get('/api/technology/Fixed%20Wireless/providers');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body).toEqual(['Aurora Telecom', 'Skyline Broadband']);
  });

  test('returns empty array for unknown technology', async () => {
    const res = await request(app).get('/api/technology/UNKNOWN/providers');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  });
});
