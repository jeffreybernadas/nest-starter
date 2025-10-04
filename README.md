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

### Completed

- [x] Nest with Express
- [x] API Versioning
- [x] Custom Error handling with Custom Errors such as:
  - [x] GENERIC_ERROR
  - [x] VALIDATION_ERROR
  - [x] OTP_REQUIRED
  - [x] INVALID_OTP
  - [x] OTP_EXPIRED
  - [x] EXTERNAL_SERVICE_ERROR
  - [x] THIRD_PARTY_API_ERROR
- [x] Offset and Cursor based Pagination
- [x] Custom response format
  - [x] Add meta if paginated
  - [x] Do not add meta if not paginated
  - [x] Show proper response to errors
- [x] Keycloak (nest-keycloak-connect) - decrypting of token and getting user info with endpoints for:
  - [x] GET /api/v1/user/profile - Get user profile
        The following will not be added and will be handled by Keycloak UI:
  - [x] PUT /api/v1/user/profile - Update profile information
  - [x] PUT /api/v1/user/password - Change password
  - [x] GET /api/v1/user/account-info - Complete account overview with roles
  - [x] GET /api/v1/user/sessions - View active sessions
  - [x] POST /api/v1/user/logout-all-sessions - Logout from all sessions
  - [x] POST /api/v1/user/send-verification-email - Send email verification
  - [x] POST /api/v1/user/send-password-reset-email - Trigger password reset
  - [x] GET /api/v1/user/sessions/current - Get current session details
  - [x] DELETE /api/v1/user/sessions/:sessionId - Logout specific session
  - [x] POST /api/v1/user/logout-other-sessions - Logout all sessions except current
- [x] Protect routes with RBAC and Auth
- [x] Swagger Documentation and API versioning for REST API
- [x] Caching and rate limiting with Redis
  - [x] One endpoint rate limiting with customizable rate limiters
  - [x] Global rate limiting
  - [x] Caching of endpoints (all)
- [x] Logging with Winston & Elasticsearch (w/ APM)
- [x] Graceful Shutdown
- [x] Add seeder + migration for DB via Prisma
  - [x] Seed data for development
- [x] Add File upload with Minio (no local upload)
- [x] Commitlint and Husky

### In Progress

- [ ] Multiple DB connections with Prisma:
  - [x] PostgreSQL
  - [ ] MongoDB
  - [ ] MySQL
- [ ] REST & WebSocket API
- [x] Add RabbitMQ (@golevelup/nestjs-rabbitmq) for message queues. Add example during user first login welcoming them.
  - Not sure how to do this since registration and auth is done with keycloak
  - Maybe an email after they create a group chat?
- [ ] Worker server for processing background tasks like queues
  - Add example of sending emails regarding unread chats every 8 pm of the day (PH time)
- [ ] Websocket using Socket.io via Redis Adapter and add chatting functionality
  - [ ] POST /api/v1/chat - Create a new chat (group chat)
  - [ ] GET /api/v1/chat - List chats user belongs to
  - [ ] GET /api/v1/chat/:chatId - Get chat details (users, name, all users, type: group/direct)
  - [ ] GET /api/v1/chat/:chatId/messages - Fetch chat history (with cursor pagination)
  - [ ] POST /api/v1/chat/:chatId/messages - Send a new message
  - [ ] PUT /api/v1/chat/:chatId/messages/:messageId - Update message (only if <10 min old & sender = user)
  - [ ] DELETE /api/v1/chat/:chatId/messages/:messageId - Delete message (only if <10 min old & sender = user)
- [x] Email template with React Email and Resend for sending emails
  - [ ] Reply to chat message email template (worker server task)
- [ ] Stripe API (@golevelup/nestjs-stripe stripe)
- [ ] Add Internationalization with i18n
- [ ] Docker compose for services
- [ ] Sentry
- [ ] Nest.js best practices are utilized

## Issues

- Error response with Prisma is not detailed enough.
