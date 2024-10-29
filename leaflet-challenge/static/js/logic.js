// Inicializa el mapa
let myMap = L.map("map", {
    center: [37.09, -95.71], // Coordenadas para centrar el mapa (EE. UU.)
    zoom: 5 // Nivel de zoom
});

// Agrega una capa de mosaico
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Obtiene datos de terremotos
const earthquakeDataUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(earthquakeDataUrl).then(data => {
    createFeatures(data.features);
});

// Función para crear marcadores en el mapa
function createFeatures(earthquakeData) {
    earthquakeData.forEach(feature => {
        const magnitude = feature.properties.mag;
        const depth = feature.geometry.coordinates[2];
        const coords = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];

        // Determina el tamaño y color del marcador
        const markerSize = magnitude * 5000; // Ajusta el multiplicador según sea necesario
        const markerColor = depth > 50 ? 'red' : depth > 30 ? 'orange' : 'green'; // Ajusta los colores según la profundidad

        // Crea un círculo para el marcador
        L.circle(coords, {
            fillOpacity: 0.75,
            color: markerColor,
            fillColor: markerColor,
            radius: markerSize
        }).addTo(myMap).bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${magnitude}<br>Depth: ${depth} km</p>`);
    });

    // Crear la leyenda
    createLegend();
}

// Función para crear la leyenda
function createLegend() {
    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {
        const div = L.DomUtil.create('div', 'info legend');
        const grades = [0, 30, 50];
        const labels = [];

        // Agregar leyenda de colores
        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + (i === 0 ? 'green' : (i === 1 ? 'orange' : 'red')) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(myMap);
}