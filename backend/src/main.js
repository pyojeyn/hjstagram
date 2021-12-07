import Koa from 'koa';
import mongoose from 'mongoose';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser'
import api from './api'
import jwtMiddleware from './lib/jwtMiddleware';
import serve from 'koa-static';
import path from 'path';
import http from 'http';
import socketIO from 'socket.io';
import fs from 'fs';
import htmlRender from 'koa-html-render';


const port = 4000;
const app = new Koa();
const router = new Router();

//미들웨어 등록!
router.use('/api', api.routes());

app.use(htmlRender());
app.use(bodyParser());
app.use(jwtMiddleware);
app.use(router.routes()).use(router.allowedMethods());
app.use(serve(path.join(__dirname, 'uploads')));
app.use(serve(path.join(__dirname, '../../frontend/build')));


router.get("/",async ctx=>{
    await ctx.html("/../../frontend/build/index.html") // The meaning is to return to the client in the root directory of the project, in the static directory, in the html folder named demo.html
});

// 소켓소켓

//MongoDB 연결
mongoose
.connect('mongodb://localhost:27017/hjstagram',{useNewUrlParser: true})
.then(()=>{
    console.log('Connected to MongoDB');
})
.catch(e=>{
    console.error(e);
});

app.listen(port, () => {
    console.log(`${port}로 서버 실행중 ...`);
});