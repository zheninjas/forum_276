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

  it('should translate validate payload at refresh authentication use case error correctly', () => {
    expect(
      DomainErrorTranslator.translate(new Error('REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_CONTAIN_REFRESH_TOKEN')),
    ).toStrictEqual(new InvariantError('harus mengirimkan token refresh'));

    expect(
      DomainErrorTranslator.translate(
        new Error('REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'),
      ),
    ).toStrictEqual(new InvariantError('refresh token harus string'));
  });

  it('should translate validate payload at delete authentication use case error correctly', () => {
    expect(
      DomainErrorTranslator.translate(new Error('DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_CONTAIN_REFRESH_TOKEN')),
    ).toStrictEqual(new InvariantError('harus mengirimkan token refresh'));

    expect(
      DomainErrorTranslator.translate(
        new Error('DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'),
      ),
    ).toStrictEqual(new InvariantError('refresh token harus string'));
  });

  it('should translate insert thread error correctly', () => {
    expect(DomainErrorTranslator.translate(new Error('INSERT_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'))).toStrictEqual(
      new InvariantError('harus mengirimkan title dan body'),
    );

    expect(DomainErrorTranslator.translate(new Error('INSERT_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'))).toStrictEqual(
      new InvariantError('title dan body harus string'),
    );

    expect(DomainErrorTranslator.translate(new Error('INSERT_THREAD.USER_ID_NOT_FOUND'))).toStrictEqual(
      new InvariantError('user id tidak ditemukan'),
    );

    expect(DomainErrorTranslator.translate(new Error('INSERT_THREAD.WRONG_USER_ID_DATA_TYPE'))).toStrictEqual(
      new InvariantError('user id harus berupa string'),
    );
  });

  it('should translate insert thread comment reply error correctly', () => {
    expect(
      DomainErrorTranslator.translate(new Error('INSERT_THREAD_COMMENT_REPLY.PAYLOAD_NOT_CONTAIN_CONTENT')),
    ).toStrictEqual(new InvariantError('harus mengirimkan content'));

    expect(
      DomainErrorTranslator.translate(
        new Error('INSERT_THREAD_COMMENT_REPLY.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'),
      ),
    ).toStrictEqual(new InvariantError('content harus string'));

    expect(
      DomainErrorTranslator.translate(new Error('INSERT_THREAD_COMMENT_REPLY.PARAMS_NOT_CONTAIN_NEEDED_PROPERTY')),
    ).toStrictEqual(new InvariantError('parameter tidak lengkap'));

    expect(
      DomainErrorTranslator.translate(new Error('INSERT_THREAD_COMMENT_REPLY.PARAMS_NOT_MEET_DATA_TYPE_SPECIFICATION')),
    ).toStrictEqual(new InvariantError('parameter harus berupa string'));

    expect(DomainErrorTranslator.translate(new Error('INSERT_THREAD_COMMENT_REPLY.USER_ID_NOT_FOUND'))).toStrictEqual(
      new InvariantError('user id tidak ditemukan'),
    );

    expect(
      DomainErrorTranslator.translate(new Error('INSERT_THREAD_COMMENT_REPLY.WRONG_USER_ID_DATA_TYPE')),
    ).toStrictEqual(new InvariantError('user id harus berupa string'));
  });

  it('should translate insert thread comment error correctly', () => {
    expect(
      DomainErrorTranslator.translate(new Error('INSERT_THREAD_COMMENT.PARAMS_NOT_CONTAIN_THREAD_ID')),
    ).toStrictEqual(new InvariantError('tidak terdapat thread id pada parameter'));

    expect(
      DomainErrorTranslator.translate(new Error('INSERT_THREAD_COMMENT.PARAMS_NOT_MEET_DATA_TYPE_SPECIFICATION')),
    ).toStrictEqual(new InvariantError('thread id harus berupa string'));

    expect(
      DomainErrorTranslator.translate(new Error('INSERT_THREAD_COMMENT.PAYLOAD_NOT_CONTAIN_CONTENT')),
    ).toStrictEqual(new InvariantError('harus mengirimkan content'));

    expect(
      DomainErrorTranslator.translate(new Error('INSERT_THREAD_COMMENT.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION')),
    ).toStrictEqual(new InvariantError('content harus string'));

    expect(DomainErrorTranslator.translate(new Error('INSERT_THREAD_COMMENT.USER_ID_NOT_FOUND'))).toStrictEqual(
      new InvariantError('user id tidak ditemukan'),
    );

    expect(DomainErrorTranslator.translate(new Error('INSERT_THREAD_COMMENT.WRONG_USER_ID_DATA_TYPE'))).toStrictEqual(
      new InvariantError('user id harus berupa string'),
    );
  });

  it('should translate remove thread comment error correctly', () => {
    expect(
      DomainErrorTranslator.translate(new Error('REMOVE_THREAD_COMMENT.PARAMS_NOT_CONTAIN_NEEDED_PROPERTY')),
    ).toStrictEqual(new InvariantError('parameter tidak lengkap'));

    expect(
      DomainErrorTranslator.translate(new Error('REMOVE_THREAD_COMMENT.PARAMS_NOT_MEET_DATA_TYPE_SPECIFICATION')),
    ).toStrictEqual(new InvariantError('parameter harus berupa string'));

    expect(DomainErrorTranslator.translate(new Error('REMOVE_THREAD_COMMENT.USER_ID_NOT_FOUND'))).toStrictEqual(
      new InvariantError('user id tidak ditemukan'),
    );

    expect(DomainErrorTranslator.translate(new Error('REMOVE_THREAD_COMMENT.WRONG_USER_ID_DATA_TYPE'))).toStrictEqual(
      new InvariantError('user id harus berupa string'),
    );
  });

  it('should translate remove thread comment reply error correctly', () => {
    expect(
      DomainErrorTranslator.translate(new Error('REMOVE_THREAD_COMMENT_REPLY.PARAMS_NOT_CONTAIN_NEEDED_PROPERTY')),
    ).toStrictEqual(new InvariantError('parameter tidak lengkap'));

    expect(
      DomainErrorTranslator.translate(new Error('REMOVE_THREAD_COMMENT_REPLY.PARAMS_NOT_MEET_DATA_TYPE_SPECIFICATION')),
    ).toStrictEqual(new InvariantError('parameter harus berupa string'));

    expect(DomainErrorTranslator.translate(new Error('REMOVE_THREAD_COMMENT_REPLY.USER_ID_NOT_FOUND'))).toStrictEqual(
      new InvariantError('user id tidak ditemukan'),
    );

    expect(
      DomainErrorTranslator.translate(new Error('REMOVE_THREAD_COMMENT_REPLY.WRONG_USER_ID_DATA_TYPE')),
    ).toStrictEqual(new InvariantError('user id harus berupa string'));
  });

  it('should translate toggle thread comment like error correctly', () => {
    expect(
      DomainErrorTranslator.translate(new Error('TOGGLE_THREAD_COMMENT_LIKE.PARAMS_NOT_CONTAIN_NEEDED_PROPERTY')),
    ).toStrictEqual(new InvariantError('parameter tidak lengkap'));

    expect(
      DomainErrorTranslator.translate(new Error('TOGGLE_THREAD_COMMENT_LIKE.PARAMS_NOT_MEET_DATA_TYPE_SPECIFICATION')),
    ).toStrictEqual(new InvariantError('parameter harus berupa string'));

    expect(DomainErrorTranslator.translate(new Error('TOGGLE_THREAD_COMMENT_LIKE.USER_ID_NOT_FOUND'))).toStrictEqual(
      new InvariantError('user id tidak ditemukan'),
    );

    expect(
      DomainErrorTranslator.translate(new Error('TOGGLE_THREAD_COMMENT_LIKE.WRONG_USER_ID_DATA_TYPE')),
    ).toStrictEqual(new InvariantError('user id harus berupa string'));
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
