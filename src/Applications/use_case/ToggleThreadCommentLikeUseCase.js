import ToggleThreadCommentLike from '../../Domains/threads/entities/ToggleThreadCommentLike.js';

class ToggleThreadCommentLikeUseCase {
  constructor({threadRepository, threadCommentRepository, threadCommentLikeRepository}) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
    this._threadCommentLikeRepository = threadCommentLikeRepository;
  }

  async execute(useCaseParams, userId) {
    const {threadId, threadCommentId} = useCaseParams;
    const toggleThreadCommentLike = new ToggleThreadCommentLike(threadId, threadCommentId, userId);

    await this._threadRepository.verifyThread(threadId);
    await this._threadCommentRepository.verifyComment(threadCommentId, threadId);

    const likeId = await this._threadCommentLikeRepository.getLikeId(threadCommentId, userId);

    if (likeId === null) {
      await this._threadCommentLikeRepository.insertLike(toggleThreadCommentLike);
    } else {
      await this._threadCommentLikeRepository.removeLike(likeId);
    }
  }
}

export default ToggleThreadCommentLikeUseCase;
