import autoBind from 'auto-bind';
import AddThreadCommentUseCase from '../../../../Applications/use_case/AddThreadCommentUseCase.js';
import AddThreadUseCase from '../../../../Applications/use_case/AddThreadUseCase.js';
import DeleteThreadCommentUseCase from '../../../../Applications/use_case/DeleteThreadCommentUseCase.js';

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
}

export default ThreadsHandler;
