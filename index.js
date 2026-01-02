const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

const BASE_URL = 'https://api.sansekai.my.id/api/melolo';

app.set('view engine', 'ejs');
app.set('views', __dirname);

// HOME - Gabungan Latest, Trending, dan Pilihan
app.get('/', async (req, res) => {
    try {
        const [latestRes, trendingRes, searchRes] = await Promise.all([
            axios.get(`${BASE_URL}/latest`),
            axios.get(`${BASE_URL}/trending`),
            axios.get(`${BASE_URL}/search?s=romance`) // "Drama Pilihan" diambil dari keyword romance
        ]);

        res.render('index', { 
            title: 'Home',
            sections: [
                { label: 'Drama Terbaru', data: latestRes.data.data.slice(0, 6) },
                { label: 'Sedang Trending', data: trendingRes.data.data.slice(0, 6) },
                { label: 'Drama Pilihan', data: searchRes.data.data.slice(0, 6) }
            ],
            active: 'home' 
        });
    } catch (err) {
        res.render('index', { title: 'Error', sections: [], active: 'home' });
    }
});

// HOT - Full Trending
app.get('/hot', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/trending`);
        res.render('list', { title: 'Hot Trending', dramas: response.data.data, active: 'hot' });
    } catch (err) { res.render('list', { title: 'Error', dramas: [], active: 'hot' }); }
});

// FOR YOU - Shuffle
app.get('/for-you', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/trending`);
        let dramas = response.data.data.sort(() => Math.random() - 0.5);
        res.render('list', { title: 'For You', dramas: dramas, active: 'foryou' });
    } catch (err) { res.render('list', { title: 'Error', dramas: [], active: 'foryou' }); }
});

// DETAIL & STREAM (Tetap sama)
app.get('/detail/:id', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/detail?id=${req.params.id}`);
        res.render('detail', { drama: response.data.data });
    } catch (err) { res.send("Gagal memuat detail."); }
});

app.get('/stream/:id', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/stream?id=${req.params.id}`);
        res.render('stream', { stream: response.data.data });
    } catch (err) { res.send("Gagal memuat player."); }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
