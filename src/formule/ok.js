function haversineDistance(coord1, coord2) {
    const R = 6371; // Radius of the Earth in kilometers
    const lat1 = (coord1.lat * Math.PI) / 180;
    const lat2 = (coord2.lat * Math.PI) / 180;
    const lon1 = (coord1.lng * Math.PI) / 180;
    const lon2 = (coord2.lng * Math.PI) / 180;

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in kilometers

    return distance;
}

const targetUser = { lat: 19.0316216, lng: 72.845141 }; // Target user's coordinates
const users = [
    { lat: 19.0269249, lng: 72.8478554 },
    { lat: 19.0269249, lng: 72.8478554 }, // User 1
    { lat: 19.0322634, lng: 72.8454553 }, // User 2
    // Add more user coordinates
];
const nearbyUsers = [];

for (const user of users) {
    const distance = haversineDistance(targetUser, user);
    if (distance <= 0.5) { // Check if the distance is less than or equal to 0.5 kilometers (500 meters)
        nearbyUsers.push(user);
    }
}

console.log('Users within 500 meters:', nearbyUsers);
