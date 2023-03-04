import DomainErrorTranslator from '../DomainErrorTranslator.js';
import InvariantError from '../InvariantError.js';

describe('DomainErrorTranslator', () => {
  it('should translate register user error correctly', () => {
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY'))).toStrictEqual(
      new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
    );

    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION'))).toStrictEqual(
      new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
    );

    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.USERNAME_LIMIT_CHAR'))).toStrictEqual(
      new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
    );

    expect(
      DomainErrorTranslator.translate(new Error('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER')),
    ).toStrictEqual(new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'));
  });

  it('should translate login user error correctly', () => {
    expect(DomainErrorTranslator.translate(new Error('USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY'))).toStrictEqual(
      new InvariantError('harus mengirimkan username dan password'),
    );

    expect(DomainErrorTranslator.translate(new Error('USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION'))).toStrictEqual(
      new InvariantError('username dan password harus string'),
    );
  });

  it('should translate verify payload at refresh authentication use case error correctly', () => {
    expect(
      DomainErrorTranslator.translate(new Error('REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN')),
    ).toStrictEqual(new InvariantError('harus mengirimkan token refresh'));

    expect(
      DomainErrorTranslator.translate(
        new Error('REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'),
      ),
    ).toStrictEqual(new InvariantError('refresh token harus string'));
  });

  it('should translate verify payload at delete authentication use case error correctly', () => {
    expect(
      DomainErrorTranslator.translate(new Error('DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN')),
    ).toStrictEqual(new InvariantError('harus mengirimkan token refresh'));

    expect(
      DomainErrorTranslator.translate(
        new Error('DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'),
      ),
    ).toStrictEqual(new InvariantError('refresh token harus string'));
  });

  it('should translate user auth credential error correctly', () => {
    expect(DomainErrorTranslator.translate(new Error('USER_CREDENTIAL.NOT_CONTAIN_AUTH_USER_ID'))).toStrictEqual(
      new InvariantError('autentikasi user tidak ditemukan'),
    );

    expect(
      DomainErrorTranslator.translate(new Error('USER_CREDENTIAL.AUTH_USER_ID_NOT_MEET_DATA_TYPE_SPECIFICATION')),
    ).toStrictEqual(new InvariantError('format autentikasi user tidak sesuai'));
  });

  it('should translate insert thread error correctly', () => {
    expect(DomainErrorTranslator.translate(new Error('INSERT_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'))).toStrictEqual(
      new InvariantError('harus mengirimkan title dan body'),
    );

    expect(DomainErrorTranslator.translate(new Error('INSERT_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'))).toStrictEqual(
      new InvariantError('title dan body harus string'),
    );
  });

  it('should translate verify payload and params error at add thread comment use case correctly', () => {
    expect(
      DomainErrorTranslator.translate(new Error('ADD_THREAD_COMMENT_USE_CASE.PAYLOAD_NOT_CONTAIN_CONTENT')),
    ).toStrictEqual(new InvariantError('harus mengirimkan content'));

    expect(
      DomainErrorTranslator.translate(
        new Error('ADD_THREAD_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'),
      ),
    ).toStrictEqual(new InvariantError('content harus string'));

    expect(
      DomainErrorTranslator.translate(new Error('ADD_THREAD_COMMENT_USE_CASE.PARAMS_NOT_CONTAIN_THREAD_ID')),
    ).toStrictEqual(new InvariantError('tidak terdapat thread id pada parameter'));

    expect(
      DomainErrorTranslator.translate(new Error('ADD_THREAD_COMMENT_USE_CASE.PARAMS_NOT_MEET_DATA_TYPE_SPECIFICATION')),
    ).toStrictEqual(new InvariantError('thread id harus berupa string'));
  });

  it('should translate verify params error at delete thread comment use case correctly', () => {
    expect(
      DomainErrorTranslator.translate(new Error('DELETE_THREAD_COMMENT_USE_CASE.PARAMS_NOT_CONTAIN_NEEDED_PROPERTY')),
    ).toStrictEqual(new InvariantError('parameter tidak lengkap'));

    expect(
      DomainErrorTranslator.translate(
        new Error('DELETE_THREAD_COMMENT_USE_CASE.PARAMS_NOT_MEET_DATA_TYPE_SPECIFICATION'),
      ),
    ).toStrictEqual(new InvariantError('parameter harus berupa string'));
  });

  it('should translate verify payload and params error at add thread comment reply use case correctly', () => {
    expect(
      DomainErrorTranslator.translate(new Error('ADD_THREAD_COMMENT_REPLY_USE_CASE.PAYLOAD_NOT_CONTAIN_CONTENT')),
    ).toStrictEqual(new InvariantError('harus mengirimkan content'));

    expect(
      DomainErrorTranslator.translate(
        new Error('ADD_THREAD_COMMENT_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'),
      ),
    ).toStrictEqual(new InvariantError('content harus string'));

    expect(
      DomainErrorTranslator.translate(
        new Error('ADD_THREAD_COMMENT_REPLY_USE_CASE.PARAMS_NOT_CONTAIN_NEEDED_PROPERTY'),
      ),
    ).toStrictEqual(new InvariantError('parameter tidak lengkap'));

    expect(
      DomainErrorTranslator.translate(
        new Error('ADD_THREAD_COMMENT_REPLY_USE_CASE.PARAMS_NOT_MEET_DATA_TYPE_SPECIFICATION'),
      ),
    ).toStrictEqual(new InvariantError('parameter harus berupa string'));
  });

  it('should translate verify params error at delete thread comment reply use case correctly', () => {
    expect(
      DomainErrorTranslator.translate(
        new Error('DELETE_THREAD_COMMENT_REPLY_USE_CASE.PARAMS_NOT_CONTAIN_NEEDED_PROPERTY'),
      ),
    ).toStrictEqual(new InvariantError('parameter tidak lengkap'));

    expect(
      DomainErrorTranslator.translate(
        new Error('DELETE_THREAD_COMMENT_REPLY_USE_CASE.PARAMS_NOT_MEET_DATA_TYPE_SPECIFICATION'),
      ),
    ).toStrictEqual(new InvariantError('parameter harus berupa string'));
  });

  it('should return original error when error message is not needed to translate', () => {
    // Arrange
    const error = new Error('some_error_message');

    // Action
    const translatedError = DomainErrorTranslator.translate(error);

    // Assert
    expect(translatedError).toStrictEqual(error);
  });
});
