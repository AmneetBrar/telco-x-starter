// Page 3 — two modes: details (active subscriber) and providers (Tool 7 list).
// Back navigation uses history.back() to preserve the address in Page 2's URL.
(async () => {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const mode = params.get('mode');   // 'details' | 'providers'
  const tech = params.get('tech');
  const product = params.get('product');

  document.getElementById('back').addEventListener('click', e => { e.preventDefault(); history.back(); });

  const loading = document.getElementById('loading');
  const pageError = document.getElementById('page-error');
  const pageErrorMsg = document.getElementById('page-error-msg');
  const pageErrorSub = document.getElementById('page-error-sub');

  function showError(heading, sub = '') {
    loading.hidden = true;
    pageError.hidden = false;
    pageErrorMsg.textContent = heading;
    pageErrorSub.textContent = sub;
  }

  function setRag(el, status) {
    el.className = `tx-rag tx-rag--${status}`;
    el.textContent = status.charAt(0).toUpperCase() + status.slice(1);
  }

  function fmtDate(str) {
    return str ? new Date(str).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }) : 'None';
  }

  if (!id || !mode) { location.replace('/'); return; }

  try {
    const loc = await API.getLocation(id);

    if (mode === 'details') {
      // AC-12: active subscriber full detail
      // AC-13: non-active → error state (client-side guard mirrors the 403 from the API)
      document.getElementById('page-title').textContent = `Full subscriber detail`;

      let sub;
      try {
        sub = await API.getSubscriber(id);
      } catch (e) {
        if (e.status === 403 || e.message === 'not_active') {
          showError('Subscriber detail unavailable for this address.', 'Only active subscribers have a detail record. This address has no current service.');
          return;
        }
        throw e;
      }

      const [net, svc, techData] = await Promise.all([API.getNetwork(id), API.getService(id), API.getTechnology(id)]);

      loading.hidden = true;
      document.getElementById('details-section').hidden = false;

      // Summary strip
      const strip = document.getElementById('summary-strip');
      strip.innerHTML = `
        <div><dt>Address</dt><dd>${loc.address}, ${loc.suburb}</dd></div>
        <div><dt>Technology</dt><dd>${techData.technology}</dd></div>
        <div><dt>Status</dt><dd>Active subscriber</dd></div>`;

      // Plan
      document.getElementById('d-product').textContent = sub.current_product_name;
      document.getElementById('d-account').textContent = sub.account_ref;
      document.getElementById('d-connected').textContent = fmtDate(sub.connected_since);
      document.getElementById('d-upgrade').textContent = sub.upgrade_eligible ? 'Yes' : 'No';

      // Network
      setRag(document.getElementById('d-net-rag'), net.network_status);
      document.getElementById('d-net-down').textContent = `${net.sync_down_mbps} Mbps`;
      document.getElementById('d-net-up').textContent = `${net.sync_up_mbps} Mbps`;
      document.getElementById('d-net-latency').textContent = `${net.latency_ms} ms`;
      document.getElementById('d-net-outage').textContent = fmtDate(net.last_outage);

      // Service
      setRag(document.getElementById('d-svc-rag'), svc.service_health);
      document.getElementById('d-svc-tickets').textContent = svc.open_tickets;
      document.getElementById('d-svc-appt').textContent = fmtDate(svc.last_appointment);

    } else if (mode === 'providers') {
      // AC-14/AC-15: provider list filtered by technology from Tool 7 — count + names exact.
      if (!tech) { location.replace('/'); return; }

      document.getElementById('page-title').textContent = 'Choose a provider';
      const [providers, products] = await Promise.all([API.getProviders(tech), API.getProducts(tech)]);

      const selectedProduct = products.find(p => p.product_id === product);

      loading.hidden = true;
      document.getElementById('providers-section').hidden = false;
      document.getElementById('providers-heading').textContent =
        `${providers.length} provider${providers.length !== 1 ? 's' : ''} available on ${tech}${selectedProduct ? ` — ${selectedProduct.name} (${selectedProduct.down_mbps}↓ / ${selectedProduct.up_mbps}↑ Mbps)` : ''}`;

      const list = document.getElementById('providers-list');
      list.innerHTML = providers.map(name => `
        <div class="tx-provider-row">
          <div>
            <div class="tx-provider-name">${name}</div>
            ${selectedProduct ? `<div class="tx-provider-meta">${selectedProduct.name} · ${selectedProduct.down_mbps}↓ / ${selectedProduct.up_mbps}↑ Mbps</div>` : ''}
          </div>
          <button class="tx-btn" style="width:auto" onclick="alert('Sign-up flow coming soon')">Sign up</button>
        </div>`).join('');

    } else {
      showError('Unknown page mode.', 'Please go back and try again.');
    }

  } catch (e) {
    if (e.message === 'not_found') showError('Address not found.', 'Please go back and search again.');
    else showError('Something went wrong.', 'Please try again.');
  }
})();
