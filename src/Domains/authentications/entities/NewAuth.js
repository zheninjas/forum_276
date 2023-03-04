class NewAuth {
  constructor(payload) {
    this._validatePayload(payload);

    ({accessToken: this.accessToken, refreshToken: this.refreshToken} = payload);
  }

  _validatePayload(payload) {
    const {accessToken, refreshToken} = payload;

    if (!accessToken || !refreshToken) {
      throw new Error('NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof accessToken !== 'string' || typeof refreshToken !== 'string') {
      throw new Error('NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default NewAuth;
