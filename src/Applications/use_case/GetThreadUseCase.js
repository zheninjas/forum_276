import ThreadDetail from '../../Domains/threads/entities/ThreadDetail.js';
import ThreadCommentDetail from '../../Domains/threads/entities/ThreadCommentDetail.js';
import ThreadCommentReplyDetail from '../../Domains/threads/entities/ThreadCommentReplyDetail.js';

class GetThreadUseCase {
  constructor({threadRepository, threadCommentRepository, threadCommentReplyRepository}) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
    this._threadCommentReplyRepository = threadCommentReplyRepository;
  }

  async execute(useCaseParams) {
    this._validateParams(useCaseParams);

    const {threadId} = useCaseParams;

    await this._threadRepository.verifyThread(threadId);

    const thread = await this._threadRepository.getThread(threadId);
    const threadComments = await this._threadCommentRepository.getComments(threadId);
    const threadCommentIds = threadComments.flatMap(({id}) => id);

    const threadCommentsReplies = await this._threadCommentReplyRepository.getRepliesByCommentIds(threadCommentIds);
    const groupRepliesByCommentId = threadCommentsReplies.reduce((comments, row) => {
      const {thread_comment_id: commentId} = row;

      comments[commentId] = comments[commentId] ?? [];
      comments[commentId].push(new ThreadCommentReplyDetail(row));

      return comments;
    }, {});

    return new ThreadDetail({
      ...thread,
      comments: threadComments.flatMap(
        (comment) =>
          new ThreadCommentDetail({
            ...comment,
            replies: groupRepliesByCommentId[comment.id] ?? [],
          }),
      ),
    });
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
