import _ from 'lodash';
import { AxiosError } from 'axios';

export default e => {
  if (e instanceof AxiosError) {
    console.error(String(e));
    console.error(_.pick(e.config, ['method', 'url', 'data']));
    return;
  }
  console.error(e);
};
