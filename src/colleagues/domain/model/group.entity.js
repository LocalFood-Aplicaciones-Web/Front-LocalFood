export class Group {
  constructor({ id = null, name, description = '', color = '#FF6B6B', favoriteRestaurants = [], userId = null }) {
    this._id = id;
    this._name = name;
    this._description = description;
    this._color = color;
    this._favoriteRestaurants = favoriteRestaurants;
    this._userId = userId;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get description() {
    return this._description;
  }

  get color() {
    return this._color;
  }

  get favoriteRestaurants() {
    return this._favoriteRestaurants;
  }

  get userId() {
    return this._userId;
  }

  static create(data) {
    return new Group(data);
  }

  toJSON() {
    return {
      id: this._id,
      name: this._name,
      description: this._description,
      color: this._color,
      favoriteRestaurants: this._favoriteRestaurants,
      userId: this._userId
    };
  }
}
