const mysql = require('mysql');
const connection = mysql.createConnection({/* your db config */});

class User {
  static findByEmail(email) {
    // SQL query to find a user by email
  }

  static create(newUser) {
    // SQL query to create a new user
  }
}