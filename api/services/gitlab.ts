import {send, sendError, NowRequest, NowResponse} from '../util/http';
import nodeFetch from 'node-fetch';

export default async function handler(
  req: NowRequest,
  res: NowResponse,
): Promise<void> {
  const {query} = req.query;

  if (!query) {
    return sendError(res, new Error('No query given'));
  }

  if (/[^a-zA-Z0-9_-]/.test(query)) {
    return sendError(res, new Error('Invalid characters'));
  }

  try {
    const response = await nodeFetch(`https://gitlab.com/${query}`, {
      redirect: 'manual',
    });
    const availability = response.status === 302;
    send(res, {availability});
  } catch (err) {
    sendError(res, err);
  }
}
