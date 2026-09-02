import express from "express";
import OpenAI from "openai";

const app = express();

const PORT =
process.env.PORT || 3000;

/* =========================================================
BASIC SERVER SETUP
========================================================= */

app.disable("x-powered-by");

app.use(
express.json({
limit: "20kb"
})
);

/*
Serve the website.

maxAge is deliberately kept short while we are developing
