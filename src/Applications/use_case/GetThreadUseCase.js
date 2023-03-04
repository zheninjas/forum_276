class GetThreadUseCase {
  constructor({threadRepository}) {
    this._threadRepository = threadRepository;
  }

  async execute(useCaseParams) {
    this._validateParams(useCaseParams);

    const {threadId} = useCaseParams;

    await this._threadRepository.verifyThread(threadId);

    const threadDetail = await this._threadRepository.getThreadWithComments(threadId);

    threadDetail.comments.map((threadCommentDetail) => {
      if (threadCommentDetail.isDelete) {
        threadCommentDetail.content = '**komentar telah dihapus**';
      }

      threadCommentDetail.replies.map((threadCommentReplyDetail) => {
        if (threadCommentReplyDetail.isDelete) {
          threadCommentReplyDetail.content = '**balasan telah dihapus**';
        }
      });
    });

    return threadDetail;
  }

  _validateParams(params) {
    const {threadId} = params;

    if (!threadId) {
      throw new Error('GET_THREAD_USE_CASE.PARAMS_NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof threadId !== 'string') {
      throw new Error('GET_THREAD_USE_CASE.PARAMS_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default GetThreadUseCase;
