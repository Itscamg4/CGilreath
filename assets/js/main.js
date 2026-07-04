// ── Mobile nav toggle ─────────────────────────────
const navToggle = document.querySelector('.nav-toggle');
const navMobilePanel = document.querySelector('.nav-mobile-panel');
if (navToggle && navMobilePanel) {
  navToggle.addEventListener('click', () => {
    navMobilePanel.classList.toggle('open');
  });
  navMobilePanel.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navMobilePanel.classList.remove('open'));
  });
}

// ── Project card click-through ─────────────────────
document.querySelectorAll('.proj-card[data-href]').forEach(card => {
  card.addEventListener('click', (e) => {
    if (e.target.closest('a')) return;
    window.location.href = card.dataset.href;
  });
});

// ── Scroll reveal ──────────────────────────────────
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('vis');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('[data-reveal]').forEach(el => revealObs.observe(el));

// ── Terminal typing effect (home hero) ─────────────
const termBody = document.querySelector('[data-terminal]');
if (termBody) {
  const lines = JSON.parse(termBody.getAttribute('data-terminal'));
  termBody.innerHTML = '';
  let li = 0;

  function typeLine() {
    if (li >= lines.length) return;
    const { prompt, text, comment } = lines[li];
    const row = document.createElement('div');
    row.className = 'terminal-line';
    const promptSpan = document.createElement('span');
    promptSpan.className = 'prompt';
    promptSpan.textContent = prompt || '';
    const textSpan = document.createElement('span');
    row.appendChild(promptSpan);
    row.appendChild(textSpan);
    termBody.appendChild(row);

    let ci = 0;
    const full = text || '';
    const speed = 18;
    (function typeChar() {
      if (ci <= full.length) {
        textSpan.textContent = full.slice(0, ci);
        ci++;
        setTimeout(typeChar, speed);
      } else {
        if (comment) {
          const cs = document.createElement('span');
          cs.className = 'comment';
          cs.textContent = '  ' + comment;
          row.appendChild(cs);
        }
        li++;
        setTimeout(typeLine, 260);
      }
    })();
  }

  const cursorRow = document.createElement('div');
  cursorRow.className = 'terminal-line';
  cursorRow.innerHTML = '<span class="term-cursor"></span>';

  function finish() {
    termBody.appendChild(cursorRow);
  }

  const originalPush = lines.length;
  const runner = () => {
    typeLine();
    setTimeout(finish, originalPush * 1400 + 500);
  };
  runner();
}
