import handler from '../dist/server/server.js';

export default async function(request, context) {
  return await handler.fetch(request, process.env, context);
}
