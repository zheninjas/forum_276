import {jest} from '@jest/globals';
import AuthenticationRepository from '../../../Domains/authentications/AuthenticationRepository.js';
import LogoutUserUseCase from '../LogoutUserUseCase.js';

describe('LogoutUserUseCase', () => {
  describe('validate payload', () => {
    it('should throw error if use case payload not contain refresh token', async () => {
      // Arrange
      const useCasePayload = {};
      const logoutUserUseCase = new LogoutUserUseCase({});

      // Action & Assert
      await expect(logoutUserUseCase.execute(useCasePayload)).rejects.toThrowError(
        'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_CONTAIN_REFRESH_TOKEN',
      );
    });

    it('should throw error if refresh token not string', async () => {
      // Arrange
      const useCasePayload = {
        refreshToken: 123,
      };

      const logoutUserUseCase = new LogoutUserUseCase({});

      // Action & Assert
      await expect(logoutUserUseCase.execute(useCasePayload)).rejects.toThrowError(
        'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION',
      );
    });
  });

  it('should orchestrating the delete authentication action correctly', async () => {
    // Arrange
    const refreshToken = 'refresh_token';

    const useCasePayload = {
      refreshToken,
    };

    const mockAuthenticationRepository = new AuthenticationRepository();

    mockAuthenticationRepository.checkAvailabilityToken = jest.fn(() => Promise.resolve());
    mockAuthenticationRepository.deleteToken = jest.fn(() => Promise.resolve());

    const logoutUserUseCase = new LogoutUserUseCase({
      authenticationRepository: mockAuthenticationRepository,
    });

    // Action
    await logoutUserUseCase.execute(useCasePayload);

    // Assert
    expect(mockAuthenticationRepository.checkAvailabilityToken).toHaveBeenCalledWith(refreshToken);
    expect(mockAuthenticationRepository.deleteToken).toHaveBeenCalledWith(refreshToken);
  });
});
