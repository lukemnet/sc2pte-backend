import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

import { default as statusRoutes } from './routes/status/index';
import { default as configRoutes } from './routes/config';
import { default as viewerRoutes } from './routes/viewer';
import cache from './plugins/cache';
import db from './plugins/db';
import playerConfig from './plugins/playerConfig';
import twitchConfigValidator from './plugins/twitchConfigValidator';

interface ServerOptions {
  db: {
    uri: string;
  },
  twitch: {
    secret: string;
    enableOnAuthorized: boolean;
  },
  maxPlayerProfileCount: number;
}

const api = fp(
  (fastify: FastifyInstance, opts: ServerOptions, next: CallableFunction) => {
    const { maxPlayerProfileCount } = opts;
    fastify.register(cache);
    fastify.register(db, {
      ...opts.db,
      maxPlayerProfileCount,
    });
    fastify.register(playerConfig, { maxPlayerProfileCount });
    fastify.register(twitchConfigValidator, opts.twitch);
    fastify.register(statusRoutes);
    fastify.register(configRoutes.get);
    fastify.register(configRoutes.post);
    fastify.register(viewerRoutes.get);
    next();
  },
);

export = api;
