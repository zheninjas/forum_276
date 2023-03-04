class GetThreadUseCase {
  constructor({threadRepository}) {
    this._threadRepository = threadRepository;
  }

  async execute(useCaseParams) {
    this._validateParams(useCaseParams);

    const {threadId} = useCaseParams;

    await this._threadRepository.verifyThread(threadId);

    return await this._threadRepository.getThreadWithComments(threadId);
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
