import autoBind from 'auto-bind';
import AddThreadCommentReplyUseCase from '../../../../Applications/use_case/AddThreadCommentReplyUseCase.js';
import AddThreadCommentUseCase from '../../../../Applications/use_case/AddThreadCommentUseCase.js';
import AddThreadUseCase from '../../../../Applications/use_case/AddThreadUseCase.js';
import DeleteThreadCommentUseCase from '../../../../Applications/use_case/DeleteThreadCommentUseCase.js';
import GetThreadUseCase from '../../../../Applications/use_case/GetThreadUseCase.js';

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    autoBind(this);
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute(request.payload, request.auth.credentials);
    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });

    response.code(201);
    return response;
  }

  async getThreadHandler(request, _) {
    const getThreadUseCase = this._container.getInstance(GetThreadUseCase.name);
    const thread = await getThreadUseCase.execute(request.params);

    return {
      status: 'success',
      data: {
        thread,
      },
    };
  }

  async postThreadCommentHandler(request, h) {
    const addThreadCommentUseCase = this._container.getInstance(AddThreadCommentUseCase.name);
    const addedComment = await addThreadCommentUseCase.execute(
      request.payload,
      request.params,
      request.auth.credentials,
    );

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });

    response.code(201);
    return response;
  }

  async deleteThreadCommentHandler(request, _) {
    const deleteThreadCommentUseCase = this._container.getInstance(DeleteThreadCommentUseCase.name);

    await deleteThreadCommentUseCase.execute(request.params, request.auth.credentials);

    return {
      status: 'success',
    };
  }

  async postThreadCommentReplyHandler(request, h) {
    const addThreadCommentReplyUseCase = this._container.getInstance(AddThreadCommentReplyUseCase.name);
    const addedReply = await addThreadCommentReplyUseCase.execute(
      request.payload,
      request.params,
      request.auth.credentials,
    );

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });

    response.code(201);
    return response;
  }
}

export default ThreadsHandler;
