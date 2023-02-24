import InsertThread from '../InsertThread.js';

describe('InsertThread entities', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'Thread Title',
    };

    // Action & Assert
    expect(() => new InsertThread(payload)).toThrowError('INSERT_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 'Thread Title',
      body: 12345,
    };

    // Action & Assert
    expect(() => new InsertThread(payload)).toThrowError('INSERT_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create InsertThread entities correctly', () => {
    // Arrange
    const payload = {
      title: 'Thread Title',
      body: 'Thread Body',
    };

    // Action
    const insertThread = new InsertThread(payload);

    // Assert
    expect(insertThread).toBeInstanceOf(InsertThread);
    expect(insertThread.title).toEqual(payload.title);
    expect(insertThread.body).toEqual(payload.body);
  });
});
