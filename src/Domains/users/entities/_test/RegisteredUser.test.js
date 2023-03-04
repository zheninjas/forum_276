import RegisteredUser from '../RegisteredUser.js';

describe('a RegisteredUser entity', () => {
  describe('_validatePayload function', () => {
    it('should throw error when payload did not contain needed property', () => {
      // Arrange
      const payload = {
        username: 'monne',
        fullname: 'Itte Monne',
      };

      // Action and Assert
      expect(() => new RegisteredUser(payload)).toThrowError('REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
      // Arrange
      const payload = {
        id: 123,
        username: 'monne',
        fullname: {},
      };

      // Action and Assert
      expect(() => new RegisteredUser(payload)).toThrowError('REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
  });

  it('should create registeredUser object correctly', () => {
    // Arrange
    const payload = {
      id: 'user-123',
      username: 'monne',
      fullname: 'Itte Monne',
    };

    // Action
    const registeredUser = new RegisteredUser(payload);

    // Assert
    expect(registeredUser).toBeInstanceOf(RegisteredUser);
    expect(registeredUser.id).toEqual(payload.id);
    expect(registeredUser.username).toEqual(payload.username);
    expect(registeredUser.fullname).toEqual(payload.fullname);
  });
});
