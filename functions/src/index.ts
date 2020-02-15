import * as functions from 'firebase-functions';
import * as express from 'express';
import { IpFilter } from 'express-ipfilter';
// import * as fs from 'fs';
// import * as path from 'path';

const PERMIT_IPS = [
  '127.0.0.1',
];

const app = express();

app.use(IpFilter(PERMIT_IPS, {
  mode: 'allow',
  detectIp: (req) => {
    // IPが取れない場合はローカルIPにフォールバック
    return req.connection.remoteAddress || '127.0.0.1';
  },
}));

app.get('/', (req, res) => {
  res.send('key!');
});

export const server = functions.https.onRequest(app);
