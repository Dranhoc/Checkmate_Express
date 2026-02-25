export class UserListingDTO {
	id;
	email;
	isAdmin;

	constructor(user) {
		this.id = user.id;
		this.email = user.email;
		this.isAdmin = user.isAdmin;
	}
}

export class UserDetailsDTO {
	id;
	email;
	isAdmin;
	birthDate;
	createdAt;
	updatedAt;

	constructor(user) {
		this.id = user.id;
		this.email = user.email;
		this.birthDate = user.birthDate;
		this.isAdmin = user.isAdmin;
		this.createdAt = user.createdAt;
		this.updatedAt = user.updatedAt;
	}
}
