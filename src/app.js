import * as dotenv from 'dotenv';
dotenv.config();

import createServer from './Infrastructures/http/createServer.js';
import container from './Infrastructures/container.js';

const init = async () => {
  const server = await createServer(container);

  await server.start();

  console.log(`server start at ${server.info.uri}`);
};

init();
