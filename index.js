const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

const BASE_URL = 'https://api.sansekai.my.id/api/melolo';

app.set('view engine', 'ejs');
app.set('views', __dirname);

app.get('/', async (req, res) => {
    try {
        const [latestRes, trendingRes] = await Promise.all([
            axios.get(`${BASE_URL}/latest`),
            axios.get(`${BASE_URL}/trending`)
        ]);
        res.render('index', { 
            latest: latestRes.data.books || [], 
            trending: trendingRes.data.books || [] 
        });
    } catch (err) {
        res.render('index', { latest: [], trending: [] });
    }
});

app.get('/detail/:id', async (req, res) => {
    try {
        // Sesuai instruksi: menggunakan book_id
        const response = await axios.get(`${BASE_URL}/detail?book_id=${req.params.id}`);
        res.render('detail', { drama: response.data.data || {} });
    } catch (err) {
        res.status(500).send("Gagal memuat detail.");
    }
});

app.get('/stream/:video_id', async (req, res) => {
    try {
        // Sesuai instruksi: menggunakan videoId
        const response = await axios.get(`${BASE_URL}/stream?videoId=${req.params.video_id}`);
        res.render('stream', { video: response.data.data || {} });
    } catch (err) {
        res.status(500).send("Gagal memuat video.");
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

