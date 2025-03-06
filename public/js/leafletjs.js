/*eslint-disable*/

export const displayMap = (locations) => {
  if (typeof L === "undefined") {
    console.error("Leaflet.js is not loaded.");
    return;
  }

  // Custom Icon configuration
  const customIcon = L.icon({
    iconUrl: "/img/pin.png", // Custom icon path
    iconSize: [32, 40], // Width, Height
    iconAnchor: [16, 40], // Anchor point of the icon
    popupAnchor: [0, -40], // Popup position relative to the icon
  });

  // Initialize the map
  const map = L.map("map", { zoomControl: false }).setView(
    [locations[0].coordinates[1], locations[0].coordinates[0]], // Latitude, Longitude
    8 // Zoom level (increased for more detail)
  );

  // Add CartoDB Light tile layer to the map
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map);

  // Add custom markers for each location
  locations.forEach((loc) => {
    const [lng, lat] = loc.coordinates; // Destructure coordinates

    L.marker([lat, lng], { icon: customIcon })
      .addTo(map)
      .bindPopup(`<b>Day ${loc.day}:</b> ${loc.description}`) // Popup content
      .openPopup();
  });

  // Automatically fit bounds to markers with some padding
  const bounds = locations.map((loc) => [
    loc.coordinates[1],
    loc.coordinates[0],
  ]);
  map.fitBounds(bounds, { padding: [100, 100] });
};
