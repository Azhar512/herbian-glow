import handler from '../dist/server/server.js';

export default handler.fetch;

export const config = {
  runtime: 'edge'
};
