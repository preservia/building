// Phase 1 loader: fetches fonts.json and populates Original and Community grids.
// No search/filter/modal implemented yet.

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("fonts.json");
    if (!res.ok) throw new Error("fonts.json failed to load");
    const fonts = await res.json();

    const originalGrid = document.getElementById("original-grid");
    const communityGrid = document.getElementById("community-grid");

    // Clear any existing content
    originalGrid.innerHTML = "";
    communityGrid.innerHTML = "";

    fonts.forEach((font) => {
      // Create the card container
      const card = document.createElement("div");
      card.className = "font-card";
      card.setAttribute("data-name", font.name);

      // Font preview image
      const img = document.createElement("img");
      img.className = "preview";
      img.src = `assets/fonts/previews/${font.name}.png`;
      img.alt = `${font.displayName} preview`;
      img.onerror = () => {
        img.src = "assets/fonts/previews/placeholder.png";
      };
      card.appendChild(img);

      // Only show creator for community fonts
      if (font.type === "community" && font.creator) {
        const creator = document.createElement("div");
        creator.className = "creator";
        creator.textContent = `by ${font.creator}`;
        card.appendChild(creator);
      }

      // Append to the proper grid
      if (font.type === "original") {
        originalGrid.appendChild(card);
      } else if (font.type === "community") {
        communityGrid.appendChild(card);
      }
    });
  } catch (err) {
    console.error("Error loading fonts.json:", err);

    const main = document.querySelector("main");
    const errEl = document.createElement("div");
    errEl.style.color = "#900";
    errEl.style.textAlign = "center";
    errEl.style.marginTop = "18px";
    errEl.textContent = "Failed to load fonts.json — check console for details.";
    main.appendChild(errEl);
  }
});
