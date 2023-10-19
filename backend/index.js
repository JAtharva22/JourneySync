const users = require('./data.json');
const cors = require('cors');
const express = require('express');

const app = express();

app.use(cors());
app.use(express.json());

function srchaversineDistance(coord1, coord2) {
    const R = 6371; // Radius of the Earth in kilometers
    const lat1 = (coord1.lat * Math.PI) / 180;
    const lat2 = (coord2.srclat * Math.PI) / 180;
    const lon1 = (coord1.lng * Math.PI) / 180;
    const lon2 = (coord2.srclng * Math.PI) / 180;

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in kilometers

    return distance;
}

function desthaversineDistance(coord1, coord2) {
    const R = 6371; // Radius of the Earth in kilometers
    const lat1 = (coord1.lat * Math.PI) / 180;
    const lat2 = (coord2.destlat * Math.PI) / 180;
    const lon1 = (coord1.lng * Math.PI) / 180;
    const lon2 = (coord2.destlng * Math.PI) / 180;

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in kilometers

    return distance;
}


let targetUser;
let targetDest;
let nearbyUsers;
let samedest;
let userIDs;

app.post('/', (req, res) => {
    const { destlat, destlng, srclat, srclng } = req.body;

    targetUser = { lat: srclat, lng: srclng };
    nearbyUsers = [];
    for (const user of users) {
        const distance = srchaversineDistance(targetUser, user);
        if (distance <= 0.5) {
            nearbyUsers.push(user);
        }
    }

    targetDest = { lat: destlat, lng: destlng };
    samedest = [];
    for (const user of nearbyUsers) {
        const distance = desthaversineDistance(targetDest, user);
        console.log(user)
        if (distance <= 0.5) {
            console.log(distance)
            samedest.push(user);
        }
    }

    userIDs = samedest.map(user => user.id);
    res.send(userIDs);
});

app.get('/', (req, res) => {
    if (targetUser) {
        res.json({ targetUser, targetDest, nearbyUsers, samedest, userIDs });
    } else {
        res.json({ message: 'No target user set yet.' });
    }
});


app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
