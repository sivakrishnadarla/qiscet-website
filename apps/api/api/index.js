/**
 * Vercel serverless entry. `npm run build` (nest build) must run first so dist/ exists.
 * All routes are forwarded to the Nest app, which serves /api/*.
 */
let server;

module.exports = async function handler(req, res) {
  if (!server) {
    const { getServer } = require('../dist/vercel');
    server = await getServer();
  }
  return server(req, res);
};
