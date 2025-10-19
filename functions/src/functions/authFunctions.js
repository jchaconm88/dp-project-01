const { logger } = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const axios = require('axios');
const express = require('express');
const app = express()
const APP_FIREBASE_API_KEY = defineSecret("DP_PROJECT_01_API_KEY");
const opt = { cors: true, secrets: [APP_FIREBASE_API_KEY] }

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

        logger.info('API Key:', APP_FIREBASE_API_KEY.value());

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${APP_FIREBASE_API_KEY.value()}`,
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