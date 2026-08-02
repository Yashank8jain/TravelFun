if (document.getElementById("map")) {
    const map = L.map("map").setView(
        [window.coordinates[1], window.coordinates[0]],
        13
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.marker([window.coordinates[1], window.coordinates[0]])
        .addTo(map)
        .bindPopup(`<b>${window.locationName}</b>`)
        .openPopup();
}