export class TournamentListingDTO {
	id;
	name;
	date;
	price;

	constructor(tournament) {
		this.id = tournament.id;
		this.name = tournament.name;
		this.date = tournament.date;
		this.price = tournament.price;
	}
}
