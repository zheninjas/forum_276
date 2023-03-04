import {jest} from '@jest/globals';
import AuthenticationRepository from '../../../Domains/authentications/AuthenticationRepository.js';
import AuthenticationTokenManager from '../../security/AuthenticationTokenManager.js';
import RefreshAuthenticationUseCase from '../RefreshAuthenticationUseCase.js';

describe('RefreshAuthenticationUseCase', () => {
  describe('_validatePayload function', () => {
    it('should throw error if use case payload not contain refresh token', async () => {
      // Arrange
      const useCasePayload = {};
      const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({});

      // Action & Assert
      await expect(refreshAuthenticationUseCase.execute(useCasePayload)).rejects.toThrowError(
        'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_CONTAIN_REFRESH_TOKEN',
      );
    });

    it('should throw error if refresh token not string', async () => {
      // Arrange
      const useCasePayload = {
        refreshToken: 1,
      };

      const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({});

      // Action & Assert
      await expect(refreshAuthenticationUseCase.execute(useCasePayload)).rejects.toThrowError(
        'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION',
      );
    });
  });

  it('should orchestrating the refresh authentication action correctly', async () => {
    // Arrange
    const username = 'monne';
    const userId = 'user-123';
    const refreshToken = 'refresh_token';
    const newRefreshToken = 'new_refresh_token';

    const useCasePayload = {
      refreshToken,
    };

    const mockAuthenticationRepository = new AuthenticationRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    // Mocking
    mockAuthenticationRepository.checkAvailabilityToken = jest.fn().mockImplementation(() => Promise.resolve());
    mockAuthenticationTokenManager.verifyRefreshToken = jest.fn().mockImplementation(() => Promise.resolve());
    mockAuthenticationTokenManager.decodePayload = jest
      .fn()
      .mockImplementation(() => Promise.resolve({username, id: userId}));

    mockAuthenticationTokenManager.createAccessToken = jest
      .fn()
      .mockImplementation(() => Promise.resolve(newRefreshToken));

    // Create the use case instace
    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Action
    const accessToken = await refreshAuthenticationUseCase.execute(useCasePayload);

    // Assert
    expect(accessToken).toEqual(newRefreshToken);
    expect(mockAuthenticationTokenManager.verifyRefreshToken).toBeCalledWith(refreshToken);
    expect(mockAuthenticationRepository.checkAvailabilityToken).toBeCalledWith(refreshToken);
    expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(refreshToken);
    expect(mockAuthenticationTokenManager.createAccessToken).toBeCalledWith({username, id: userId});
  });
});
