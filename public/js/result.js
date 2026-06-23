// Page 2 — Address result. Branches on connection_status: active vs previous/never.
(async () => {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  if (!id) { location.replace('/'); return; }

  const loading = document.getElementById('loading');
  const pageContent = document.getElementById('page-content');
  const pageError = document.getElementById('page-error');
  const pageErrorMsg = document.getElementById('page-error-msg');

  function showError(msg) {
    loading.hidden = true;
    pageError.hidden = false;
    pageErrorMsg.textContent = msg;
  }

  function ragClass(status) {
    return `tx-rag tx-rag--${status}`;
  }

  function ragLabel(status) {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  function setRag(el, status) {
    el.className = ragClass(status);
    el.textContent = ragLabel(status);
  }

  try {
    const loc = await API.getLocation(id);
    const tech = await API.getTechnology(id);

    // Address heading
    document.getElementById('address').textContent = loc.address;
    document.getElementById('suburb-line').textContent = `${loc.suburb} ${loc.state} ${loc.postcode}`;

    // Connection badge
    const badge = document.getElementById('connection-badge');
    const statusMap = { active: ['Active subscriber', 'tx-badge tx-badge--active'], previous: ['Previously connected', 'tx-badge tx-badge--previous'], never: ['Never connected', 'tx-badge tx-badge--never'] };
    const [label, cls] = statusMap[loc.connection_status] || ['Unknown', 'tx-badge'];
    badge.textContent = label;
    badge.className = cls;

    // Map pin
    const mapPanel = document.getElementById('map-panel');
    mapPanel.setAttribute('aria-label', `Map pin for ${loc.address}, ${loc.suburb} — coordinates ${loc.latitude}, ${loc.longitude}`);
    document.getElementById('map-address').textContent = `${loc.address}, ${loc.suburb} ${loc.state} ${loc.postcode}`;
    document.getElementById('map-coords').textContent = `${loc.latitude}, ${loc.longitude}`;

    loading.hidden = true;
    pageContent.hidden = false;

    if (loc.connection_status === 'active') {
      document.getElementById('active-section').hidden = false;

      // Technology
      document.getElementById('tech-type').textContent = tech.technology;
      document.getElementById('tech-speed').textContent = `${tech.max_speed_mbps} Mbps`;

      // Subscriber
      const sub = await API.getSubscriber(id);
      document.getElementById('sub-product').textContent = sub.current_product_name;
      document.getElementById('sub-connected').textContent = new Date(sub.connected_since).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
      document.getElementById('sub-account').textContent = sub.account_ref;
      document.getElementById('sub-detail-link').href = `/details.html?id=${id}&mode=details`;

      // Upgrade card — AC-07/AC-08
      if (sub.upgrade_eligible) {
        const upgradeCard = document.getElementById('upgrade-card');
        upgradeCard.hidden = false;
        document.getElementById('upgrade-link').href = `/details.html?id=${id}&mode=providers&tech=${encodeURIComponent(tech.technology)}&product=${encodeURIComponent(sub.current_product_id)}`;
      } else {
        document.getElementById('upgrade-card-disabled').hidden = false;
      }

      // Network health
      const net = await API.getNetwork(id);
      setRag(document.getElementById('net-rag'), net.network_status);
      document.getElementById('net-down').textContent = `${net.sync_down_mbps} Mbps`;
      document.getElementById('net-up').textContent = `${net.sync_up_mbps} Mbps`;
      document.getElementById('net-latency').textContent = `${net.latency_ms} ms`;
      document.getElementById('net-outage').textContent = net.last_outage ? new Date(net.last_outage).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }) : 'None recorded';

      // Service health
      const svc = await API.getService(id);
      setRag(document.getElementById('svc-rag'), svc.service_health);
      document.getElementById('svc-tickets').textContent = svc.open_tickets;
      document.getElementById('svc-appt').textContent = svc.last_appointment ? new Date(svc.last_appointment).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }) : 'None';

    } else {
      // Non-active: show products only — no Tools 4/5/6
      document.getElementById('nonactive-section').hidden = false;
      document.getElementById('na-tech-type').textContent = tech.technology;
      document.getElementById('na-tech-speed').textContent = `${tech.max_speed_mbps} Mbps`;

      const products = await API.getProducts(tech.technology);
      const grid = document.getElementById('products-grid');
      grid.innerHTML = products.map(p => `
        <div class="tx-product-card">
          <h3>${p.name}</h3>
          <div class="speeds">${p.down_mbps}↓ / ${p.up_mbps}↑ Mbps</div>
          <a href="/details.html?id=${id}&mode=providers&tech=${encodeURIComponent(tech.technology)}&product=${encodeURIComponent(p.product_id)}"
             class="tx-btn" style="width:100%">Choose plan</a>
        </div>`).join('');
    }

  } catch (e) {
    if (e.message === 'not_found') showError('Address not found. Please go back and search again.');
    else showError('Something went wrong loading this address. Please try again.');
  }
})();
