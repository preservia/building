// Font Library with Modal Support
document.addEventListener("DOMContentLoaded", async () => {
  // Modal elements
  const backdrop = document.getElementById("backdrop");
  const detailsBox = document.getElementById("detailsBox");
  const closeBtn = document.getElementById("closeBtn");
  const detailIcon = document.getElementById("detailIcon");
  const detailTitle = document.getElementById("detailTitle");
  const detailCreator = document.getElementById("detailCreator");
  const detailType = document.getElementById("detailType");
  const detailDesc = document.getElementById("detailDesc");
  const downloadBtn = document.getElementById("downloadBtn");

  // Modal functions
  function openDetails(font) {
    const screenshotPath = `assets/fonts/screenshots/${font.name}.png`;
    console.log(`Loading screenshot: ${screenshotPath}`); // Debug log
    
    detailIcon.src = screenshotPath;
    detailIcon.alt = `${font.displayName} screenshot`;
    detailIcon.onerror = () => {
      console.log(`Screenshot not found: ${screenshotPath}, falling back to preview`);
      detailIcon.src = `assets/fonts/previews/${font.name}.png`;
      detailIcon.onerror = () => {
        detailIcon.src = "assets/fonts/previews/placeholder.png";
      };
    };
    
    detailTitle.textContent = font.displayName || font.name;
    detailCreator.textContent = font.creator || "Unknown";
    detailType.textContent = font.type === "original" ? "Original" : "Community";
    detailDesc.textContent = `A beautiful font for your Nintendo 3DS. ${font.tags ? `Tags: ${font.tags.join(", ")}` : ""}`;

    downloadBtn.onclick = () => {
      // Download the .cia file
      const fileName = font.file || `${font.name}.cia`;
      const downloadUrl = `fonts/${fileName}`;
      console.log(`Downloading: ${downloadUrl}`);
      
      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    backdrop.classList.add("show");
    document.body.style.overflow = "hidden";
    detailsBox.classList.remove("show", "hide");
    detailsBox.style.opacity = "0";
    detailsBox.style.transform = "scale(0.92)";
    setTimeout(() => detailsBox.classList.add("show"), 350);
  }

  function hideDetails() {
    detailsBox.classList.remove("show");
    detailsBox.classList.add("hide");
    setTimeout(() => {
      backdrop.classList.remove("show");
      document.body.style.overflow = "";
    }, 350);
  }

  // Event listeners for modal
  closeBtn.addEventListener("click", hideDetails);
  backdrop.addEventListener("click", e => { 
    if (e.target === backdrop) hideDetails(); 
  });
  document.addEventListener("keydown", e => { 
    if (e.key === "Escape" && backdrop.classList.contains("show")) hideDetails(); 
  });

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

      // Add click handler for modal
      card.addEventListener("click", () => openDetails(font));

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
