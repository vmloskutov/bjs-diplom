'use strict'

class Profile {
	constructor({
		username,
		name: {firstName, lastName},
		password
	}) {
		this.username = username;
		this.name = {firstName, lastName};
		this.password = password;
	}

	createUser(callback) {
		let username = this.username;
		let firstName = this.name.firstName;
		let lastName = this.name.lastName;
		let password = this.password;

		return ApiConnector.createUser(
		{
            username,
            name: { firstName, lastName },
            password
        },
		(err, data) => {
			console.log(`Creating user ${username}`);
			callback(err, data);
		});
	}

	performLogin(callback) {
		let username = this.username;
		let password = this.password;
		return ApiConnector.performLogin({ username, password }, (err, data) => {
			console.log(`Authorizing user ${username}`);
			callback(err, data);
		})
	}

	addMoney({ currency, amount }, callback) {
		return ApiConnector.addMoney({ currency, amount }, (err, data) => {
			console.log(`Adding ${amount} of ${currency} to ${this.username}`);
			callback(err, data);
		});
	}

	convertMoney({ fromCurrency, targetCurrency, targetAmount }, callback) {
		return ApiConnector.convertMoney({ fromCurrency, targetCurrency, targetAmount }, (err, data) => {
			console.log(`Converting ${fromCurrency} to ${targetAmount} ${targetCurrency}`);
			callback(err, data);
		});
	}

	transferMoney({ to, amount }, callback) {
		return ApiConnector.transferMoney({ to, amount }, (err, data) => {
			console.log(`Transfering ${amount} of Netcoins to ${to}`);
			callback(err, data);
		});
	}
}

function getStocks() {
	return setInterval(ApiConnector.getStocks( (err, data) => {
		if (err) {
			console.log('Failed to get stocks info');
		} else {
			console.log('Getting stocks info');
		}
	}), 1000);
}

getStocks();

function main() {
	const ivan = new Profile({
		username: 'ivan',
		name: { firstName: 'Ivan', lastName: 'Ivanov' },
		password: 'ivanPass'
	});

	const petya = new Profile({
		username: 'petya',
		name: { firstName: 'Petya', lastName: 'Petrov'},
		password: 'petyaPass'
	});

	petya.createUser( (err, data) => {
		if (err) {
			console.log('Failed to create user');
		} else {
			console.log('Petya is created!');
		}
	});

	ivan.createUser( (err, data) => {
		if (err) {
			console.log('Failed to create user');
		} else {
			console.log('Ivan is created!');
			ivan.performLogin( (err, data) => {
				if (err) {
					console.log('Failed to login');
				} else {
					console.log('Ivan is authorized');
					ivan.addMoney({ currency: 'EUR', amount: 500000 }, (err, data) => {
						if (err) {
							console.error('Error during adding money to Ivan');
						} else {
							console.log('Added 500000 euros to Ivan');
							ivan.convertMoney({ fromCurrency: 'EUR', targetCurrency: 'NETCOIN', targetAmount: 36000 }, (err, data) => {
								if (err) {
									console.log('Error during conversion');
								} else {
									console.log('Converted to coins ', { name: {firstName: 'Ivan', lastName: 'Ivanov'}, wallet: {amount: 36000, currency: 'NETCOIN'}, username: 'ivan' });
									ivan.transferMoney({ to: 'petya', amount: 36000 }, (err, data) => {
										if (err) {
											console.log('Failed to transfer 36000 Netcoins');
										} else {
											console.log('Petya has got 36000 Netcoins');
										}
									});
								}
							});
						}
					});
				}
		    });
		}
	});

}

main();
