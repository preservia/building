// Phase 1 loader: fetches fonts.json and populates Original and Community grids.
// No search/filter/modal implemented yet.

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("fonts.json");
    if (!res.ok) throw new Error("fonts.json failed to load");
    const fonts = await res.json();

    const originalGrid = document.getElementById("original-grid");
    const communityGrid = document.getElementById("community-grid");

    originalGrid.innerHTML = "";
    communityGrid.innerHTML = "";

    fonts.forEach(f => {
      const card = document.createElement("div");
      card.className = "font-card";
      card.setAttribute("data-name", f.name);

      const img = document.createElement("img");
      img.className = "preview";
      img.src = `assets/fonts/previews/${f.name}.png`;
      img.alt = f.displayName + " preview";
      img.onerror = () => {
        img.src = "assets/fonts/previews/placeholder.png";
      };
      card.appendChild(img);

      const nameEl = document.createElement("div");
      nameEl.className = "font-name";
      nameEl.textContent = f.displayName;
      card.appendChild(nameEl);

      if (f.type === "community" && f.creator) {
        const c = document.createElement("div");
        c.className = "creator";
        c.textContent = `by ${f.creator}`;
        card.appendChild(c);
      }

      if (f.type === "original") originalGrid.appendChild(card);
      else communityGrid.appendChild(card);
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
