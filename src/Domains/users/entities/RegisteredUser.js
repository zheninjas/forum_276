class RegisteredUser {
  constructor(payload) {
    this._validatePayload(payload);

    ({id: this.id, username: this.username, fullname: this.fullname} = payload);
  }

  _validatePayload({id, username, fullname}) {
    if (!id || !username || !fullname) {
      throw new Error('REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof fullname !== 'string') {
      throw new Error('REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default RegisteredUser;
