import {jest} from '@jest/globals';
import bcrypt from 'bcrypt';
import AuthenticationError from '../../../Commons/exceptions/AuthenticationError.js';
import BcryptPasswordHash from '../BcryptPasswordHash.js';

describe('BcryptPasswordHash', () => {
  describe('hash function', () => {
    it('should encrypt password correctly', async () => {
      // Arrange
      const password = 'plain_password';
      const spyHash = jest.spyOn(bcrypt, 'hash');
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      // Action
      const encryptedPassword = await bcryptPasswordHash.hash(password);

      // Assert
      expect(typeof encryptedPassword).toEqual('string');
      expect(encryptedPassword).not.toEqual(password);
      expect(spyHash).toBeCalledWith(password, 10); // saltRound = 10 default untuk BcryptPasswordHash
    });
  });

  describe('comparePassword function', () => {
    it('should throw AuthenticationError if password not match', async () => {
      // Arrange
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      // Action & Assert
      await expect(bcryptPasswordHash.comparePassword('plain_password', 'encrypted_password')).rejects.toThrow(
        AuthenticationError,
      );
    });

    it('should not return AuthenticationError if password match', async () => {
      // Arrange
      const password = 'plain_password';
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);
      const encryptedPassword = await bcryptPasswordHash.hash(password);

      // Action & Assert
      await expect(bcryptPasswordHash.comparePassword(password, encryptedPassword)).resolves.not.toThrow(
        AuthenticationError,
      );
    });
  });
});
