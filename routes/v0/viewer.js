/**
 * @file    v0 Viewer route file.
 * @author  Łukasz Wójcik
 * @license MIT
 * @since   2018-08-15
 */

const router = require('express').Router();
const cache = require('../../config/cache');
const apicache = require('apicache').options({ debug: cache.debug }).middleware;

const getViewerData = require('../../controllers/viewer/get');

router.get('/:channelId', apicache(cache.expensiveRequest), async (req, res) => {
  try {
    const { channelId } = req.params;
    const { token } = req.headers;
    const response = await getViewerData(channelId, token);
    return res.status(response.status).json(response);
  } catch (error) {
    return res.status(400).json({ status: 400, message: 'Bad request' });
  }
});

module.exports = router;
