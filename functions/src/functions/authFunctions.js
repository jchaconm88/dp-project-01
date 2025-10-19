const { logger } = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const axios = require('axios');
const express = require('express');
const opt = { cors: true }
const app = express()

app.use((req, res, next) => {
    next();
});

app.post('/login', async (req, res) => {
    logger.info('Beginning POST /auth/login');
    try {
        const { email, password } = req.body;

        let data = JSON.stringify({
            email,
            password,
            "returnSecureToken": true
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDIqVGEwUZxGEZUrVmtu1s1zD4qp_uY9Aw',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        const response = await axios.request(config);
        logger.info(response.data);

        res.status(200).json({ ...response.data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ description: "Error al ejecutar función", error });
    }
})

exports.api = onRequest(opt, app);