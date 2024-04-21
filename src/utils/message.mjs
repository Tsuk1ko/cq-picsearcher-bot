import cqws from '@tsuk1ko/cq-websocket';

export const getRawMessage = data =>
  typeof data.raw_message === 'string'
    ? data.raw_message
    : Array.isArray(data.message)
      ? cqws.convertArrayMsgToStringMsg(data.message)
      : data.message;
