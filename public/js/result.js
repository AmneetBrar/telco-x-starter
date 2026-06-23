// Page 2 — Address result. Branches on connection_status: active vs previous/never.
(async () => {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  if (!id) { location.replace('/'); return; }

  document.getElementById('back-btn').addEventListener('click', () => history.back());

  const loading     = document.getElementById('loading');
  const pageContent = document.getElementById('page-content');
  const pageError   = document.getElementById('page-error');
  const pageErrorMsg = document.getElementById('page-error-msg');

  function showError(msg) {
    loading.hidden = true;
    pageError.hidden = false;
    pageErrorMsg.textContent = msg;
  }

  function setRag(el, status) {
    el.className = `tx-rag tx-rag--${status}`;
    el.textContent = status.charAt(0).toUpperCase() + status.slice(1);
  }

  function fmtDate(str) {
    return str ? new Date(str).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }) : 'None recorded';
  }

  function populateMap(labelEl, coordsEl, panelEl, loc) {
    if (labelEl) labelEl.textContent = `${loc.address}, ${loc.suburb}`;
    if (coordsEl) coordsEl.textContent = `${loc.latitude}, ${loc.longitude}`;
    if (panelEl) panelEl.setAttribute('aria-label', `Map showing ${loc.address}, ${loc.suburb}`);
  }

  function buildProductCard(p, id, tech, featured) {
    return `<div class="tx-product-card${featured ? ' tx-product-card--featured' : ''}">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
        <h3 style="font-size:var(--text-card-heading);font-weight:700;margin:0">${p.name}</h3>
        <span style="font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;background:#EBF4FF;color:var(--color-blue);border-radius:4px;padding:3px 8px">${tech}</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div>
          <p style="font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--color-text-muted);margin:0 0 4px">Download</p>
          <p style="font-size:28px;font-weight:700;margin:0;color:var(--color-text-body);line-height:1">${p.down_mbps}<span style="font-size:13px;font-weight:500;margin-left:2px">Mbps</span></p>
        </div>
        <div>
          <p style="font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--color-text-muted);margin:0 0 4px">Upload</p>
          <p style="font-size:28px;font-weight:700;margin:0;color:var(--color-text-body);line-height:1">${p.up_mbps}<span style="font-size:13px;font-weight:500;margin-left:2px">Mbps</span></p>
        </div>
      </div>
      <a href="/details.html?id=${id}&mode=providers&tech=${encodeURIComponent(tech)}&product=${encodeURIComponent(p.product_id)}"
         class="tx-btn tx-btn--full" style="margin-top:4px">Choose this plan</a>
    </div>`;
  }

  try {
    const loc  = await API.getLocation(id);
    const tech = await API.getTechnology(id);

    // Address heading
    document.getElementById('address').textContent = `${loc.address}, ${loc.suburb}`;

    // Connection badge
    const badge = document.getElementById('connection-badge');
    const statusMap = {
      active:   ['Active',           'tx-status tx-status--active'],
      previous: ['Previously served','tx-status tx-status--previous'],
      never:    ['Not yet connected','tx-status tx-status--never'],
    };
    const [label, cls] = statusMap[loc.connection_status] || ['Unknown', 'tx-status'];
    badge.textContent = label;
    badge.className   = cls;

    // Status description
    const copyMap = {
      active:   `This address has an active connection on ${tech.technology}. View your subscriber detail or check available plans.`,
      previous: `This address previously had broadband service. You can browse available plans to reconnect.`,
      never:    `This address has not previously been connected. Browse available plans to get started.`,
    };
    document.getElementById('status-copy').textContent = copyMap[loc.connection_status] || '';

    loading.hidden = true;
    pageContent.hidden = false;

    if (loc.connection_status === 'active') {
      document.getElementById('active-section').hidden = false;

      // Map panel
      populateMap(
        document.getElementById('map-label'),
        document.getElementById('map-coords'),
        document.getElementById('map-panel'),
        loc
      );

      const sub = await API.getSubscriber(id);
      const net = await API.getNetwork(id);
      const svc = await API.getService(id);

      // Stat cards
      document.getElementById('stat-tech').textContent = tech.technology;
      document.getElementById('stat-down').textContent = `${net.sync_down_mbps} Mbps`;
      document.getElementById('stat-up').textContent   = `${net.sync_up_mbps} Mbps`;
      document.getElementById('stat-plan').textContent = sub.current_product_name;
      setRag(document.getElementById('stat-signal'), net.network_status);

      // Action links
      document.getElementById('view-detail-btn').href =
        `/details.html?id=${id}&mode=details`;
      document.getElementById('view-plans-btn').href = '/';

      // Network health
      setRag(document.getElementById('net-rag'), net.network_status);
      document.getElementById('net-down').textContent    = `${net.sync_down_mbps} Mbps`;
      document.getElementById('net-up').textContent      = `${net.sync_up_mbps} Mbps`;
      document.getElementById('net-latency').textContent = `${net.latency_ms} ms`;
      document.getElementById('net-outage').textContent  = fmtDate(net.last_outage);

      // Service health
      setRag(document.getElementById('svc-rag'), svc.service_health);
      document.getElementById('svc-tickets').textContent = svc.open_tickets;
      document.getElementById('svc-appt').textContent    = fmtDate(svc.last_appointment);

      // Upgrade card
      if (sub.upgrade_eligible) {
        document.getElementById('upgrade-on').hidden = false;
        document.getElementById('upgrade-link').href =
          `/details.html?id=${id}&mode=providers&tech=${encodeURIComponent(tech.technology)}&product=${encodeURIComponent(sub.current_product_id)}`;
      } else {
        document.getElementById('upgrade-off').hidden = false;
      }

    } else {
      document.getElementById('nonactive-section').hidden = false;

      // Map panel (non-active)
      populateMap(
        document.getElementById('map-label-na'),
        document.getElementById('map-coords-na'),
        document.getElementById('map-panel-na'),
        loc
      );

      document.getElementById('na-tech').textContent  = tech.technology;
      document.getElementById('na-speed').textContent = `Up to ${tech.max_speed_mbps} Mbps`;

      const products = await API.getProducts(tech.technology);
      const grid = document.getElementById('plans-grid');
      grid.innerHTML = products.map((p, i) =>
        buildProductCard(p, id, tech.technology, i === 0)
      ).join('');
    }

  } catch (e) {
    if (e.message === 'not_found') showError('Address not found. Please go back and search again.');
    else showError('Something went wrong loading this address. Please try again.');
  }
})();
