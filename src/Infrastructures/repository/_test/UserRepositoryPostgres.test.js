import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import InvariantError from '../../../Commons/exceptions/InvariantError.js';
import RegisteredUser from '../../../Domains/users/entities/RegisteredUser.js';
import RegisterUser from '../../../Domains/users/entities/RegisterUser.js';
import pool from '../../database/postgres/pool.js';
import UserRepositoryPostgres from '../UserRepositoryPostgres.js';

describe('UserRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addUser function', () => {
    it('should persist register user and return registered user correctly', async () => {
      // Arrange
      const userId = 'user-123';
      const registerUser = new RegisterUser({
        username: 'monne',
        password: 'secret_password',
        fullname: 'Itte Monne',
      });

      const fakeIdGenerator = () => '123';
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await userRepositoryPostgres.addUser(registerUser);

      // Assert
      const users = await UsersTableTestHelper.findUsersById(userId);

      expect(users).toHaveLength(1);
    });

    it('should return registered user correctly', async () => {
      // Arrange
      const username = 'monne';
      const password = 'secret_password';
      const userId = 'user-123';
      const fullname = 'Itte Monne';

      const registerUser = new RegisterUser({
        username,
        password,
        fullname,
      });

      const fakeIdGenerator = () => '123';
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const registeredUser = await userRepositoryPostgres.addUser(registerUser);

      // Assert
      expect(registeredUser).toStrictEqual(
        new RegisteredUser({
          id: userId,
          username,
          fullname,
        }),
      );
    });
  });

  describe('getPasswordByUsername', () => {
    it('should throw InvariantError when user not found', () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(userRepositoryPostgres.getPasswordByUsername('monne')).rejects.toThrowError(InvariantError);
    });

    it('should return username password when user is found', async () => {
      // Arrange
      const username = 'monne';
      const password = 'secret_password';

      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      await UsersTableTestHelper.addUser({
        username,
        password,
      });

      // Action & Assert
      const fetchedPassword = await userRepositoryPostgres.getPasswordByUsername(username);

      expect(fetchedPassword).toBe(password);
    });
  });

  describe('getIdByUsername', () => {
    it('should throw InvariantError when user not found', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.getIdByUsername('monne')).rejects.toThrowError(InvariantError);
    });

    it('should return user id correctly', async () => {
      // Arrange
      const username = 'monne';
      const userId = 'user-123';

      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      await UsersTableTestHelper.addUser({id: userId, username});

      // Action
      const fetchedUserId = await userRepositoryPostgres.getIdByUsername(username);

      // Assert
      expect(fetchedUserId).toEqual(userId);
    });
  });

  describe('verifyAvailableUsername function', () => {
    it('should throw InvariantError when username not available', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      await UsersTableTestHelper.addUser({username: 'monne'});

      // Action & Assert
      await expect(userRepositoryPostgres.verifyAvailableUsername('monne')).rejects.toThrowError(InvariantError);
    });

    it('should not throw InvariantError when username available', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.verifyAvailableUsername('monne')).resolves.not.toThrowError(InvariantError);
    });
  });
});
