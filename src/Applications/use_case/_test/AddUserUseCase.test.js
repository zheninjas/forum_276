import {jest} from '@jest/globals';
import RegisteredUser from '../../../Domains/users/entities/RegisteredUser.js';
import RegisterUser from '../../../Domains/users/entities/RegisterUser.js';
import UserRepository from '../../../Domains/users/UserRepository.js';
import PasswordHash from '../../security/PasswordHash.js';
import AddUserUseCase from '../AddUserUseCase.js';

describe('AddUserUseCase', () => {
  it('should orchestrating the add user action correctly', async () => {
    // Arrange
    const username = 'monne';
    const password = 'secret';
    const fullname = 'Itte Monne';
    const encryptedPassword = 'encrypted_password';
    const registeredUserId = 'user-123';

    const useCasePayload = {
      username,
      password,
      fullname,
    };

    const mockRegisteredUser = new RegisteredUser({
      id: registeredUserId,
      username,
      fullname,
    });

    const expectedRegistedUser = new RegisteredUser({
      id: registeredUserId,
      username,
      fullname,
    });

    const mockUserRepository = new UserRepository();
    const mockPasswordHash = new PasswordHash();

    mockUserRepository.verifyAvailableUsername = jest.fn(() => Promise.resolve());
    mockPasswordHash.hash = jest.fn(() => Promise.resolve(encryptedPassword));
    mockUserRepository.addUser = jest.fn(() => Promise.resolve(mockRegisteredUser));

    const addUserUseCase = new AddUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
    });

    // Action
    const registeredUser = await addUserUseCase.execute(useCasePayload);

    // Assert
    expect(registeredUser).toStrictEqual(expectedRegistedUser);
    expect(mockUserRepository.verifyAvailableUsername).toBeCalledWith(username);
    expect(mockPasswordHash.hash).toBeCalledWith(password);
    expect(mockUserRepository.addUser).toBeCalledWith(
      new RegisterUser({
        username,
        password: encryptedPassword,
        fullname,
      }),
    );
  });
});
