import AuthenticationsTableTestHelper from '../../../../tests/AuthenticationsTableTestHelper.js';
import ThreadCommentsTableTestHelper from '../../../../tests/ThreadCommentsTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import container from '../../container.js';
import pool from '../../database/postgres/pool.js';
import createServer from '../createServer.js';

describe('/threads endpoint', () => {
  const createUser = async (server, {username, password, fullname}) => {
    // Add user
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {username, password, fullname},
    });
  };

  const loginUser = async (server, {username, password}) => {
    // Login user
    const loginResponse = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {username, password},
    });

    const {
      data: {accessToken},
    } = JSON.parse(loginResponse.payload);

    return {
      Authorization: `Bearer ${accessToken}`,
    };
  };

  const addThread = async (server, authHeader, payload) => {
    // Add thread
    const addThreadResponse = await server.inject({
      method: 'POST',
      url: '/threads',
      headers: authHeader,
      payload: payload,
    });

    const {
      data: {
        addedThread: {id: threadId},
      },
    } = JSON.parse(addThreadResponse.payload);

    return threadId;
  };

  const addComment = async (server, authHeader, {threadId}, payload) => {
    // Add comment
    const addThreadCommentResponse = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments`,
      headers: authHeader,
      payload,
    });

    const {
      data: {
        addedComment: {id: threadCommentId},
      },
    } = JSON.parse(addThreadCommentResponse.payload);

    return threadCommentId;
  };

  const addReply = async (server, authHeader, {threadId, threadCommentId}, payload) => {
    const response = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments/${threadCommentId}/replies`,
      headers: authHeader,
      payload: payload,
    });

    // Assert
    const {
      data: {
        addedReply: {id: threadCommentReplyId},
      },
    } = JSON.parse(response.payload);

    return threadCommentReplyId;
  };

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
      const title = 'Thread Title';
      const body = 'Thread Body';

      const requestPayload = {
        title,
        body,
      };

      const server = await createServer(container);

      // Add user
      await createUser(server, {username, password, fullname: 'Itte Monne'});

      // Login user
      const authHeader = await loginUser(server, {username, password});

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: authHeader,
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

      const requestPayload = {
        title: 'Thread Title',
      };

      const server = await createServer(container);

      // Add user
      await createUser(server, {username, password, fullname: 'Itte Monne'});

      // Login user
      const authHeader = await loginUser(server, {username, password});

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: authHeader,
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

      const requestPayload = {
        title: 'Thread Title',
        body: [123],
      };

      const server = await createServer(container);

      // Add user
      await createUser(server, {username, password, fullname: 'Itte Monne'});

      // Login user
      const authHeader = await loginUser(server, {username, password});

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: authHeader,
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

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and thread with comments', async () => {
      // Arrange
      const username = 'monne';
      const password = 'secret';
      const title = 'Thread Title';
      const body = 'Thread Body';
      const commentContent = 'comment to Thread Title';

      const server = await createServer(container);

      // Add user
      await createUser(server, {username, password, fullname: 'Itte Monne'});

      // Login user
      const authHeader = await loginUser(server, {username, password});

      // Add thread
      const threadId = await addThread(server, authHeader, {title, body});

      // Add comment
      const threadCommentId = await addComment(server, authHeader, {threadId}, {content: commentContent});

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(typeof responseJson.data).toEqual('object');
      expect(typeof responseJson.data.thread).toEqual('object');
      expect(responseJson.data.thread).toMatchObject({
        id: threadId,
        title,
        body,
        date: expect.any(String),
        username,
        comments: expect.any(Array),
      });
      expect(new Date(responseJson.data.thread.date)).toBeInstanceOf(Date);
      expect(responseJson.data.thread.comments).toBeInstanceOf(Array);
      expect(responseJson.data.thread.comments).toHaveLength(1);
      expect(typeof responseJson.data.thread.comments[0]).toEqual('object');
      expect(responseJson.data.thread.comments[0]).toMatchObject({
        id: threadCommentId,
        username,
        date: expect.any(String),
        content: commentContent,
      });
    });

    it('should response 200 and thread with deleted comment', async () => {
      // Arrange
      const username = 'monne';
      const password = 'secret';

      const server = await createServer(container);

      // Add user
      await createUser(server, {username, password, fullname: 'Itte Monne'});

      // Login user
      const authHeader = await loginUser(server, {username, password});

      // Add thread
      const threadId = await addThread(server, authHeader, {title: 'Thread Title', body: 'Thread Body'});

      // Add comment one
      await addComment(server, authHeader, {threadId}, {content: 'comment content one'});

      // Add comment two
      const threadCommentIdTwo = await addComment(server, authHeader, {threadId}, {content: 'comment conten two'});

      // Delete comment two
      await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${threadCommentIdTwo}`,
        headers: authHeader,
      });

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
        headers: authHeader,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread.comments).toBeInstanceOf(Array);
      expect(responseJson.data.thread.comments).toHaveLength(2);
      expect(typeof responseJson.data.thread.comments[1]).toEqual('object');
      expect(responseJson.data.thread.comments[1]).toMatchObject({
        id: threadCommentIdTwo,
        username,
        date: expect.any(String),
        content: '**komentar telah dihapus**',
      });
    });

    it('should resposne 200 and thread with empty comment', async () => {
      // Arrange
      const username = 'monne';
      const password = 'secret';

      const server = await createServer(container);

      // Add user
      await createUser(server, {username, password, fullname: 'Itte Monne'});

      // Login user
      const authHeader = await loginUser(server, {username, password});

      // Add thread
      const threadId = await addThread(server, authHeader, {title: 'Thread Title', body: 'Thread Body'});

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
        headers: authHeader,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread.comments).toBeInstanceOf(Array);
      expect(responseJson.data.thread.comments).toHaveLength(0);
    });

    it('should resposne 404 when thread not exist', async () => {
      // Arrange
      const username = 'monne';
      const password = 'secret';

      const requestPayload = {
        content: 'comment content',
      };

      const server = await createServer(container);

      // Add user
      await createUser(server, {username, password, fullname: 'Itte Monne'});

      // Login user
      const authHeader = await loginUser(server, {username, password});

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-xxx',
        headers: authHeader,
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and new thread comment', async () => {
      // Arrange
      const username = 'monne';
      const password = 'secret';
      const content = 'comment content';

      const requestPayload = {
        content,
      };

      const server = await createServer(container);

      // Add user
      await createUser(server, {username, password, fullname: 'Itte Monne'});

      // Login user
      const authHeader = await loginUser(server, {username, password});

      // Add thread
      const threadId = await addThread(server, authHeader, {title: 'Thread Title', body: 'Thread Body'});

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        headers: authHeader,
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
      const requestPayload = {};

      const server = await createServer(container);

      // Add user
      await createUser(server, {username, password, fullname: 'Itte Monne'});

      // Login user
      const authHeader = await loginUser(server, {username, password});

      // Add thread
      const threadId = await addThread(server, authHeader, {title: 'Thread Title', body: 'Thread Body'});

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        headers: authHeader,
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

      const requestPayload = {
        content: 123,
      };

      const server = await createServer(container);

      // Add user
      await createUser(server, {username, password, fullname: 'Itte Monne'});

      // Login user
      const authHeader = await loginUser(server, {username, password});

      // Add thread
      const threadId = await addThread(server, authHeader, {title: 'Thread Title', body: 'Thread Body'});

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        headers: authHeader,
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

      const requestPayload = {
        content: 'comment content',
      };

      const server = await createServer(container);

      // Add user
      await createUser(server, {username, password, fullname: 'Itte Monne'});

      // Login user
      const authHeader = await loginUser(server, {username, password});

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-xxx/comments',
        headers: authHeader,
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{threadCommentId}', () => {
    it('should response 200 and comment from thread got deleted if user authorized the comment', async () => {
      // Arrange
      const username = 'monne';
      const password = 'secret';

      const server = await createServer(container);

      // Add user
      await createUser(server, {username, password, fullname: 'Itte Monne'});

      // Login user
      const authHeader = await loginUser(server, {username, password});

      // Add thread
      const threadId = await addThread(server, authHeader, {title: 'Thread Title', body: 'Thread Body'});

      // Add comment one
      const threadCommentId = await addComment(server, authHeader, {threadId}, {content: 'comment content'});

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${threadCommentId}`,
        headers: authHeader,
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

      // Add users
      await createUser(server, users.one);
      await createUser(server, users.two);

      // Login users
      const authHeaderUserOne = await loginUser(server, {username: users.one.username, password: users.one.password});
      const authHeaderUserTwo = await loginUser(server, {username: users.two.username, password: users.two.password});

      // Add thread with user one
      const threadIdUserOne = await addThread(server, authHeaderUserOne, {title: 'Thread Title', body: 'Thread Body'});

      // Add comment with user one
      const threadCommentIdUserOne = await addComment(
        server,
        authHeaderUserOne,
        {threadId: threadIdUserOne},
        {content: 'comment content one'},
      );

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

      const server = await createServer(container);

      // Add user
      await createUser(server, {username, password, fullname: 'Itte Monne'});

      // Login user
      const authHeader = await loginUser(server, {username, password});

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-xxx/comments/thread-comment-xxx',
        headers: authHeader,
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
      await createUser(server, {username, password, fullname: 'Itte Monne'});

      // Login user
      const authHeader = await loginUser(server, {username, password});

      // Add thread with
      const threadId = await addThread(server, authHeader, {title: 'Thread Title', body: 'Thread Body'});

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

  describe('when POST /threads/{threadId}/comments/{threadCommentId}/replies', () => {
    it('should response 201 and new thread comment reply', async () => {
      // Arrange
      const username = 'monne';
      const password = 'secret';
      const content = 'reply comment content';

      const repliesPayload = {
        content,
      };

      const server = await createServer(container);

      // Add user
      await createUser(server, {username, password, fullname: 'Itte Monne'});

      // Login user
      const authHeader = await loginUser(server, {username, password});

      // Add thread
      const threadId = await addThread(server, authHeader, {title: 'Thread Title', body: 'Thread Body'});

      // Add comment
      const threadCommentId = await addComment(server, authHeader, {threadId}, {content: 'comment content'});

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${threadCommentId}/replies`,
        headers: authHeader,
        payload: repliesPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(typeof responseJson.data.addedReply).toEqual('object');
      expect(responseJson.data.addedReply).toMatchObject({
        id: expect.any(String),
        content,
        owner: expect.any(String),
      });
    });

    it('should response 400 when add new thread comment reply payload not contain needed property', async () => {
      // Arrange
      const username = 'monne';
      const password = 'secret';
      const replyPayload = {};

      const server = await createServer(container);

      // Add user
      await createUser(server, {username, password, fullname: 'Itte Monne'});

      // Login user
      const authHeader = await loginUser(server, {username, password});

      // Add thread
      const threadId = await addThread(server, authHeader, {title: 'Thread Title', body: 'Thread Body'});

      // Add comment
      const threadCommentId = await addComment(server, authHeader, {threadId}, {content: 'comment content'});

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${threadCommentId}/replies`,
        headers: authHeader,
        payload: replyPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('harus mengirimkan content');
    });

    it('should response 400 when add new thread comment reply payload not meet data type specification', async () => {
      // Arrange
      const username = 'monne';
      const password = 'secret';
      const replyPayload = {
        content: 123,
      };

      const server = await createServer(container);

      // Add user
      await createUser(server, {username, password, fullname: 'Itte Monne'});

      // Login user
      const authHeader = await loginUser(server, {username, password});

      // Add thread
      const threadId = await addThread(server, authHeader, {title: 'Thread Title', body: 'Thread Body'});

      // Add comment
      const threadCommentId = await addComment(server, authHeader, {threadId}, {content: 'comment content'});

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${threadCommentId}/replies`,
        headers: authHeader,
        payload: replyPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('content harus string');
    });

    it('should response 401 when add thread comment reply with invalid access token', async () => {
      // Arrange
      const requestPayload = {
        content: 'reply comment content',
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/thread-comment-123/replies',
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

    it('should response 401 when add thread comment reply with empty access token', async () => {
      // Arrange
      const requestPayload = {
        content: 'reply comment content',
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/thread-comment-123/replies',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toBeDefined();
    });

    it('should response 404 when thread not exist', async () => {
      // Arrange
      const username = 'monne';
      const password = 'secret';
      const content = 'reply comment content';

      const replyPayload = {
        content,
      };

      const server = await createServer(container);

      // Add user
      await createUser(server, {username, password, fullname: 'Itte Monne'});

      // Login user
      const authHeader = await loginUser(server, {username, password});

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/thread-123/comments/thread-comment-123/replies`,
        headers: authHeader,
        payload: replyPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 404 when thread comment not exist', async () => {
      // Arrange
      const username = 'monne';
      const password = 'secret';
      const content = 'reply comment content';

      const replyPayload = {
        content,
      };

      const server = await createServer(container);

      // Add user
      await createUser(server, {username, password, fullname: 'Itte Monne'});

      // Login user
      const authHeader = await loginUser(server, {username, password});

      // Add thread
      const threadId = await addThread(server, authHeader, {title: 'Thread Title', body: 'Thread Body'});

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/thread-comment-xxx/replies`,
        headers: authHeader,
        payload: replyPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('komentar tidak ditemukan');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{threadCommentId}/replies/{threadCommentReplyId}', () => {
    it('should response 200 and reply from thread comment got deleted if user authorized the reply', async () => {
      // Arrange
      const username = 'monne';
      const password = 'secret';

      const server = await createServer(container);

      // Add user
      await createUser(server, {username, password, fullname: 'Itte Monne'});

      // Login user
      const authHeader = await loginUser(server, {username, password});

      // Add thread
      const threadId = await addThread(server, authHeader, {title: 'Thread Title', body: 'Thread Body'});

      // Add comment
      const threadCommentId = await addComment(server, authHeader, {threadId}, {content: 'comment content'});

      // Add reply
      const threadCommentReplyId = await addReply(
        server,
        authHeader,
        {threadId, threadCommentId},
        {content: 'reply comment content'},
      );

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${threadCommentId}/replies/${threadCommentReplyId}`,
        headers: authHeader,
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
        url: '/threads/thread-123/comments/thread-comment-123/replies/thread-comment-reply-123',
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
        url: '/threads/thread-123/comments/thread-comment-123/replies/thread-comment-reply-123',
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

      // Add users
      await createUser(server, users.one);
      await createUser(server, users.two);

      // Login users
      const authHeaderUserOne = await loginUser(server, {username: users.one.username, password: users.one.password});
      const authHeaderUserTwo = await loginUser(server, {username: users.two.username, password: users.two.password});

      // Add thread with user one
      const threadIdUserOne = await addThread(server, authHeaderUserOne, {title: 'Thread Title', body: 'Thread Body'});

      // Add comment with user one
      const threadCommentIdUserOne = await addComment(
        server,
        authHeaderUserOne,
        {threadId: threadIdUserOne},
        {content: 'comment content one'},
      );

      // Add reply with user one
      const threadCommentReplyIdUserOne = await addReply(
        server,
        authHeaderUserOne,
        {threadId: threadIdUserOne, threadCommentId: threadCommentIdUserOne},
        {content: 'reply comment of content one'},
      );

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadIdUserOne}/comments/${threadCommentIdUserOne}/replies/${threadCommentReplyIdUserOne}`,
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

      const server = await createServer(container);

      // Add user
      await createUser(server, {username, password, fullname: 'Itte Monne'});

      // Login user
      const authHeader = await loginUser(server, {username, password});

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-xxx/comments/thread-comment-xxx/replies/thread-comment-reply-xxx',
        headers: authHeader,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 404 when there is no comment for the reply to be deleted', async () => {
      // Arrange
      const username = 'monne';
      const password = 'secret';

      const server = await createServer(container);

      // Add user
      await createUser(server, {username, password, fullname: 'Itte Monne'});

      // Login user
      const authHeader = await loginUser(server, {username, password});

      // Add thread
      const threadId = await addThread(server, authHeader, {title: 'Thread Title', body: 'Thread Body'});

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/thread-comment-xxx/replies/thread-comment-reply-xxx`,
        headers: authHeader,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('komentar tidak ditemukan');
    });

    it('should response 404 when the reply to be deleted does not exist', async () => {
      // Arrange
      const username = 'monne';
      const password = 'secret';

      const server = await createServer(container);

      // Add user
      await createUser(server, {username, password, fullname: 'Itte Monne'});

      // Login user
      const authHeader = await loginUser(server, {username, password});

      // Add thread
      const threadId = await addThread(server, authHeader, {title: 'Thread Title', body: 'Thread Body'});

      // Add comment
      const threadCommentId = await addComment(server, authHeader, {threadId}, {content: 'comment content'});

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${threadCommentId}/replies/thread-comment-reply-xxx`,
        headers: authHeader,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('balasan tidak ditemukan');
    });
  });
});
