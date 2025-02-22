
import { Buffer } from 'buffer';
import process from 'process';

if (typeof global === 'undefined') {
  (window as any).global = window;
}

if (typeof Buffer === 'undefined') {
  (window as any).Buffer = Buffer;
}

(window as any).process = process;
