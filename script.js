// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize map with Ahmedabad coordinates and proper zoom level
        const map = L.map('map').setView([23.0339, 72.5083], 13);
        
        // Use OpenStreetMap as fallback if Mapbox token is not set
        const mapboxAccessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';
        const mapUrl = mapboxAccessToken !== 'YOUR_MAPBOX_ACCESS_TOKEN' 
            ? `https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${mapboxAccessToken}`
            : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
            
        const attribution = mapboxAccessToken !== 'YOUR_MAPBOX_ACCESS_TOKEN'
            ? '© Mapbox © OpenStreetMap'
            : '© OpenStreetMap contributors';

        L.tileLayer(mapUrl, {
            attribution: attribution
        }).addTo(map);

        // Function to create marker icon
        const createMarkerIcon = (type) => {
            const iconUrls = {
                hospital: "https://img.icons8.com/fluency/48/hospital.png",
                mechanic: "https://img.icons8.com/fluency/48/mechanic.png",
                petrol: "https://img.icons8.com/fluency/48/gas-station.png"
            };
            
            return L.icon({
                iconUrl: iconUrls[type] || "https://img.icons8.com/fluency/48/marker.png",
                iconSize: [30, 30],
                iconAnchor: [15, 30]
            });
        };

        // Function to format location info
        const formatLocationInfo = (loc) => {
            let info = `<strong>${loc.name}</strong><br>`;
            switch(loc.type) {
                case "hospital":
                    info += `<p>Facilities: ${Array.isArray(loc.facilities) ? loc.facilities.join(', ') : loc.facilities}</p>`;
                    break;
                case "mechanic":
                    info += `<p>Specialization: ${Array.isArray(loc.specialization) ? loc.specialization.join(', ') : loc.specialization}</p>`;
                    break;
                case "petrol":
                    info += `<p>Fuel Types: ${Array.isArray(loc.fuel) ? loc.fuel.join(', ') : loc.fuel}</p>`;
                    break;
            }
            return info;
        };

        // Function to add markers to map
        const addMarkersToMap = (locations) => {
            console.log('Adding markers for locations:', locations);
            if (!Array.isArray(locations)) {
                console.error('Locations is not an array:', locations);
                return;
            }
            
            locations.forEach(loc => {
                try {
                    if (!loc.lat || !loc.lon) {
                        console.error('Location missing coordinates:', loc);
                        return;
                    }
                    
                    const marker = L.marker([loc.lat, loc.lon], {
                        icon: createMarkerIcon(loc.type)
                    }).addTo(map);

                    marker.on('click', () => {
                        const infoContent = document.getElementById('info-content');
                        if (infoContent) {
                            infoContent.innerHTML = formatLocationInfo(loc);
                        }
                    });
                } catch (error) {
                    console.error(`Error adding marker for ${loc.name}:`, error);
                }
            });
        };

        // Hardcoded locations data with corrected coordinates
        const locations = [
            {
                "type": "petrol",
                "name": "Shell Petrol Station - Satellite",
                "lat": 23.0339,
                "lon": 72.5083,
                "fuel": ["Petrol", "Diesel", "CNG"]
            },
            {
                "type": "petrol",
                "name": "Indian Oil - Prahlad Nagar",
                "lat": 23.0127,
                "lon": 72.5083,
                "fuel": ["Petrol", "Diesel", "CNG"]
            },
            {
                "type": "mechanic",
                "name": "Speedy Auto Repair - Satellite",
                "lat": 23.0339,
                "lon": 72.5083,
                "specialization": ["Engine Repair", "Oil Change", "Brake Service", "AC Service"]
            },
            {
                "type": "mechanic",
                "name": "Elite Car Service - Prahlad Nagar",
                "lat": 23.0127,
                "lon": 72.5083,
                "specialization": ["AC Repair", "Wheel Alignment", "Transmission Service", "Electrical"]
            },
            {
                "type": "hospital",
                "name": "Apollo Hospital - Satellite",
                "lat": 23.0339,
                "lon": 72.5083,
                "facilities": ["24/7 Emergency", "ICU", "Cardiology", "Neurology", "Orthopedics"]
            },
            {
                "type": "hospital",
                "name": "Sterling Hospital - Prahlad Nagar",
                "lat": 23.0127,
                "lon": 72.5083,
                "facilities": ["Emergency Care", "Cardiology", "Pediatrics", "Maternity", "Dental"]
            },
            {
                "type": "petrol",
                "name": "HP Gas Pump - Bodakdev",
                "lat": 23.0417,
                "lon": 72.5083,
                "fuel": ["Petrol", "Diesel", "CNG", "LPG"]
            },
            {
                "type": "mechanic",
                "name": "Bike Master Workshop - Bodakdev",
                "lat": 23.0417,
                "lon": 72.5083,
                "specialization": ["Motorbike Service", "Engine Tuning", "Chain Service", "Battery"]
            },
            {
                "type": "hospital",
                "name": "CIMS Hospital - Bodakdev",
                "lat": 23.0417,
                "lon": 72.5083,
                "facilities": ["24/7 Emergency", "Multi-Specialty", "Cancer Care", "Transplant", "Robotic Surgery"]
            },
            {
                "type": "petrol",
                "name": "Bharat Petroleum - Navrangpura",
                "lat": 23.0339,
                "lon": 72.5667,
                "fuel": ["Petrol", "Diesel", "CNG"]
            }
        ];

        // Add markers to map
        addMarkersToMap(locations);

    } catch (error) {
        console.error('Error initializing map:', error);
        document.getElementById('info-content').innerHTML = 'Error loading map. Please refresh the page.';
    }
});