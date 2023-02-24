import autoBind from 'auto-bind';
import AddThreadUseCase from '../../../../Applications/use_case/AddThreadUseCase.js';
import AddThreadCommentUseCase from '../../../../Applications/use_case/AddThreadCommentUseCase.js';

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
}

export default ThreadsHandler;
