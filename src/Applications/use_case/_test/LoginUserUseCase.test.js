import {jest} from '@jest/globals';
import AuthenticationRepository from '../../../Domains/authentications/AuthenticationRepository.js';
import NewAuth from '../../../Domains/authentications/entities/NewAuth.js';
import UserRepository from '../../../Domains/users/UserRepository.js';
import AuthenticationTokenManager from '../../security/AuthenticationTokenManager.js';
import PasswordHash from '../../security/PasswordHash.js';
import LoginUserUseCase from '../LoginUserUseCase.js';

describe('GetAuthenticationUseCase', () => {
  it('should orchestrating the get authentication action correctly', async () => {
    // Arrange
    const username = 'monne';
    const password = 'secret';
    const userId = 'user-123';
    const encryptedPassword = 'encrypted_password';
    const accessToken = 'access_token';
    const refreshToken = 'refresh_token';

    const useCasePayload = {
      username,
      password,
    };

    const expectedNewAuth = new NewAuth({
      accessToken,
      refreshToken,
    });

    const mockUserRepository = new UserRepository();
    const mockAuthenticationRepository = new AuthenticationRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();
    const mockPasswordHash = new PasswordHash();

    mockUserRepository.getPasswordByUsername = jest.fn().mockImplementation(() => Promise.resolve(encryptedPassword));
    mockPasswordHash.comparePassword = jest.fn().mockImplementation(() => Promise.resolve());
    mockUserRepository.getIdByUsername = jest.fn().mockImplementation(() => Promise.resolve(userId));
    mockAuthenticationTokenManager.createAccessToken = jest.fn().mockImplementation(() => Promise.resolve(accessToken));
    mockAuthenticationTokenManager.createRefreshToken = jest
      .fn()
      .mockImplementation(() => Promise.resolve(refreshToken));

    mockAuthenticationRepository.addToken = jest.fn().mockImplementation(() => Promise.resolve());

    const loginUserUseCase = new LoginUserUseCase({
      userRepository: mockUserRepository,
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
      passwordHash: mockPasswordHash,
    });

    // Action
    const actualAuthentication = await loginUserUseCase.execute(useCasePayload);

    // Assert
    expect(actualAuthentication).toStrictEqual(expectedNewAuth);
    expect(mockUserRepository.getPasswordByUsername).toBeCalledWith(username);
    expect(mockPasswordHash.comparePassword).toBeCalledWith(password, encryptedPassword);
    expect(mockUserRepository.getIdByUsername).toBeCalledWith(username);
    expect(mockAuthenticationTokenManager.createAccessToken).toBeCalledWith({username, id: userId});
    expect(mockAuthenticationTokenManager.createRefreshToken).toBeCalledWith({username, id: userId});
    expect(mockAuthenticationRepository.addToken).toBeCalledWith(refreshToken);
  });
});
