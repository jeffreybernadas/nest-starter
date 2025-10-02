/**
 * WebSocket module configuration token
 */
export const WEBSOCKET_CONFIGURATION_OPTIONS = 'WEBSOCKET_CONFIGURATION';

/**
 * System event names for WebSocket communication
 */
export const WEBSOCKET_EVENTS = {
  // Connection events
  CONNECTION: 'connection',
  CONNECTED: 'connected',
  DISCONNECT: 'disconnect',
  DISCONNECTING: 'disconnecting',
  ERROR: 'error',

  // System events
  PING: 'ping',
  PONG: 'pong',

  // Authentication events
  AUTHENTICATE: 'authenticate',
  AUTHENTICATED: 'authenticated',
  UNAUTHORIZED: 'unauthorized',

  // Room events
  JOIN_ROOM: 'join-room',
  JOINED_ROOM: 'joined-room',
  LEAVE_ROOM: 'leave-room',
  LEFT_ROOM: 'left-room',

  // User events
  GET_ONLINE_USERS: 'get-online-users',
  ONLINE_USERS: 'online-users',
} as const;

/**
 * WebSocket namespaces
 */
export const WEBSOCKET_NAMESPACES = {
  DEFAULT: '/',
  CHAT: '/chat',
  NOTIFICATIONS: '/notifications',
} as const;
