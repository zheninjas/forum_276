import InsertThread from '../../Domains/threads/entities/InsertThread.js';

class AddThreadUseCase {
  constructor({threadRepository}) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, userId) {
    this._validateUserId(userId);

    const insertThread = new InsertThread(useCasePayload);

    return await this._threadRepository.addThread(insertThread, userId);
  }

  _validateUserId(userId) {
    if (!userId) {
      throw new Error('ADD_THREAD_USE_CASE.USER_ID_NOT_FOUND');
    }

    if (typeof userId !== 'string') {
      throw new Error('ADD_THREAD_USE_CASE.WRONG_USER_ID_DATA_TYPE');
    }
  }
}

export default AddThreadUseCase;
