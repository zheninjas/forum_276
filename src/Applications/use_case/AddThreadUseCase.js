import InsertThread from '../../Domains/threads/entities/InsertThread.js';

class AddThreadUseCase {
  constructor({threadRepository}) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, userId) {
    const {title, body} = useCasePayload;
    const insertThread = new InsertThread(title, body, userId);

    return await this._threadRepository.addThread(insertThread);
  }
}

export default AddThreadUseCase;
