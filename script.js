document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("fonts.json");
    const fonts = await response.json();

    const originalGrid = document.getElementById("original-grid");
    const communityGrid = document.getElementById("community-grid");

    fonts.forEach(font => {
      const card = document.createElement("div");
      card.className = "font-card";

      const img = document.createElement("img");
      img.src = `assets/fonts/previews/${font.name}.png`;
      img.alt = font.displayName;

      card.appendChild(img);

      // Add creator label if community font
      if (font.type === "community" && font.creator) {
        const creatorLabel = document.createElement("div");
        creatorLabel.className = "creator";
        creatorLabel.textContent = `by ${font.creator}`;
        card.appendChild(creatorLabel);
      }

      if (font.type === "original") {
        originalGrid.appendChild(card);
      } else if (font.type === "community") {
        communityGrid.appendChild(card);
      }
    });
  } catch (err) {
    console.error("Failed to load fonts.json:", err);
  }
});
