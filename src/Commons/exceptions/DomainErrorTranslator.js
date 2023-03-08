import InvariantError from './InvariantError.js';

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  // RegisterUser entity
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada',
  ),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat membuat user baru karena tipe data tidak sesuai',
  ),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError(
    'tidak dapat membuat user baru karena karakter username melebihi batas limit',
  ),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError(
    'tidak dapat membuat user baru karena username mengandung karakter terlarang',
  ),

  // LoginUser entity
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan username dan password'),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('username dan password harus string'),

  // RefreshAuthenticationUseCase
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_CONTAIN_REFRESH_TOKEN': new InvariantError(
    'harus mengirimkan token refresh',
  ),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'refresh token harus string',
  ),

  // DeleteAuthenticationUseCase
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_CONTAIN_REFRESH_TOKEN': new InvariantError(
    'harus mengirimkan token refresh',
  ),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'refresh token harus string',
  ),

  // InsertThread entity
  'INSERT_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan title dan body'),
  'INSERT_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('title dan body harus string'),
  'INSERT_THREAD.USER_ID_NOT_FOUND': new InvariantError('user id tidak ditemukan'),
  'INSERT_THREAD.WRONG_USER_ID_DATA_TYPE': new InvariantError('user id harus berupa string'),

  // InsertThreadCommentReply entity
  'INSERT_THREAD_COMMENT.PAYLOAD_NOT_CONTAIN_CONTENT': new InvariantError('harus mengirimkan content'),
  'INSERT_THREAD_COMMENT.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('content harus string'),
  'INSERT_THREAD_COMMENT.PARAMS_NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('parameter tidak lengkap'),
  'INSERT_THREAD_COMMENT.PARAMS_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('parameter harus berupa string'),
  'INSERT_THREAD_COMMENT.USER_ID_NOT_FOUND': new InvariantError('user id tidak ditemukan'),
  'INSERT_THREAD_COMMENT.WRONG_USER_ID_DATA_TYPE': new InvariantError('user id harus berupa string'),

  // AddThreadCommentUseCase
  'ADD_THREAD_COMMENT_USE_CASE.PAYLOAD_NOT_CONTAIN_CONTENT': new InvariantError('harus mengirimkan content'),
  'ADD_THREAD_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('content harus string'),

  // AddThreadCommentUseCase params
  'ADD_THREAD_COMMENT_USE_CASE.PARAMS_NOT_CONTAIN_THREAD_ID': new InvariantError(
    'tidak terdapat thread id pada parameter',
  ),
  'ADD_THREAD_COMMENT_USE_CASE.PARAMS_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'thread id harus berupa string',
  ),

  // AddThreadCommentUseCase userId
  'ADD_THREAD_COMMENT_USE_CASE.USER_ID_NOT_FOUND': new InvariantError('user id tidak ditemukan'),
  'ADD_THREAD_COMMENT_USE_CASE.WRONG_USER_ID_DATA_TYPE': new InvariantError('user id harus berupa string'),

  // DeleteThreadCommentUseCase params
  'DELETE_THREAD_COMMENT_USE_CASE.PARAMS_NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('parameter tidak lengkap'),
  'DELETE_THREAD_COMMENT_USE_CASE.PARAMS_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'parameter harus berupa string',
  ),

  // DeleteThreadCommentUseCase userId
  'DELETE_THREAD_COMMENT_USE_CASE.USER_ID_NOT_FOUND': new InvariantError('user id tidak ditemukan'),
  'DELETE_THREAD_COMMENT_USE_CASE.WRONG_USER_ID_DATA_TYPE': new InvariantError('user id harus berupa string'),

  // DeleteThreadCommentReplyUseCase params
  'DELETE_THREAD_COMMENT_REPLY_USE_CASE.PARAMS_NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'parameter tidak lengkap',
  ),
  'DELETE_THREAD_COMMENT_REPLY_USE_CASE.PARAMS_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'parameter harus berupa string',
  ),

  // DeleteThreadCommentReplyUseCase userId
  'DELETE_THREAD_COMMENT_REPLY_USE_CASE.USER_ID_NOT_FOUND': new InvariantError('user id tidak ditemukan'),
  'DELETE_THREAD_COMMENT_REPLY_USE_CASE.WRONG_USER_ID_DATA_TYPE': new InvariantError('user id harus berupa string'),
};

export default DomainErrorTranslator;
