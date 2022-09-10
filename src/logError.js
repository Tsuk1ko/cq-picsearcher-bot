import _ from 'lodash';
import { AxiosError } from 'axios';

export default e => {
  if (e instanceof AxiosError) {
    console.error(String(e));
    console.error({
      config: _.pick(e.config, ['method', 'url', 'data']),
      response: {
        ..._.pick(e.response, ['status', 'statusText']),
        ...((e.response.headers['content-type'] || '').includes('application/json')
          ? _.pick(e.response, ['data'])
          : {}),
      },
    });
    return;
  }
  console.error(e);
};
