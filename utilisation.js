// COB Utilisation Report — renders utilisation-data.js into utilisation(-bm).html
(function () {
  const data = window.COB_UTILISATION;
  const root = document.getElementById('urApp');
  if (!data || !root) return;

  const lang = document.documentElement.lang === 'ms' ? 'ms' : 'en';

  const T = {
    en: {
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      monthsLong: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      active: 'Active members',
      used: 'Members who used COB',
      rate: 'of active members',
      visits: 'Clinic visits',
      visitsPer: 'visits per member who used COB',
      tele: 'Telemedicine / pharmacy',
      teleSub: 'episodes used via telemedicine',
      partial: 'Partial month — COB started on 7 June',
      visitsUnit: 'visits',
      usedUnit: 'members used COB',
      unrecorded: (n) => `${n} visit${n > 1 ? 's' : ''} had no state recorded.`,
      pctOfVisits: 'of visits',
      download: (name) => `Download ${name} report (PDF)`
    },
    ms: {
      months: ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogo', 'Sep', 'Okt', 'Nov', 'Dis'],
      monthsLong: ['Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun', 'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'],
      active: 'Ahli aktif',
      used: 'Ahli yang menggunakan COB',
      rate: 'daripada ahli aktif',
      visits: 'Lawatan klinik',
      visitsPer: 'lawatan bagi setiap ahli yang menggunakan COB',
      tele: 'Teleperubatan / farmasi',
      teleSub: 'episod digunakan melalui teleperubatan',
      partial: 'Bulan separa — COB bermula pada 7 Jun',
      visitsUnit: 'lawatan',
      usedUnit: 'ahli menggunakan COB',
      unrecorded: (n) => `${n} lawatan tidak mempunyai rekod negeri.`,
      pctOfVisits: 'daripada lawatan',
      download: (name) => `Muat turun laporan ${name} (PDF)`
    }
  }[lang];

  const REASON_LABELS = {
    cold:      { en: 'Coughs, colds & sore throats', ms: 'Batuk, selesema & sakit tekak' },
    sinus:     { en: 'Sinus infections', ms: 'Jangkitan sinus' },
    stomach:   { en: 'Stomach bugs & food poisoning', ms: 'Jangkitan perut & keracunan makanan' },
    gastritis: { en: 'Gastritis & indigestion', ms: 'Gastritis & masalah penghadaman' },
    chest:     { en: 'Chest infections & bronchitis', ms: 'Jangkitan dada & bronkitis' },
    sprain:    { en: 'Aches, sprains & strains', ms: 'Sakit, terseliuh & terkehel' },
    skin:      { en: 'Skin infections & rashes', ms: 'Jangkitan kulit & ruam' },
    ear:       { en: 'Ear problems', ms: 'Masalah telinga' },
    flu:       { en: 'Flu', ms: 'Influenza' },
    other:     { en: 'Other reasons', ms: 'Sebab lain' }
  };

  const fmt = (n) => n.toLocaleString('en-MY');
  const pct = (a, b, dp = 1) => (b ? (a / b * 100).toFixed(dp) : '0') + '%';
  const monthIdx = (m) => parseInt(m.id.slice(5), 10) - 1;
  const shortName = (m) => T.months[monthIdx(m)];
  const longName = (m) => `${T.monthsLong[monthIdx(m)]} ${m.id.slice(0, 4)}`;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const months = data.months;
  let current = months.length - 1;

  // ---------- Month dropdown (newest first) ----------
  const picker = document.getElementById('urMonths');
  picker.innerHTML = months.map((m, i) => ({ m, i })).reverse().map(({ m, i }) =>
    `<option value="${i}">${esc(longName(m))}</option>`
  ).join('');
  picker.addEventListener('change', () => {
    current = +picker.value;
    render();
  });

  // ---------- Since-launch totals ----------
  const totalVisits = months.reduce((s, m) => s + m.visits, 0);
  document.getElementById('urSince').textContent = fmt(totalVisits);

  // ---------- Horizontal bar list ----------
  function barList(rows, total) {
    const max = Math.max(...rows.map((r) => r.value));
    return rows.map((r) => `
      <li class="ur-bar${r.muted ? ' ur-bar--muted' : ''}" tabindex="0" data-tip="${esc(r.label)}: ${fmt(r.value)} ${T.visitsUnit} (${pct(r.value, total)} ${T.pctOfVisits})">
        <span class="ur-bar__label">${esc(r.label)}</span>
        <span class="ur-bar__track"><span class="ur-bar__fill" style="width:${(r.value / max * 100).toFixed(1)}%"></span></span>
        <span class="ur-bar__value">${fmt(r.value)} <em>${pct(r.value, total)}</em></span>
      </li>`).join('');
  }

  // ---------- Trend column chart (visits per month) ----------
  function renderTrend() {
    const max = Math.max(...months.map((m) => m.visits));
    document.getElementById('urTrend').innerHTML = months.map((m, i) => `
      <button type="button" class="ur-col${i === current ? ' is-active' : ''}" data-i="${i}"
        data-tip="${esc(longName(m))}: ${fmt(m.visits)} ${T.visitsUnit} · ${fmt(m.membersUsed)} ${T.usedUnit} (${pct(m.membersUsed, m.activeMembers)})">
        <span class="ur-col__value">${fmt(m.visits)}</span>
        <span class="ur-col__bar" style="height:${(m.visits / max * 100).toFixed(1)}%"></span>
        <span class="ur-col__label">${esc(shortName(m))}${m.partial ? '*' : ''}</span>
      </button>`).join('');
  }
  document.getElementById('urTrend').addEventListener('click', (e) => {
    const b = e.target.closest('.ur-col');
    if (!b) return;
    current = +b.dataset.i;
    render();
  });

  function render() {
    const m = months[current];

    picker.value = String(current);
    document.getElementById('urTitleMonth').textContent = longName(m);

    document.getElementById('urPeriod').textContent = m.period[lang];
    const partialEl = document.getElementById('urPartial');
    partialEl.hidden = !m.partial;
    partialEl.textContent = m.partial ? T.partial : '';

    const dl = document.getElementById('urDownload');
    dl.hidden = !m.report;
    if (m.report) {
      dl.href = m.report;
      dl.setAttribute('download', m.report.split('/').pop());
      document.getElementById('urDownloadLabel').textContent = T.download(longName(m));
    }

    document.getElementById('urStats').innerHTML = `
      <article class="ur-stat">
        <span class="ur-stat__label">${T.active}</span>
        <strong class="ur-stat__num">${fmt(m.activeMembers)}</strong>
      </article>
      <article class="ur-stat ur-stat--hero">
        <span class="ur-stat__label">${T.used}</span>
        <strong class="ur-stat__num">${fmt(m.membersUsed)}</strong>
        <span class="ur-stat__sub">${pct(m.membersUsed, m.activeMembers)} ${T.rate}</span>
      </article>
      <article class="ur-stat">
        <span class="ur-stat__label">${T.visits}</span>
        <strong class="ur-stat__num">${fmt(m.visits)}</strong>
        <span class="ur-stat__sub">${m.membersUsed ? (m.visits / m.membersUsed).toFixed(2) : '0'} ${T.visitsPer}</span>
      </article>
      <article class="ur-stat">
        <span class="ur-stat__label">${T.tele}</span>
        <strong class="ur-stat__num">${fmt(m.telemedicine)}</strong>
        <span class="ur-stat__sub">${T.teleSub}</span>
      </article>`;

    // Reasons — sorted high to low, "other" always last
    const reasonRows = Object.entries(m.reasons)
      .filter(([k]) => k !== 'other')
      .map(([k, v]) => ({ label: REASON_LABELS[k] ? REASON_LABELS[k][lang] : k, value: v }))
      .sort((a, b) => b.value - a.value);
    if (m.reasons.other) reasonRows.push({ label: REASON_LABELS.other[lang], value: m.reasons.other, muted: true });
    document.getElementById('urReasons').innerHTML = barList(reasonRows, m.visits);
    document.getElementById('urReasonsMonth').textContent = longName(m);

    // States
    const stateRows = Object.entries(m.states)
      .map(([k, v]) => ({ label: k, value: v }))
      .sort((a, b) => b.value - a.value);
    document.getElementById('urStates').innerHTML = barList(stateRows, m.visits);
    document.getElementById('urStatesMonth').textContent = longName(m);
    const un = document.getElementById('urStatesNote');
    un.hidden = !m.statesUnrecorded;
    un.textContent = m.statesUnrecorded ? T.unrecorded(m.statesUnrecorded) : '';

    renderTrend();
  }

  // ---------- Hover / focus tooltip ----------
  const tip = document.createElement('div');
  tip.className = 'ur-tip';
  tip.setAttribute('role', 'tooltip');
  tip.hidden = true;
  document.body.appendChild(tip);

  function showTip(el) {
    tip.textContent = el.dataset.tip;
    tip.hidden = false;
    const r = el.getBoundingClientRect();
    const tw = tip.offsetWidth;
    const left = Math.min(Math.max(8, r.left + r.width / 2 - tw / 2), window.innerWidth - tw - 8);
    tip.style.left = left + 'px';
    tip.style.top = (r.top + window.scrollY - tip.offsetHeight - 8) + 'px';
  }
  const hideTip = () => { tip.hidden = true; };
  root.addEventListener('mouseover', (e) => { const el = e.target.closest('[data-tip]'); if (el) showTip(el); });
  root.addEventListener('mouseout', (e) => { if (e.target.closest('[data-tip]')) hideTip(); });
  root.addEventListener('focusin', (e) => { const el = e.target.closest('[data-tip]'); if (el) showTip(el); });
  root.addEventListener('focusout', hideTip);
  window.addEventListener('scroll', hideTip, { passive: true });

  render();
})();
