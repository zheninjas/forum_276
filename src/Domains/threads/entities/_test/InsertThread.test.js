import InsertThread from '../InsertThread.js';

describe('InsertThread entity', () => {
  const title = 'Thread Title';
  const body = 'Thread Body';

  describe('verify data function', () => {
    it('should throw error when title or body does not contain needed property', () => {
      // Action & Assert
      expect(() => new InsertThread(title, null)).toThrowError('INSERT_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
      expect(() => new InsertThread(null, body)).toThrowError('INSERT_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when title or body not meet data type specification', () => {
      // Action & Assert
      expect(() => new InsertThread(title, 123)).toThrowError('INSERT_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
      expect(() => new InsertThread(123, body)).toThrowError('INSERT_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should throw error if userId undefined', async () => {
      // Action & Assert
      expect(() => new InsertThread(title, body, null)).toThrowError('INSERT_THREAD.USER_ID_NOT_FOUND');
    });

    it('should throw error if userId not string', async () => {
      // Action & Assert
      expect(() => new InsertThread(title, body, 123)).toThrowError('INSERT_THREAD.WRONG_USER_ID_DATA_TYPE');
    });
  });

  it('should create InsertThread entity correctly', () => {
    // Arrange
    const userId = 'user-123';

    // Action
    const insertThread = new InsertThread(title, body, userId);

    // Assert
    expect(insertThread).toBeInstanceOf(InsertThread);
    expect(insertThread.title).toEqual(title);
    expect(insertThread.body).toEqual(body);
    expect(insertThread.userId).toEqual(userId);
  });
});
