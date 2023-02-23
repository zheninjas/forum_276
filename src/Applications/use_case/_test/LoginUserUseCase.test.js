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
    const useCasePayload = {
      username: 'monne',
      password: 'secret',
    };

    const mockedAuthentication = new NewAuth({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    });

    const mockUserRepository = new UserRepository();
    const mockAuthenticationRepository = new AuthenticationRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();
    const mockPasswordHash = new PasswordHash();

    // Mocking
    mockUserRepository.getPasswordByUsername = jest
      .fn()
      .mockImplementation(() => Promise.resolve('encrypted_password'));

    mockPasswordHash.comparePassword = jest.fn().mockImplementation(() => Promise.resolve());
    mockAuthenticationTokenManager.createAccessToken = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockedAuthentication.accessToken));

    mockAuthenticationTokenManager.createRefreshToken = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockedAuthentication.refreshToken));

    mockUserRepository.getIdByUsername = jest.fn().mockImplementation(() => Promise.resolve('user-123'));
    mockAuthenticationRepository.addToken = jest.fn().mockImplementation(() => Promise.resolve());

    // create use case instance
    const loginUserUseCase = new LoginUserUseCase({
      userRepository: mockUserRepository,
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
      passwordHash: mockPasswordHash,
    });

    // Action
    const actualAuthentication = await loginUserUseCase.execute(useCasePayload);

    // Assert
    expect(actualAuthentication).toEqual(
      new NewAuth({
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      }),
    );

    expect(mockUserRepository.getPasswordByUsername).toBeCalledWith('monne');
    expect(mockPasswordHash.comparePassword).toBeCalledWith('secret', 'encrypted_password');
    expect(mockUserRepository.getIdByUsername).toBeCalledWith('monne');
    expect(mockAuthenticationTokenManager.createAccessToken).toBeCalledWith({username: 'monne', id: 'user-123'});
    expect(mockAuthenticationTokenManager.createRefreshToken).toBeCalledWith({username: 'monne', id: 'user-123'});
    expect(mockAuthenticationRepository.addToken).toBeCalledWith(mockedAuthentication.refreshToken);
  });
});
