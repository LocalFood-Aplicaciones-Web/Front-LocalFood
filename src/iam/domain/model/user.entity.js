export class User {
  constructor({ id = null, username, email, password, role = 'user', name }) {
    this._id = id;
    this._username = username;
    this._email = email;
    this._password = password;
    this._role = role;
    this._name = name;
  }

  get id() {
    return this._id;
  }

  get username() {
    return this._username;
  }

  get email() {
    return this._email;
  }

  get password() {
    return this._password;
  }

  get role() {
    return this._role;
  }

  get name() {
    return this._name;
  }

  isAdmin() {
    return this._role === 'admin';
  }

  static create(data) {
    return new User(data);
  }

  toJSON() {
    return {
      id: this._id,
      username: this._username,
      email: this._email,
      role: this._role,
      name: this._name
    };
  }
}
