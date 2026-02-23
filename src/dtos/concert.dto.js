export class ConcertListingDTO {
	id;
	name;
	date;
	price;

	constructor(concert) {
		this.id = concert.id;
		this.name = concert.name;
		this.date = concert.date;
		this.price = concert.price;
	}
}
