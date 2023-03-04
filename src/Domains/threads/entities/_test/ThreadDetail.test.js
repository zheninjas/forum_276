import ThreadDetail from '../ThreadDetail.js';

describe('ThreadDetail entity', () => {
  describe('_validatePayload function', () => {
    it('should throw error when payload does not contain needed property', () => {
      // Arrange
      const payload = {
        id: 'thread-123',
        title: 'Thread Title',
        body: 'Thread Body',
      };

      // Action & Assert
      expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload not meet data type specification', () => {
      // Arrange
      const payload = {
        id: 'thread-123',
        title: 'Thread Title',
        body: 'Thread Body',
        date: '2023-02-26T07:00:00.800Z',
        username: 'monne',
        comments: {},
      };

      // Action & Assert
      expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
  });

  it('should create ThreadDetail entity correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread Body',
      date: '2023-02-26T07:00:00.800Z',
      username: 'monne',
      comments: [],
    };

    // Action
    const newThread = new ThreadDetail(payload);

    // Assert
    expect(newThread).toBeInstanceOf(ThreadDetail);
    expect(newThread.id).toEqual(payload.id);
    expect(newThread.title).toEqual(payload.title);
    expect(newThread.body).toEqual(payload.body);
    expect(newThread.date).toEqual(payload.date);
    expect(newThread.username).toEqual(payload.username);
    expect(newThread.comments).toEqual(payload.comments);
  });
});
