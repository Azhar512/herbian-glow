import handler from '../dist/server/server.js';
import { createServerAdapter } from '@whatwg-node/server';

export default createServerAdapter(
  (request, env, ctx) => handler.fetch(request, env, ctx)
);
