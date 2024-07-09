"use strict";

const millisToMinsAndSecs = (t) => {
  const min = Math.floor(t / 60000);
  const sec = Math.floor((t % 60000) / 1000);

  if (min > 0 && sec > 0) {
    return `${min} min, ${sec} sec`;
  } else if (min > 0 && sec === 0) {
    return `${min} min`;
  } else if ((min === 0) & (sec > 0)) {
    return `${sec} sec`;
  }

  return;
};

const createTable = (d) => {
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const hr = document.createElement("tr");
  const headers = [
    "Artwork",
    "Artist",
    "Collection",
    "Track",
    "Genre",
    "Duration",
    "Date",
    "Preview",
  ];
  headers.forEach((header) => {
    const th = document.createElement("th");
    th.textContent = header;
    hr.appendChild(th);
  });
  thead.appendChild(hr);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  d.forEach((item) => {
    const br = document.createElement("tr");
    const cells = [
      `<img src="${item.artworkUrl100}" alt="Artwork" />`,
      item.artistName,
      item.collectionName,
      item.trackName,
      item.primaryGenreName,
      millisToMinsAndSecs(parseInt(item.trackTimeMillis)),
      new Date(String(item.releaseDate)).toLocaleDateString("hr-HR", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      }),
      `<audio controls><source src="${item.previewUrl}" type="audio/aac"></audio>`,
    ];
    cells.forEach((cell) => {
      const td = document.createElement("td");
      td.innerHTML = cell;
      br.appendChild(td);
    });
    tbody.appendChild(br);
  });
  table.appendChild(tbody);
  document.body.appendChild(table);
};

const removeTable = () => {
  const existingTable = document.querySelector("table");

  if (existingTable) {
    existingTable.remove();
  }
};

const updateInfo = (d) => {
  const info = document.getElementById("info");

  d ? (info.textContent = d) : (info.textContent = "");
};

const onInputQuery = async (e) => {
  const value = encodeURIComponent(e.target.value.trim());
  if (value === "") {
    updateInfo("Value can't be empty, please insert your query.");
    return;
  }

  updateInfo("Searching...");
  const response = await fetch(
    `https://itunes.apple.com/search?entity=song&term=${value}`
  );
  const json = await response.json();
  if (json.resultCount === 0) {
    updateInfo("No results found.");
    return;
  }
  updateInfo();

  removeTable();
  createTable(json.results);
};

const debounceInput = (f, t) => {
  let timeout;

  return function (...a) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      f.apply(this, a);
    }, t);
  };
};

document.addEventListener("DOMContentLoaded", () =>
  document
    .getElementById("query")
    .addEventListener("input", debounceInput(onInputQuery, 500))
);
