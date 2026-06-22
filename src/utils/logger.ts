import { APP_CONFIG } from '@constants/config';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: string;
}

const formatMessage = (level: LogLevel, message: string, data?: unknown): LogEntry => ({
  level,
  message,
  data,
  timestamp: new Date().toISOString(),
});

const log = (level: LogLevel, message: string, data?: unknown): void => {
  if (!APP_CONFIG.IS_DEV && level === 'debug') return;

  const entry = formatMessage(level, message, data);

  const prefix = `[${entry.timestamp}] [${level.toUpperCase()}]`;

  switch (level) {
    case 'debug':
      console.log(prefix, message, data ?? '');
      break;
    case 'info':
      console.info(prefix, message, data ?? '');
      break;
    case 'warn':
      console.warn(prefix, message, data ?? '');
      break;
    case 'error':
      console.error(prefix, message, data ?? '');
      break;
  }
};

export const logger = {
  debug: (message: string, data?: unknown) => log('debug', message, data),
  info: (message: string, data?: unknown) => log('info', message, data),
  warn: (message: string, data?: unknown) => log('warn', message, data),
  error: (message: string, data?: unknown) => log('error', message, data),
};
