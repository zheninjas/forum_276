import RegisterUser from '../RegisterUser.js';

describe('a RegisterUser entity', () => {
  describe('validate payload', () => {
    it('should throw error when payload did not contain needed property', () => {
      // Arrange
      const payload = {
        username: 'abc',
        password: 'abc',
      };

      // Action and Assert
      expect(() => new RegisterUser(payload)).toThrowError('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
      // Arrange
      const payload = {
        username: 123,
        fullname: true,
        password: 'abc',
      };

      // Action and Assert
      expect(() => new RegisterUser(payload)).toThrowError('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should throw error when username contains more than 50 character', () => {
      // Arrange
      const payload = {
        username: 'SuperDuperExtraUltraLongUsernameTextWithMoreThan50Character',
        fullname: 'Itte Monne',
        password: 'abc',
      };

      // Action and Assert
      expect(() => new RegisterUser(payload)).toThrowError('REGISTER_USER.USERNAME_LIMIT_CHAR');
    });

    it('should throw error when username contains restricted character', () => {
      // Arrange
      const payload = {
        username: 'mon ne',
        fullname: 'monne',
        password: 'abc',
      };

      // Action and Assert
      expect(() => new RegisterUser(payload)).toThrowError('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER');
    });
  });

  it('should create registerUser object correctly', () => {
    // Arrange
    const payload = {
      username: 'monne',
      fullname: 'Itte Monne',
      password: 'abc',
    };

    // Action
    const registerUser = new RegisterUser(payload);

    // Assert
    expect(registerUser).toBeInstanceOf(RegisterUser);
    expect(registerUser.username).toEqual(payload.username);
    expect(registerUser.fullname).toEqual(payload.fullname);
    expect(registerUser.password).toEqual(payload.password);
  });
});
