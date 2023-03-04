class UserCredential {
  constructor(credential) {
    this._validateCredential(credential);

    ({id: this.userId} = credential);
  }

  _validateCredential(credential) {
    const {id} = credential;

    if (!id) {
      throw new Error('USER_CREDENTIAL.NOT_CONTAIN_AUTH_USER_ID');
    }

    if (typeof id !== 'string') {
      throw new Error('USER_CREDENTIAL.AUTH_USER_ID_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default UserCredential;
