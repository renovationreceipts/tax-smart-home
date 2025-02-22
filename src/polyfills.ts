
import { Buffer } from 'buffer';
import process from 'process';

if (typeof global === 'undefined') {
  (window as any).global = window;
}

// Initialize Buffer globally before any code runs
(window as any).Buffer = Buffer;
(window as any).process = process;
