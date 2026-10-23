// Templates of docs/ia/templates.csv (M2-01): id and purpose. The /templates preview pages show one
// sample page per template.
import templatesCsv from '../../../docs/ia/templates.csv?raw';
import { readRows } from './nodes';

export const templates = readRows(templatesCsv, 'templates.csv', ['id', 'purpose']);
