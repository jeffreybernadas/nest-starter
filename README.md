<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <h4 align="center">Nest Starter</h4>
  <p align="center">A scalable and advanced starter for Nest.js applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Features (WIP)

- [x] Nest with Express
- [ ] Multiple DB connections with Prisma:
  - [x] PostgreSQL
  - [ ] MongoDB
  - [ ] MySQL
- [ ] API Versioning
- [ ] Keycloak Auth - decrypting of token and getting user info with endpoints for:
  - [ ] GET /api/v1/user/profile - Get user profile
  - [ ] PUT /api/v1/user/profile - Update profile information
  - [ ] PUT /api/v1/user/password - Change password
  - [ ] GET /api/v1/user/account-info - Complete account overview with roles
  - [ ] GET /api/v1/user/sessions - View active sessions
  - [ ] POST /api/v1/user/logout-all-sessions - Logout from all sessions
  - [ ] POST /api/v1/user/send-verification-email - Send email verification
  - [ ] POST /api/v1/user/send-password-reset-email - Trigger password reset
  - [ ] GET /api/v1/user/sessions/current - Get current session details
  - [ ] DELETE /api/v1/user/sessions/:sessionId - Logout specific session
  - [ ] POST /api/v1/user/logout-other-sessions - Logout all sessions except current
- [ ] Protect routes with RBAC and Auth
- [x] Custom Error handling with Custom Errors such as:
  - [x] GENERIC_ERROR
  - [x] VALIDATION_ERROR
  - [x] OTP_REQUIRED
  - [x] INVALID_OTP
  - [x] OTP_EXPIRED
  - [x] EXTERNAL_SERVICE_ERROR
  - [x] THIRD_PARTY_API_ERROR
- [ ] REST & WebSocket API
- [ ] Offset and Cursor based Pagination
- [ ] Custom response format
- [ ] Websocket using Socket.io via Redis Adapter and add chatting functionality
  - [ ] POST /api/v1/chat - Create a new chat (group chat)
  - [ ] GET /api/v1/chat - List chats user belongs to
  - [ ] GET /api/v1/chat/:chatId - Get chat details (users, name, all users, type: group/direct)
  - [ ] GET /api/v1/chat/:chatId/messages - Fetch chat history (with cursor pagination)
  - [ ] POST /api/v1/chat/:chatId/messages - Send a new message
  - [ ] PUT /api/v1/chat/:chatId/messages/:messageId - Update message (only if <10 min old & sender = user)
  - [ ] DELETE /api/v1/chat/:chatId/messages/:messageId - Delete message (only if <10 min old & sender = user)

- [ ] Swagger Documentation and API versioning for REST API
- [ ] Add RabbitMQ for message queues. Add example during user first login welcoming them.
  - Not sure how to do this since registration and auth is done with keycloak
  - Maybe an email after they create a group chat?

- [ ] Worker server for processing background tasks like queues
  - Add example of sending emails regarding unread chats every 8 pm of the day (PH time)

- [x] Email template with React Email and Resend for sending emails
  - [ ] Reply to chat message email template (worker server task)

- [x] Caching and rate limiting with Redis
  - [x] One endpoint rate limiting with customizable rate limiters
  - [x] Global rate limiting
  - [x] Caching of endpoints (all)

- [x] Logging with Winston & Elasticsearch (w/ APM)

- [x] Graceful Shutdown

- [ ] Server & Database monitoring with Prometheus & Grafana

- [x] Add seeder + migration for DB via Prisma
  - [x] Seed data for development

- [ ] Add Internationalization with i18n
- [ ] Add File upload with Cloudinary (no local upload)
- [ ] Docker compose for services
- [x] Commitlint and Husky
- [ ] Sentry
- [ ] Nest.js best practices are utilized
