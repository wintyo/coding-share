import * as functions from 'firebase-functions';
import * as express from 'express';
import { IpFilter } from 'express-ipfilter';
import * as requestIp from 'request-ip';
import * as path from 'path';

// アクセス許可するIPの設定
const PERMIT_IPS = (() => {
  const config = functions.config();
  const permitIps = (config.server && config.server['permit-ips']) || [];
  return [
    '127.0.0.1',
  ].concat(...permitIps);
})();

console.log('PERMIT_IPS:', PERMIT_IPS);

const app = express();

// IP制限
app.use(IpFilter(PERMIT_IPS, {
  mode: 'allow',
  detectIp: (req) => {
    const clientIp = requestIp.getClientIp(req);
    // IPが取れない場合はローカルIPにフォールバック
    return clientIp || '127.0.0.1';
  },
}));

// 静的配信
app.use(express.static(path.resolve(__dirname, '../public')));

export const server = functions.https.onRequest(app);
