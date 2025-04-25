{
  const style = document.createElement("style");
  style.textContent = `
  ytd-rich-item-renderer[rendered-from-rich-grid],
  .ghost-card.style-scope.ytd-ghost-grid-renderer{
  width: 18% !important;
  }
  ytd-rich-item-renderer[is-slim-media]{
  width: 11% !important;
  }
  `;
  
  document.body.after(style);
}
