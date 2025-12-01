/**
 * @file restaurant.resource.js
 * @description DTO (Data Transfer Object) for Restaurant API communication
 */

export class RestaurantResource {
  constructor({
    id,
    name,
    cuisine,
    rating,
    priceRange,
    address,
    phone,
    openHours,
    userId
  }) {
    this.id = id;
    this.name = name;
    this.cuisine = cuisine;
    this.rating = rating;
    this.priceRange = priceRange;
    this.address = address;
    this.phone = phone;
    this.openHours = openHours;
    this.userId = userId;
  }

  static fromJson(json) {
    return new RestaurantResource(json);
  }

  toJson() {
    return {
      id: this.id,
      name: this.name,
      cuisine: this.cuisine,
      rating: this.rating,
      priceRange: this.priceRange,
      address: this.address,
      phone: this.phone,
      openHours: this.openHours,
      userId: this.userId
    };
  }
}

