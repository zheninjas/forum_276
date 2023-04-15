import autoBind from 'auto-bind';
import AddThreadCommentReplyUseCase from '../../../../Applications/use_case/AddThreadCommentReplyUseCase.js';
import AddThreadCommentUseCase from '../../../../Applications/use_case/AddThreadCommentUseCase.js';
import AddThreadUseCase from '../../../../Applications/use_case/AddThreadUseCase.js';
import DeleteThreadCommentUseCase from '../../../../Applications/use_case/DeleteThreadCommentUseCase.js';
import DeleteThreadCommentReplyUseCase from '../../../../Applications/use_case/DeleteThreadCommentReplyUseCase.js';
import GetThreadUseCase from '../../../../Applications/use_case/GetThreadUseCase.js';
import ToggleThreadCommentLikeUseCase from '../../../../Applications/use_case/ToggleThreadCommentLikeUseCase.js';

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    autoBind(this);
  }

  async postThreadHandler(request, h) {
    const {id: userId} = request.auth.credentials;
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute(request.payload, userId);
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
    const {id: userId} = request.auth.credentials;
    const addThreadCommentUseCase = this._container.getInstance(AddThreadCommentUseCase.name);
    const addedComment = await addThreadCommentUseCase.execute(
      request.payload,
      request.params,
      userId,
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
    const {id: userId} = request.auth.credentials;
    const deleteThreadCommentUseCase = this._container.getInstance(DeleteThreadCommentUseCase.name);

    await deleteThreadCommentUseCase.execute(request.params, userId);

    return {
      status: 'success',
    };
  }

  async postThreadCommentReplyHandler(request, h) {
    const {id: userId} = request.auth.credentials;
    const addThreadCommentReplyUseCase = this._container.getInstance(AddThreadCommentReplyUseCase.name);
    const addedReply = await addThreadCommentReplyUseCase.execute(
      request.payload,
      request.params,
      userId,
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

  async deleteThreadCommentReplyHandler(request, _) {
    const {id: userId} = request.auth.credentials;
    const deleteThreadCommentReplyUseCase = this._container.getInstance(DeleteThreadCommentReplyUseCase.name);

    await deleteThreadCommentReplyUseCase.execute(request.params, userId);

    return {
      status: 'success',
    };
  }

  async putThreadCommentLikeHandler(request, _) {
    const {id: userId} = request.auth.credentials;
    const toggleThreadCommentLikeUseCase = this._container.getInstance(ToggleThreadCommentLikeUseCase.name);

    await toggleThreadCommentLikeUseCase.execute(request.params, userId);

    return {
      status: 'success',
    };
  }
}

export default ThreadsHandler;
