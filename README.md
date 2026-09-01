# ASKJesus.ca

A Scripture-finding web app built around Matthew 7:7: Ask, Seek, Knock.

## Core rule
The model selects Bible references only. The exact displayed Bible wording is retrieved separately from the World English Bible through bible-api.com.

## Run locally
1. Install Node.js 20+.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and add your OpenAI API key.
4. Run `npm start`.
5. Open `http://localhost:3000`.

Without an OpenAI key, the app still runs using a small built-in topic matcher.

## Deployment
This project is ready for a Node host such as Render or Railway.

Typical settings:
- Build command: `npm install`
- Start command: `npm start`
- Environment variable: `OPENAI_API_KEY`
- Optional environment variable: `OPENAI_MODEL=gpt-5-mini`

After deployment, point ASKJesus.ca to the host using the DNS records provided by the hosting service.

## Important design principle
ASKJesus.ca is a Scripture-finding tool. It should not claim personal revelation or replace a pastor, counsellor, doctor, lawyer, emergency service, or other qualified human support.

World English Bible text is public domain.
