(function() {
  const grid = document.getElementById('showcase-grid');
  const countEl = document.querySelector('.challenge-count');

  // Load and render challenges
  async function loadChallenges() {
    try {
      const response = await fetch('manifest.json');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const manifest = await response.json();
      renderChallenges(manifest);

    } catch (error) {
      console.error('Failed to load manifest:', error);
      showError(error);
    }
  }

  function renderChallenges(manifest) {
    // Update count
    countEl.textContent = `${manifest.total} challenge${manifest.total !== 1 ? 's' : ''} completed`;

    if (manifest.total === 0) {
      showEmptyState();
      return;
    }

    // Render challenges (newest first - reverse the array)
    const challenges = [...manifest.days].reverse();

    challenges.forEach((day, index) => {
      const isLatest = index === 0; // First card is the latest
      const card = createChallengeCard(day, isLatest);
      grid.appendChild(card);
    });
  }

  function createChallengeCard(day, isLatest = false) {
    const card = document.createElement('article');
    card.className = isLatest ? 'challenge-card latest' : 'challenge-card';
    card.dataset.day = day.number;

    const date = day.created
      ? new Date(day.created).toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : '';

    const latestBadge = isLatest ? '<span class="latest-badge">Latest</span>' : '';

    card.innerHTML = `
      <div class="challenge-header">
        <h2>Day ${day.number}: ${escapeHtml(day.title)}${latestBadge}</h2>
        ${day.theme ? `<p class="challenge-theme">テーマ: ${escapeHtml(day.theme)}</p>` : ''}
        ${date ? `<time class="challenge-date" datetime="${day.created}">${date}</time>` : ''}
        <a href="${day.url}" class="view-link">View Challenge →</a>
      </div>
    `;

    return card;
  }

  function showEmptyState() {
    grid.innerHTML = `
      <div class="empty-state">
        <h3>No challenges yet</h3>
        <p>Create your first challenge in a day1/ folder!</p>
      </div>
    `;
    countEl.textContent = '0 challenges';
  }

  function showError(error) {
    grid.innerHTML = `
      <div class="empty-state">
        <h3>Failed to load challenges</h3>
        <p>${escapeHtml(error.message)}</p>
        <p>Make sure manifest.json exists and is valid.</p>
      </div>
    `;
    countEl.textContent = 'Error loading challenges';
  }

  // Escape HTML to prevent XSS
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Initialize
  loadChallenges();
})();
