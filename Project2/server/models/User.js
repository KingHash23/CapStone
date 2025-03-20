const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  static async create({ email, password, role, firstName, lastName }) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await db.promise().query(
        'INSERT INTO users (email, password, role, first_name, last_name) VALUES (?, ?, ?, ?, ?)',
        [email, hashedPassword, role, firstName, lastName]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const [rows] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.promise().query('SELECT * FROM users WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async validatePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

module.exports = User; 