export class UserListingDTO {
	id;
	email;
	role;

	constructor(user) {
		this.id = user.id;
		this.email = user.email;
		this.role = user.role;
	}
}

export class UserDetailsDTO {
	id;
	email;
	role;
	createdAt;
	updatedAt;

	//tickets
	//OrganizedConcerts

	constructor(user) {
		this.id = user.id;
		this.email = user.email;
		this.role = user.role;
		this.createdAt = user.createdAt;
		this.updatedAt = user.updatedAt;
	}
}
