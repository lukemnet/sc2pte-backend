/**
 * @file    App configuration file.
 * @author  Łukasz Wójcik
 * @license MIT
 * @since   2018-06-19
 */

const { env } = process;

interface AppConfig {
  port: string;
}

const appConfig = {} as AppConfig;

/** Node.js app port */
appConfig.port = env.API_NODE_PORT || '8881';

export default appConfig;
