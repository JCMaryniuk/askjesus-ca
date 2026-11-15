import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.dirname(fileURLToPath(import.meta.url));
const app=express();
app.disable('x-powered-by');
app.use(express.static(root,{index:'index.html',maxAge:'1h'}));
app.get('/health',(_request,response)=>response.json({status:'ok',game:'Sarko Guild Card Arena'}));
app.use((_request,response)=>response.status(404).send('Not found'));
app.listen(Number(process.env.PORT)||3000,'0.0.0.0',()=>console.log('Sarko Guild Card Arena is ready.'));
