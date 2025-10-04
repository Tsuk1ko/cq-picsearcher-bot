import { Parser } from '@json2csv/plainjs';

export const json2csv = data => new Parser({ withBOM: true }).parse(data);
