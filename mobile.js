(() => {
  const setViewportHeight = () => {
    document.documentElement.style.setProperty('--app-vh', String(window.innerHeight * 0.01) + 'px');
  };
  setViewportHeight();
  window.addEventListener('resize', setViewportHeight, { passive: true });
  window.addEventListener('orientationchange', () => setTimeout(setViewportHeight, 250), { passive: true });
  document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('mobile-ready');
    const modal = document.querySelector('#card-modal');
    if (!modal) return;
    modal.addEventListener('click', (event) => {
      if (event.target !== modal) return;
      const doneButton = modal.querySelector('#event-done-btn');
      if (doneButton) doneButton.focus();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape' || modal.classList.contains('hidden')) return;
      const doneButton = modal.querySelector('#event-done-btn');
      if (doneButton) doneButton.focus();
    });
  });
})();
