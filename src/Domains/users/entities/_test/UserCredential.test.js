import UserCredential from '../UserCredential.js';

describe('UserCredential entity', () => {
  describe('_validateCredential function', () => {
    it('should throw error when credential does not contain id', () => {
      // Arrange
      const credential = {};

      // Action & Assert
      expect(() => new UserCredential(credential)).toThrowError('USER_CREDENTIAL.NOT_CONTAIN_AUTH_USER_ID');
    });

    it('should throw error when credential id not meet data type specification', () => {
      // Arrange
      const credential = {
        id: 123,
      };

      // Action & Assert
      expect(() => new UserCredential(credential)).toThrowError(
        'USER_CREDENTIAL.AUTH_USER_ID_NOT_MEET_DATA_TYPE_SPECIFICATION',
      );
    });
  });

  it('should create UserCredential entity correctly', () => {
    // Arrange
    const credential = {
      id: 'user-123',
    };

    // Action
    const userCredential = new UserCredential(credential);

    // Assert
    expect(userCredential).toBeInstanceOf(UserCredential);
    expect(userCredential.userId).toEqual(credential.id);
  });
});
