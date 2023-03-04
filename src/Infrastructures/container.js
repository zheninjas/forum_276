/* istanbul ignore file */

import {createContainer} from 'instances-container';

// external agency
import Jwt from '@hapi/jwt';
import bcrypt from 'bcrypt';
import {nanoid} from 'nanoid';
import pool from './database/postgres/pool.js';

// service (repository, helper, manager, etc)
import AuthenticationTokenManager from '../Applications/security/AuthenticationTokenManager.js';
import PasswordHash from '../Applications/security/PasswordHash.js';
import AuthenticationRepository from '../Domains/authentications/AuthenticationRepository.js';
import ThreadCommentReplyRepository from '../Domains/threads/ThreadCommentReplyRepository.js';
import ThreadCommentRepository from '../Domains/threads/ThreadCommentRepository.js';
import ThreadRepository from '../Domains/threads/ThreadRepository.js';
import UserRepository from '../Domains/users/UserRepository.js';
import AuthenticationRepositoryPostgres from './repository/AuthenticationRepositoryPostgres.js';
import ThreadCommentReplyRepositoryPostgres from './repository/ThreadCommentReplyRepositoryPostgres.js';
import ThreadCommentRepositoryPostgres from './repository/ThreadCommentRepositoryPostgres.js';
import ThreadRepositoryPostgres from './repository/ThreadRepositoryPostgres.js';
import UserRepositoryPostgres from './repository/UserRepositoryPostgres.js';
import BcryptPasswordHash from './security/BcryptPasswordHash.js';
import JwtTokenManager from './security/JwtTokenManager.js';

// use case
import AddThreadCommentReplyUseCase from '../Applications/use_case/AddThreadCommentReplyUseCase.js';
import AddThreadCommentUseCase from '../Applications/use_case/AddThreadCommentUseCase.js';
import AddThreadUseCase from '../Applications/use_case/AddThreadUseCase.js';
import AddUserUseCase from '../Applications/use_case/AddUserUseCase.js';
import DeleteThreadCommentReplyUseCase from '../Applications/use_case/DeleteThreadCommentReplyUseCase.js';
import DeleteThreadCommentUseCase from '../Applications/use_case/DeleteThreadCommentUseCase.js';
import GetThreadUseCase from '../Applications/use_case/GetThreadUseCase.js';
import LoginUserUseCase from '../Applications/use_case/LoginUserUseCase.js';
import LogoutUserUseCase from '../Applications/use_case/LogoutUserUseCase.js';
import RefreshAuthenticationUseCase from '../Applications/use_case/RefreshAuthenticationUseCase.js';

// creating container
const container = createContainer();

// registering services and repository
container.register([
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: AuthenticationRepository.name,
    Class: AuthenticationRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
      ],
    },
  },
  {
    key: ThreadRepository.name,
    Class: ThreadRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: ThreadCommentRepository.name,
    Class: ThreadCommentRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: ThreadCommentReplyRepository.name,
    Class: ThreadCommentReplyRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: PasswordHash.name,
    Class: BcryptPasswordHash,
    parameter: {
      dependencies: [
        {
          concrete: bcrypt,
        },
      ],
    },
  },
  {
    key: AuthenticationTokenManager.name,
    Class: JwtTokenManager,
    parameter: {
      dependencies: [
        {
          concrete: Jwt.token,
        },
      ],
    },
  },
]);

// registering use cases
container.register([
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name,
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name,
        },
      ],
    },
  },
  {
    key: LoginUserUseCase.name,
    Class: LoginUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name,
        },
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name,
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name,
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name,
        },
      ],
    },
  },
  {
    key: LogoutUserUseCase.name,
    Class: LogoutUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name,
        },
      ],
    },
  },
  {
    key: RefreshAuthenticationUseCase.name,
    Class: RefreshAuthenticationUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name,
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name,
        },
      ],
    },
  },
  {
    key: AddThreadUseCase.name,
    Class: AddThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name,
        },
      ],
    },
  },
  {
    key: GetThreadUseCase.name,
    Class: GetThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name,
        },
      ],
    },
  },
  {
    key: AddThreadCommentUseCase.name,
    Class: AddThreadCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name,
        },
        {
          name: 'threadCommentRepository',
          internal: ThreadCommentRepository.name,
        },
      ],
    },
  },
  {
    key: DeleteThreadCommentUseCase.name,
    Class: DeleteThreadCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadCommentRepository',
          internal: ThreadCommentRepository.name,
        },
      ],
    },
  },
  {
    key: AddThreadCommentReplyUseCase.name,
    Class: AddThreadCommentReplyUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name,
        },
        {
          name: 'threadCommentRepository',
          internal: ThreadCommentRepository.name,
        },
        {
          name: 'threadCommentReplyRepository',
          internal: ThreadCommentReplyRepository.name,
        },
      ],
    },
  },
  {
    key: DeleteThreadCommentReplyUseCase.name,
    Class: DeleteThreadCommentReplyUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadCommentReplyRepository',
          internal: ThreadCommentReplyRepository.name,
        },
      ],
    },
  },
]);

export default container;
