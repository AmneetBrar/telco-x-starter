// Modem Placement Assistant — mock rule-based tip logic.
(() => {
  const MODEM_TIPS = {
    floor:    'Raise the modem onto a table or shelf — placing it on the floor limits signal spread significantly.',
    cupboard: 'Move the modem out into an open area. Cupboards and enclosed spaces can reduce Wi-Fi range by up to 50%.',
    kitchen:  'Keep the modem away from microwaves, large appliances, and metal surfaces as these cause interference.',
    window:   'Move the modem closer to the centre of the home if possible — external walls and glass can weaken signal.',
    central:  'Current placement looks reasonable. Focus on height and clearing nearby obstructions.',
  };

  const FLOOR_TIPS = {
    apartment:   'Place the modem close to the middle of the apartment, away from bathrooms and utility rooms.',
    small_house: 'A central hallway or living area will usually provide the best whole-home coverage.',
    large_house: 'Consider a mesh Wi-Fi extender if bedrooms or areas at the far end of the home have weak signal.',
    two_storey:  'Place the modem near the centre of the level where internet is used most, ideally with line-of-sight to both floors.',
    narrow:      'Avoid placing the modem at one far end of the home — a mid-point position will serve both ends better.',
  };

  const UNIVERSAL_TIPS = [
    'Keep the modem out in the open, not behind large furniture or inside entertainment units.',
    'Keep the modem away from thick brick walls, metal cabinets, and large appliances.',
    'Avoid stacking the modem under other devices — leave airflow space around it.',
    'Point modem antennas (if present) vertically for better horizontal coverage across a single level.',
  ];

  function fmtSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function wireUpload(inputId, previewId, thumbId, nameId, sizeId) {
    const input   = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    const thumb   = document.getElementById(thumbId);
    const nameEl  = document.getElementById(nameId);
    const sizeEl  = document.getElementById(sizeId);

    input.addEventListener('change', () => {
      const file = input.files[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      thumb.src = url;
      nameEl.textContent = file.name;
      sizeEl.textContent = fmtSize(file.size);
      preview.classList.add('has-file');
    });
  }

  wireUpload('modem-file', 'modem-preview', 'modem-thumb', 'modem-name', 'modem-size');
  wireUpload('floor-file',  'floor-preview',  'floor-thumb',  'floor-name',  'floor-size');

  function buildTips(modemCond, floorType) {
    const tips = [];

    // Modem condition tip (specific)
    if (modemCond && MODEM_TIPS[modemCond]) tips.push(MODEM_TIPS[modemCond]);

    // Floorplan tip (specific)
    if (floorType && FLOOR_TIPS[floorType]) tips.push(FLOOR_TIPS[floorType]);

    // Fill from universal pool until we have 4–5 tips total
    for (const t of UNIVERSAL_TIPS) {
      if (tips.length >= 5) break;
      tips.push(t);
    }

    // Confidence: high if both inputs given, medium if one, low if neither
    const filled = [modemCond, floorType].filter(Boolean).length;
    const confidence = filled === 2 ? 'High' : filled === 1 ? 'Medium' : 'Low';

    return { tips, confidence };
  }

  document.getElementById('get-tips-btn').addEventListener('click', () => {
    const modemCond = document.getElementById('modem-condition').value;
    const floorType = document.getElementById('floor-type').value;
    const errEl     = document.getElementById('form-error');

    if (!modemCond && !floorType) {
      errEl.hidden = false;
      errEl.textContent = 'Please select at least one option to generate placement tips.';
      return;
    }
    errEl.hidden = true;

    // Show loading
    document.getElementById('upload-form').hidden   = true;
    document.getElementById('wifi-loading').hidden  = false;
    document.getElementById('wifi-results').hidden  = true;

    // Simulate analysis delay
    setTimeout(() => {
      const { tips, confidence } = buildTips(modemCond, floorType);

      document.getElementById('tips-list').innerHTML = tips.map((t, i) => `
        <div class="tip-item">
          <div class="tip-number">${i + 1}</div>
          <p class="tip-text">${t}</p>
        </div>`).join('');

      document.getElementById('confidence-badge').textContent = confidence;

      document.getElementById('wifi-loading').hidden = true;
      document.getElementById('wifi-results').hidden = false;
    }, 1800);
  });

  document.getElementById('try-again-btn').addEventListener('click', () => {
    document.getElementById('wifi-results').hidden  = true;
    document.getElementById('upload-form').hidden   = false;
    // Reset selects
    document.getElementById('modem-condition').value = '';
    document.getElementById('floor-type').value      = '';
    // Reset previews
    ['modem', 'floor'].forEach(k => {
      document.getElementById(`${k}-preview`).classList.remove('has-file');
      document.getElementById(`${k}-thumb`).src = '';
      document.getElementById(`${k}-file`).value = '';
    });
  });
})();
