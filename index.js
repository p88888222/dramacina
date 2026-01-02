const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

const BASE_URL = 'https://api.sansekai.my.id/api/melolo';

app.set('view engine', 'ejs');
app.set('views', __dirname);

// Route Utama: Mengambil Latest dan Trending
app.get('/', async (req, res) => {
    try {
        const [latestRes, trendingRes] = await Promise.all([
            axios.get(`${BASE_URL}/latest`),
            axios.get(`${BASE_URL}/trending`)
        ]);

        const latest = latestRes.data.books || [];
        const trending = trendingRes.data.books || [];

        res.render('index', { latest, trending });
    } catch (err) {
        console.error("API Error:", err.message);
        res.render('index', { latest: [], trending: [] });
    }
});

// Route Detail
app.get('/detail/:book_id', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/detail?id=${req.params.book_id}`);
        // Mengirim data drama dari respons API
        res.render('detail', { drama: response.data.data });
    } catch (err) {
        res.status(500).send("Gagal memuat detail drama.");
    }
});

// Route Stream
app.get('/stream/:ep_id', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/stream?id=${req.params.ep_id}`);
        res.render('stream', { stream: response.data.data });
    } catch (err) {
        res.status(500).send("Gagal memuat video.");
    }
});

app.listen(PORT, () => console.log(`Server aktif di port ${PORT}`));

