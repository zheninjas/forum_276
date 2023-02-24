import InsertThread from '../../Domains/threads/entities/InsertThread.js';
import UserCredential from '../../Domains/users/entities/UserCredential.js';

class AddThreadUseCase {
  constructor({threadRepository}) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, userAuthCredential) {
    const {userId} = new UserCredential(userAuthCredential);
    const insertThread = new InsertThread(useCasePayload);

    return await this._threadRepository.addThread(insertThread, userId);
  }
}

export default AddThreadUseCase;
