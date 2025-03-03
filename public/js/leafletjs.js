const locations = JSON.parse(document.getElementById("map").dataset.locations);

// Custom Icon
const customIcon = L.icon({
  iconUrl: "/img/pin.png", // Your custom icon path
  iconSize: [32, 40], // Width, Height
  iconAnchor: [16, 40], // Center the icon
  popupAnchor: [0, -40], // Popup position
});

// Initialize the map with a custom style
const map = L.map("map", { zoomControl: false }).setView(
  [locations[0].coordinates[1], locations[0].coordinates[0]],
  6,
);

// Add CartoDB Light map tiles
L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
  subdomains: "abcd",
  maxZoom: 19,
}).addTo(map);

// Loop through locations and add custom markers
locations.forEach((loc) => {
  const [lng, lat] = loc.coordinates;

  L.marker([lat, lng], { icon: customIcon })
    .addTo(map)
    .bindPopup(`<b>Day ${loc.day}:</b> ${loc.description}`)
    .openPopup();
});

// Automatically fit bounds to markers with padding
const bounds = locations.map((loc) => [loc.coordinates[1], loc.coordinates[0]]);
map.fitBounds(bounds, { padding: [100, 100] });
