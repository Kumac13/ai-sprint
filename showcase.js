(function() {
  const grid = document.getElementById('showcase-grid');
  const countEl = document.querySelector('.challenge-count');

  // Cache manifest to avoid repeated fetches
  let manifestCache = null;

  // Track rendered iframes for virtual scrolling
  const renderedIframes = new Set();
  const MAX_RENDERED_IFRAMES = 20;

  // Intersection Observer for lazy loading
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const iframe = entry.target.querySelector('iframe');

      if (entry.isIntersecting && iframe && iframe.src === 'about:blank') {
        // Load iframe when entering viewport
        iframe.src = iframe.dataset.src;
        renderedIframes.add(iframe);

        // Add error handling for iframe
        iframe.addEventListener('error', () => {
          console.error(`Failed to load iframe: ${iframe.dataset.src}`);
          const container = iframe.closest('.iframe-container');
          if (container) {
            container.innerHTML = `
              <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #9ca3af; text-align: center; padding: 2rem;">
                <div>
                  <p>Failed to load challenge</p>
                  <p style="font-size: 0.875rem; margin-top: 0.5rem;">
                    <a href="${iframe.dataset.src}" style="color: var(--accent);">Open in new tab →</a>
                  </p>
                </div>
              </div>
            `;
          }
        }, { once: true });
      } else if (!entry.isIntersecting && renderedIframes.size > MAX_RENDERED_IFRAMES) {
        // Unload iframe if too many are rendered and it's far from viewport
        if (iframe && iframe.src !== 'about:blank') {
          iframe.src = 'about:blank';
          renderedIframes.delete(iframe);
        }
      }
    });
  }, {
    rootMargin: '100px' // Start loading 100px before entering viewport
  });

  // Load and render challenges with retry logic
  async function loadChallenges(retryCount = 0) {
    try {
      // Use cache if available
      if (manifestCache) {
        renderChallenges(manifestCache);
        return;
      }

      const response = await fetch('manifest.json', {
        cache: 'default' // Use browser cache
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const manifest = await response.json();
      manifestCache = manifest; // Cache for future use

      renderChallenges(manifest);

    } catch (error) {
      console.error('Failed to load manifest:', error);

      // Retry logic (max 3 attempts)
      if (retryCount < 2) {
        console.log(`Retrying... (attempt ${retryCount + 2}/3)`);
        setTimeout(() => loadChallenges(retryCount + 1), 1000 * (retryCount + 1));
      } else {
        showError(error);
      }
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
      observer.observe(card);
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
      </div>

      <div class="iframe-container">
        <iframe
          data-src="${day.url}"
          src="about:blank"
          loading="lazy"
          sandbox="allow-scripts allow-same-origin"
          referrerpolicy="no-referrer"
          title="Day ${day.number} Challenge"
        ></iframe>
      </div>

      <a href="${day.url}" class="view-full">View Full Page →</a>
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
