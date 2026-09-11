let activeCategory = "Todos";
let searchQuery = "";

document.getElementById("logo-icon").innerHTML = ICON_LOGO;
document.getElementById("search-btn").innerHTML = ICON_SEARCH;
document.getElementById("upload-btn").innerHTML = ICON_UPLOAD + " Subir";

function renderCategories() {
  const nav = document.getElementById("categories");
  nav.innerHTML = "";
  CATEGORIES.forEach((cat) => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    if (cat === activeCategory) btn.classList.add("active");
    btn.addEventListener("click", () => {
      activeCategory = cat;
      renderCategories();
      renderGrid();
    });
    nav.appendChild(btn);
  });
}

function renderGrid() {
  const grid = document.getElementById("video-grid");
  const empty = document.getElementById("empty-state");
  grid.innerHTML = "";

  const q = searchQuery.trim().toLowerCase();

  if (q === "secreto") {
    grid.appendChild(makeCardEl(SECRET_VIDEO));
    empty.style.display = "none";
    return;
  }

  let list = getAllVideos();
  if (activeCategory !== "Todos") {
    list = list.filter((v) => v.category === activeCategory);
  }
  if (q) {
    list = list.filter((v) => v.title.toLowerCase().includes(q) || v.category.toLowerCase().includes(q));
  }

  if (list.length === 0) {
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";

  list.forEach((video) => grid.appendChild(makeCardEl(video)));
}

document.getElementById("search-form").addEventListener("submit", (e) => {
  e.preventDefault();
  searchQuery = document.getElementById("search-input").value;
  renderGrid();
});

document.getElementById("search-input").addEventListener("input", (e) => {
  searchQuery = e.target.value;
  renderGrid();
});

const initialQuery = new URLSearchParams(window.location.search).get("q");
if (initialQuery) {
  searchQuery = initialQuery;
  document.getElementById("search-input").value = initialQuery;
}

renderCategories();
renderGrid();
CornDB.onChange = renderGrid;
