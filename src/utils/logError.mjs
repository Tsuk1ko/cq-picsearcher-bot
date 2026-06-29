import { AxiosError } from 'axios';
import { pick } from 'es-toolkit';

export default e => {
  if (e instanceof AxiosError) {
    console.error(String(e.stack || e));
    console.error({
      config: e.config ? pick(e.config, ['method', 'url', 'data']) : undefined,
      response: e.response
        ? {
            ...pick(e.response, ['status', 'statusText']),
            ...((e.response.headers['content-type'] || '').includes('application/json')
              ? pick(e.response, ['data'])
              : {}),
          }
        : undefined,
    });
    return;
  }
  console.error(e);
};
