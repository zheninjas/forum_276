import AuthenticationsTableTestHelper from '../../../../tests/AuthenticationsTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import ThreadCommentsTableTestHelper from '../../../../tests/ThreadCommentsTableTestHelper.js';
import pool from '../../database/postgres/pool.js';
import createServer from '../createServer.js';
import container from '../../container.js';

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await ThreadCommentsTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and new thread', async () => {
      // Arrange
      const username = 'monne';
      const password = 'secret';
      const fullname = 'Itte Monne';
      const title = 'Thread Title';
      const body = 'Thread Body';

      const requestPayload = {
        title,
        body,
      };

      const server = await createServer(container);

      // Add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {username, password, fullname},
      });

      // Login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {username, password},
      });

      const {
        data: {accessToken},
      } = JSON.parse(loginResponse.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(typeof responseJson.data.addedThread).toEqual('object');
      expect(responseJson.data.addedThread).toMatchObject({
        id: expect.any(String),
        title,
        owner: expect.any(String),
      });
    });

    it('should response 400 if payload missing property', async () => {
      // Arrange
      const username = 'monne';
      const password = 'secret';
      const fullname = 'Itte Monne';
      const title = 'Thread Title';

      const requestPayload = {
        title,
      };

      const server = await createServer(container);

      // Add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {username, password, fullname},
      });

      // Login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {username, password},
      });

      const {
        data: {accessToken},
      } = JSON.parse(loginResponse.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('harus mengirimkan title dan body');
    });

    it('should response 400 if payload has wrong data type', async () => {
      // Arrange
      const username = 'monne';
      const password = 'secret';
      const fullname = 'Itte Monne';
      const title = 'Thread Title';
      const body = [123];

      const requestPayload = {
        title,
        body,
      };

      const server = await createServer(container);

      // Add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {username, password, fullname},
      });

      // Login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {username, password},
      });

      const {
        data: {accessToken},
      } = JSON.parse(loginResponse.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('title dan body harus string');
    });

    it('should response 401 when add thread with invalid access token', async () => {
      // Arrange
      const requestPayload = {
        title: 'Thread Title',
        body: 'Thread Body',
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer invalid_token`,
        },
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toBeDefined();
    });

    it('should response 401 when add thread with no access token', async () => {
      // Arrange
      const requestPayload = {
        title: 'Thread Title',
        body: 'Thread Body',
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toBeDefined();
    });
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and new thread comment', async () => {
      // Arrange
      const username = 'monne';
      const password = 'secret';
      const fullname = 'Itte Monne';
      const content = 'comment content';

      const requestPayload = {
        content,
      };

      const server = await createServer(container);

      // Add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {username, password, fullname},
      });

      // Login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {username, password},
      });

      const {
        data: {accessToken},
      } = JSON.parse(loginResponse.payload);

      // Add thread
      const addThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: {
          title: 'Thread Title',
          body: 'Thread Body',
        },
      });

      const {
        data: {
          addedThread: {id: threadId},
        },
      } = JSON.parse(addThreadResponse.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(typeof responseJson.data.addedComment).toEqual('object');
      expect(responseJson.data.addedComment).toMatchObject({
        id: expect.any(String),
        content,
        owner: expect.any(String),
      });
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const username = 'monne';
      const password = 'secret';
      const fullname = 'Itte Monne';

      const requestPayload = {};

      const server = await createServer(container);

      // Add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {username, password, fullname},
      });

      // Login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {username, password},
      });

      const {
        data: {accessToken},
      } = JSON.parse(loginResponse.payload);

      // Add thread
      const addThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: {
          title: 'Thread Title',
          body: 'Thread Body',
        },
      });

      const {
        data: {
          addedThread: {id: threadId},
        },
      } = JSON.parse(addThreadResponse.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('harus mengirimkan content');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const username = 'monne';
      const password = 'secret';
      const fullname = 'Itte Monne';

      const requestPayload = {
        content: 123,
      };

      const server = await createServer(container);

      // Add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {username, password, fullname},
      });

      // Login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {username, password},
      });

      const {
        data: {accessToken},
      } = JSON.parse(loginResponse.payload);

      // Add thread
      const addThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: {
          title: 'Thread Title',
          body: 'Thread Body',
        },
      });

      const {
        data: {
          addedThread: {id: threadId},
        },
      } = JSON.parse(addThreadResponse.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('content harus string');
    });

    it('should response 401 when add thread with invalid access token', async () => {
      // Arrange
      const requestPayload = {
        content: 'comment content',
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        headers: {
          Authorization: `Bearer invalid_token`,
        },
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toBeDefined();
    });

    it('should response 401 when add thread with no access token', async () => {
      // Arrange
      const requestPayload = {
        content: 'comment content',
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toBeDefined();
    });

    it('should response 404 when thread for comment does not exist', async () => {
      // Arrange
      const username = 'monne';
      const password = 'secret';
      const fullname = 'Itte Monne';

      const requestPayload = {
        content: 'comment content',
      };

      const server = await createServer(container);

      // Add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {username, password, fullname},
      });

      // Login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {username, password},
      });

      const {
        data: {accessToken},
      } = JSON.parse(loginResponse.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-xxx/comments',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 and selected comment from thread got deleted if user authorized the comment', async () => {
      // Arrange
      const username = 'monne';
      const password = 'secret';

      const server = await createServer(container);

      // Add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {username, password, fullname: 'Itte Monne'},
      });

      // Login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {username, password},
      });

      const {
        data: {accessToken},
      } = JSON.parse(loginResponse.payload);

      const authHeaders = {
        Authorization: `Bearer ${accessToken}`,
      };

      // Add thread
      const addThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: authHeaders,
        payload: {
          title: 'Thread Title',
          body: 'Thread Body',
        },
      });

      const {
        data: {
          addedThread: {id: threadId},
        },
      } = JSON.parse(addThreadResponse.payload);

      // Add comment
      const addCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        headers: authHeaders,
        payload: {
          content: 'comment to Thread Title',
        },
      });

      const {
        data: {
          addedComment: {id: threadCommentId},
        },
      } = JSON.parse(addCommentResponse.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${threadCommentId}`,
        headers: authHeaders,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 401 when delete comment with invalid access token', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/thread-comment-123',
        headers: {
          Authorization: `Bearer invalid_token`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toBeDefined();
    });

    it('should response 401 when delete comment with no access token', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/thread-comment-123',
        payload: {},
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toBeDefined();
    });

    it('should response 403 when unauthorized user tries to delete an unauthorized comment', async () => {
      // Arrange
      const users = {
        one: {
          username: 'user_one',
          password: 'secret',
          fullname: 'User One',
        },
        two: {
          username: 'user_two',
          password: 'secret',
          fullname: 'User Two',
        },
      };

      const server = await createServer(container);

      const createAndLoginUser = async (userPayload) => {
        // Add user
        await server.inject({
          method: 'POST',
          url: '/users',
          payload: userPayload,
        });

        // Login user
        const loginResponse = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: userPayload.username,
            password: userPayload.password,
          },
        });

        // Make auth headers for user
        const {
          data: {accessToken},
        } = JSON.parse(loginResponse.payload);

        return {
          Authorization: `Bearer ${accessToken}`,
        };
      };

      const authHeaderUserOne = await createAndLoginUser(users.one);

      // Add thread with user 1
      const addThreadResponseUserOne = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: authHeaderUserOne,
        payload: {
          title: 'Thread Title',
          body: 'Thread Body',
        },
      });

      const {
        data: {
          addedThread: {id: threadIdUserOne},
        },
      } = JSON.parse(addThreadResponseUserOne.payload);

      // Add comment with user 1
      const addCommentResponseUserOne = await server.inject({
        method: 'POST',
        url: `/threads/${threadIdUserOne}/comments`,
        headers: authHeaderUserOne,
        payload: {
          content: 'comment to Thread Title',
        },
      });

      const {
        data: {
          addedComment: {id: threadCommentIdUserOne},
        },
      } = JSON.parse(addCommentResponseUserOne.payload);

      const authHeaderUserTwo = await createAndLoginUser(users.two);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadIdUserOne}/comments/${threadCommentIdUserOne}`,
        headers: authHeaderUserTwo,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('anda tidak berhak mengakses resource ini');
    });

    it('should response 404 when there is no thread for the comment to be deleted', async () => {
      // Arrange
      const username = 'monne';
      const password = 'secret';

      const requestPayload = {
        content: 'comment content',
      };

      const server = await createServer(container);

      // Add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {username, password, fullname: 'Itte Monne'},
      });

      // Login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {username, password},
      });

      const {
        data: {accessToken},
      } = JSON.parse(loginResponse.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-xxx/comments/thread-comment-xxx',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('komentar tidak ditemukan');
    });

    it('should response 404 when the comment to be deleted does not exist', async () => {
      // Arrange
      const username = 'monne';
      const password = 'secret';

      const server = await createServer(container);

      // Add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {username, password, fullname: 'Itte Monne'},
      });

      // Login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {username, password},
      });

      // Make auth headers for user
      const {
        data: {accessToken},
      } = JSON.parse(loginResponse.payload);

      const authHeader = {
        Authorization: `Bearer ${accessToken}`,
      };

      // Add thread with
      const addThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: authHeader,
        payload: {
          title: 'Thread Title',
          body: 'Thread Body',
        },
      });

      const {
        data: {
          addedThread: {id: threadId},
        },
      } = JSON.parse(addThreadResponse.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/thread-comment-xxx`,
        headers: authHeader,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('komentar tidak ditemukan');
    });
  });
});
