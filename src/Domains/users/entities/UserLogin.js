class UserLogin {
  constructor(payload) {
    this._validatePayload(payload);

    ({username: this.username, password: this.password} = payload);
  }

  _validatePayload(payload) {
    const {username, password} = payload;

    if (!username || !password) {
      throw new Error('USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
      throw new Error('USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default UserLogin;
