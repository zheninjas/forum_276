import {jest} from '@jest/globals';
import bcrypt from 'bcrypt';
import AuthenticationError from '../../../Commons/exceptions/AuthenticationError.js';
import BcryptPasswordHash from '../BcryptPasswordHash.js';

describe('BcryptPasswordHash', () => {
  describe('hash function', () => {
    it('should encrypt password correctly', async () => {
      // Arrange
      const spyHash = jest.spyOn(bcrypt, 'hash');
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      // Action
      const encryptedPassword = await bcryptPasswordHash.hash('plain_password');

      // Assert
      expect(typeof encryptedPassword).toEqual('string');
      expect(encryptedPassword).not.toEqual('plain_password');
      expect(spyHash).toBeCalledWith('plain_password', 10); // saltRound = 10 default untuk BcryptPasswordHash
    });
  });

  describe('comparePassword function', () => {
    it('should throw AuthenticationError if password not match', async () => {
      // Arrange
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      // Act & Assert
      await expect(bcryptPasswordHash.comparePassword('plain_password', 'encrypted_password')).rejects.toThrow(
        AuthenticationError,
      );
    });

    it('should not return AuthenticationError if password match', async () => {
      // Arrange
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);
      const plainPassword = 'secret';
      const encryptedPassword = await bcryptPasswordHash.hash(plainPassword);

      // Act & Assert
      await expect(bcryptPasswordHash.comparePassword(plainPassword, encryptedPassword)).resolves.not.toThrow(
        AuthenticationError,
      );
    });
  });
});
