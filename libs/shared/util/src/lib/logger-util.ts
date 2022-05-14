/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * This will log your message in the console with the SUCCESS level
 * level order: success < debug < info < warn < error < disable
 * @override
 */
export const success = (...args: any[]) => console.log(...args);

/**
 * This will log your message in the console with the DEBUG level
 * level order: success < debug < info < warn < error < disable
 * @override
 */
export const debug = (...args: any[]) => console.debug(...args);

/**
 * This will log your message in the console with the INFO level
 * level order: success < debug < info < warn < error < disable
 * @override
 */
export const info = (...args: any[]) => console.info(...args);

/**
 * This will log your message in the console with the WARN level
 * level order: success < debug < info < warn < error < disable
 * @override
 */
export const warn = (...args: any[]) => console.warn(...args);

/**
 * This will log your message in the console with the ERROR level
 * level order: success < debug < info < warn < error < disable
 * @override
 */
export const error = (...args: any[]) => console.error(...args);
