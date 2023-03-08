/* istanbul ignore file */
import pool from '../src/Infrastructures/database/postgres/pool.js';

const UsersTableTestHelper = {
  async addUser({id = 'user-123', username = 'monne', password = 'secret', fullname = 'Itte Monne'}) {
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4)',
      values: [id, username, password, fullname],
    };

    await pool.query(query);
  },

  async findUsersById(id) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id],
    };

    const {rows} = await pool.query(query);

    return rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE users CASCADE');
  },
};

export default UsersTableTestHelper;
