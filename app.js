(() => {
  const $ = (id) => document.getElementById(id);
  const namesInput = $('names');
  const sizeInput = $('group-size');
  const count = $('name-count');
  const validation = $('validation');
  const visual = $('visual-result');
  const text = $('text-result');
  const shuffleButton = $('shuffle');
  const reshuffleButton = $('reshuffle');
  const pauseButton = $('pause');
  const skipButton = $('skip');
  const copyButton = $('copy');
  const csvButton = $('csv');
  const modeOptions = [...document.querySelectorAll('input[name="mode"]')];

  const modeConfig = {
    festival: {
      titles: ['Mainstage', 'Backstage', 'Green Room', 'Crew Area', 'Production', 'Venue Team'],
      icons: ['🎤', '🥁', '🎸', '🎹', '🎧', '🎚️'],
      intro: 'De festival-line-up wordt opgebouwd.'
    },
    draft: {
      titles: ['Team Rood', 'Team Blauw', 'Team Groen', 'Team Geel', 'Team Paars', 'Team Oranje'],
      icons: ['🟥', '🟦', '🟩', '🟨', '🟪', '🟧'],
      intro: 'De teams worden samengesteld.'
    }
  };

  let currentGroups = [];
  let activeMode = 'festival';
  let animationState = 'running';

  function readNames() {
    const raw = namesInput.value.split(/[\n,;]+/).map((name) => name.trim()).filter(Boolean);
    const seen = new Set();
    const duplicates = [];
    const names = raw.filter((name) => {
      const key = name.toLocaleLowerCase();
      if (seen.has(key)) {
        duplicates.push(name);
        return false;
      }
      seen.add(key);
      return true;
    });

    count.textContent = names.length + (names.length === 1 ? ' naam' : ' namen');
    validation.textContent = duplicates.length
      ? 'Dubbele naam overgeslagen: ' + duplicates.join(', ') + '.'
      : names.length
        ? 'Klaar om in te delen.'
        : 'Tip: plak hier direct een namenlijst uit Teams of Excel.';
    return names;
  }

  function invalidateResult() {
    currentGroups = [];
    animationState = 'running';
    text.textContent = 'Nog geen indeling gemaakt.';
    visual.className = 'visual-result';
    visual.innerHTML = '<div class="empty-state"><span class="empty-icon" aria-hidden="true">↘</span><p>Je groepen verschijnen hier als je op <strong>Indelen</strong> klikt.</p></div>';
    [reshuffleButton, pauseButton, skipButton, copyButton, csvButton].forEach((button) => {
      button.disabled = true;
    });
  }

  function shuffle(list) {
    const result = [...list];
    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function makeGroups(names, maxSize) {
    const shuffled = shuffle(names);
    const groupCount = Math.ceil(shuffled.length / maxSize);
    const groups = Array.from({ length: groupCount }, () => []);
    shuffled.forEach((name, index) => groups[index % groupCount].push(name));
    return groups;
  }

  function textFor(groups) {
    return groups.map((group, index) =>
      'Groep ' + (index + 1) + ' (' + group.length + '):\n' + group.map((name) => '- ' + name).join('\n')
    ).join('\n\n');
  }

  function escapeHtml(value) {
    return value.replace(/[&<>"']/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    })[character]);
  }

  function renderVisual() {
    const config = modeConfig[activeMode];
    visual.className = 'visual-result mode-' + activeMode;
    if (animationState === 'paused') visual.classList.add('animations-paused');
    if (animationState === 'skipped') visual.classList.add('animations-skipped');

    const animation = activeMode === 'festival'
      ? '<div class="theme-animation festival-animation" aria-label="Festival DJ-animatie"><div class="dj-disc"></div><div class="waveform">' +
        Array.from({ length: 18 }, (_, index) => '<i style="--bar:' + (30 + ((index * 17) % 65)) + '%;--delay:' + (index * 45) + 'ms"></i>').join('') +
        '</div><span class="animation-label">FESTIVAL LINE-UP</span></div>'
      : '<div class="theme-animation draft-animation" aria-label="Team Draft-animatie"><div class="draft-board"><span class="draft-line"></span><span class="draft-card card-one">A</span><span class="draft-card card-two">B</span><span class="draft-card card-three">C</span><span class="draft-slot">TEAM</span></div><span class="animation-label">TEAM DRAFT</span></div>';

    visual.insertAdjacentHTML('beforeend', animation + currentGroups.map((group, index) =>
      '<article class="group-card" style="animation-delay:' + (index * 70) + 'ms"><div class="group-title"><span>' +
      config.titles[index % config.titles.length] + '</span><span aria-hidden="true">' + config.icons[index % config.icons.length] +
      '</span></div>' + group.map((name) => '<div class="member">' + escapeHtml(name) + '</div>').join('') + '</article>'
    ).join(''));
  }

  function start() {
    const names = readNames();
    const maxSize = Number(sizeInput.value);
    if (names.length < 2) {
      validation.textContent = 'Voer minimaal twee verschillende namen in.';
      namesInput.focus();
      return;
    }

    currentGroups = makeGroups(names, maxSize);
    animationState = 'running';
    text.textContent = textFor(currentGroups);
    visual.replaceChildren();
    renderVisual();
    [reshuffleButton, pauseButton, skipButton, copyButton, csvButton].forEach((button) => {
      button.disabled = false;
    });
    pauseButton.textContent = 'Pauzeren';
    validation.textContent = modeConfig[activeMode].intro + ' ' + currentGroups.length +
      ' groepen gemaakt. Grootteverschil tussen groepen: maximaal 1.';
  }

  function copyText() {
    const value = text.textContent;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(value).then(() => {
        validation.textContent = 'Tekst gekopieerd naar het klembord.';
      }).catch(() => {
        validation.textContent = 'Kopiëren lukt niet in deze browser; selecteer de tekst handmatig.';
      });
      return;
    }

    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(text);
    selection.removeAllRanges();
    selection.addRange(range);
    const copied = document.execCommand && document.execCommand('copy');
    selection.removeAllRanges();
    validation.textContent = copied
      ? 'Tekst gekopieerd naar het klembord.'
      : 'Kopiëren lukt niet in deze browser; selecteer de tekst handmatig.';
  }

  function exportCsv() {
    const rows = [['Groep', 'Naam'], ...currentGroups.flatMap((group, index) =>
      group.map((name) => [index + 1, name])
    )];
    const csv = rows.map((row) => row.map((value) =>
      '"' + String(value).replaceAll('"', '""') + '"'
    ).join(';')).join('\r\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'groepsindeling.csv';
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    validation.textContent = 'CSV-export gestart.';
  }

  namesInput.addEventListener('input', () => {
    readNames();
    invalidateResult();
  });
  sizeInput.addEventListener('change', () => {
    invalidateResult();
    validation.textContent = 'Groepsgrootte gewijzigd; maak opnieuw een indeling.';
  });
  shuffleButton.addEventListener('click', start);
  reshuffleButton.addEventListener('click', start);
  copyButton.addEventListener('click', copyText);
  csvButton.addEventListener('click', exportCsv);

  modeOptions.forEach((option) => option.addEventListener('change', (event) => {
    activeMode = event.target.value;
    modeOptions.forEach((input) => input.closest('.mode-option').classList.toggle('selected', input.checked));
    if (currentGroups.length) {
      visual.replaceChildren();
      renderVisual();
    }
  }));

  pauseButton.addEventListener('click', () => {
    if (animationState === 'skipped') return;
    animationState = animationState === 'paused' ? 'running' : 'paused';
    visual.classList.toggle('animations-paused', animationState === 'paused');
    pauseButton.textContent = animationState === 'paused' ? 'Verder' : 'Pauzeren';
  });

  skipButton.addEventListener('click', () => {
    animationState = 'skipped';
    visual.classList.remove('animations-paused');
    visual.classList.add('animations-skipped');
    pauseButton.disabled = true;
    skipButton.disabled = true;
    pauseButton.textContent = 'Animatie gestopt';
    validation.textContent = 'Animatie gestopt; de tekstuele uitkomst blijft beschikbaar.';
  });

  readNames();
  invalidateResult();
})();
