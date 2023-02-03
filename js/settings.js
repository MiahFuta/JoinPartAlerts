var settings;

class Settings {

	storage;

	constructor() {

		this.storage = this.storage_test();

		if (this.storage_enabled()) {
			this.set('client_id', 'yvijf618n141xrvgy5mu0gvedvhblr');
			this.set('required_scopes', JSON.stringify([
				'chat:edit',
				'chat:read'
			]));
			this.set('version', '0.0.1');
			this.set('is_valid', false);
		} else {
			logger.error('You MUST Enable Cookies for this Site to Work Correctly!');
		}
	}

	get(name) {
		if (!this.storage_enabled()) return;
		return localStorage.getItem(name);
	}

	set(name, value) {
		if (!this.storage_enabled()) return;
		localStorage.setItem(name, value);
	}

	delete(name) {
		if (!this.storage_enabled()) return;
		localStorage.removeItem(name);
	}

	storage_test() {
		try {
			localStorage.setItem('test', 'test');
			localStorage.removeItem('test');
			return true;
		} catch (e) {
			return false;
		}
	}

	storage_enabled() {
		return this.storage;
	}

}

settings = new Settings();
