import {jest} from '@jest/globals';
import AuthenticationRepository from '../../../Domains/authentications/AuthenticationRepository.js';
import DeleteAuthenticationUseCase from '../DeleteAuthenticationUseCase.js';

describe('DeleteAuthenticationUseCase', () => {
  describe('_validatePayload function', () => {
    it('should throw error if use case payload not contain refresh token', async () => {
      // Arrange
      const useCasePayload = {};
      const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({});

      // Action & Assert
      await expect(deleteAuthenticationUseCase.execute(useCasePayload)).rejects.toThrowError(
        'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_CONTAIN_REFRESH_TOKEN',
      );
    });

    it('should throw error if refresh token not string', async () => {
      // Arrange
      const useCasePayload = {
        refreshToken: 123,
      };

      const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({});

      // Action & Assert
      await expect(deleteAuthenticationUseCase.execute(useCasePayload)).rejects.toThrowError(
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

    mockAuthenticationRepository.checkAvailabilityToken = jest.fn().mockImplementation(() => Promise.resolve());
    mockAuthenticationRepository.deleteToken = jest.fn().mockImplementation(() => Promise.resolve());

    const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({
      authenticationRepository: mockAuthenticationRepository,
    });

    // Action
    await deleteAuthenticationUseCase.execute(useCasePayload);

    // Assert
    expect(mockAuthenticationRepository.checkAvailabilityToken).toHaveBeenCalledWith(refreshToken);
    expect(mockAuthenticationRepository.deleteToken).toHaveBeenCalledWith(refreshToken);
  });
});
