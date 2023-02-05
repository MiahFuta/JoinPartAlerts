var auth;

class Auth {

	get_client_id() {
		return settings.get('client_id');
	}

	get_token() {
		return settings.get('auth_token');
	}

	is_valid() {
		let valid = settings.get('is_valid');
		return valid === 'true';
	}

	// NOTE Process URL Data
	inspect_url() {

		if (!settings.storage_enabled()) return;

		if (window.location.hash) {

			let reply = window.location.hash.slice(1);
			reply = this.parse_url_hash(reply);

			let scope = reply.scope;

			scope = scope.replaceAll('%3A', ':');
			scope = scope.replaceAll('+', '","');

			let scopes = JSON.parse('["' + scope + '"]');
			let valid = this.verify_scopes(scopes);

			if (valid) {

				let token = reply.access_token;
				this.do_auth_confirmation(token, true);

			} else {

				this.send_relog_message();

			}

		} else {

			let token = this.get_token();

			if (token !== null) {

				this.do_auth_confirmation(token, false);

			} else {

				this.send_relog_message();

			}

		}
	}

	// NOTE Set Client Login Info
	set_login_info(token, json, saving, scopes = '') {

		if (saving) {

			settings.set('auth_token', token);
			console.log('OAuth Token Saved! Reloading...');
			window.location = window.location.href.split('#')[0];

		} else {

			json.scopes.forEach((scope) => {
				scopes += scope + ', ';
			});

			scopes = scopes.substring(0, scopes.length - 2);

			console.log('OAuth Token Successfully Loaded!');
			console.log(`Permissions: ${scopes}`);

			let days = this._seconds_to_days(json.expires_in);
			console.log(`OAuth Token Expires in ${days} days`);

            // DOCS: https://dev.twitch.tv/docs/api/reference/#get-users
            var url = 'https://api.twitch.tv/helix/users?';
            var url_data = 'id=' + json.user_id;

            var reply = twitch.get(url, url_data);

            reply.then((response) => {
				
                if (response['data'] === undefined) return;

                var channel_info = response['data'][0];

                settings.set('display_name', channel_info.display_name);
                settings.set('channel_name', channel_info.login);
                settings.set('channel_id', channel_info.id);

                console.log('Channel Name: ' + settings.get('display_name'));
                console.log('Channel ID: ' + settings.get('channel_id'));

                $(document).ready(function () {
                    main.init();
					config.init();
					config.generate_browser_source_url();
                });

            });
		}
	}

	// NOTE Validate Twitch Auth Information
	async do_auth_confirmation(token, saving) {

		// Docs: https://dev.twitch.tv/docs/authentication
		var response = await fetch('https://id.twitch.tv/oauth2/validate', {
			headers: { Authorization: `OAuth ${token}` },
		}).then((r) => r.json());

		if (response.scopes !== undefined) {
			let valid = this.verify_scopes(response.scopes);
			settings.set('is_valid', valid);
		}

		if (this.is_valid()) {

			this.set_login_info(token, response, saving);

		} else {

			if (this.get_token() !== null) {
				
				auth.do_redirect(false);

			} else {

				let scopes = response.scopes !== undefined ? this._clean_scopes(response.scopes) : 'none';
				let formatted_required = this._clean_scopes(this._get_required_scopes());

				console.log(`Required Scopes: ${formatted_required}`);
				console.log(`Current Scopes: ${scopes}`);

				this.send_relog_message();

			}

		}
	}

	// NOTE URL for Client Auth
	get_redirect_url(force = false, url_scopes = '&scope=') {

		this._get_required_scopes().forEach((scope) => {
			url_scopes += `${scope}+`;
		});

		url_scopes = url_scopes.substring(0, url_scopes.length - 1);

		let browser_url = location.protocol + '//' + location.host + location.pathname;
		let redirect_uri = `&redirect_uri=${browser_url}`;

		let client_id = this.get_client_id();

		let api_endpoint = 'https://id.twitch.tv/oauth2/authorize';
		let api_request = `?response_type=token&client_id=${client_id}`;

		let api_url = api_endpoint + api_request;
		let verify = `&force_verify=${force}`;

		return api_url + url_scopes + redirect_uri + verify;

	}

	// NOTE Verify Scopes Array
	verify_scopes(returned_scopes, flag = true) {

		this._get_required_scopes().forEach((scope) => {

			var has_scope = returned_scopes.includes(scope);
			if (!has_scope) flag = false;

		});

		return flag;

	}

	// NOTE Get URL JSON Data
	parse_url_hash(hash, params = {}) {

		hash.split('&').map((hk) => {

			let temp = hk.split('=');
			params[temp[0]] = temp[1];

		});

		return params;

	}

	// NOTE Redirect to Twitch Auth URL
	do_redirect(force_verify) {

		location.href = this.get_redirect_url(force_verify);
		
	}

	// NOTE Send Relog Link
	send_relog_message() {

        $('#title-info').html(`<h3>${document.title}</h3>`);

		let setup_html = `<strong>Streamer Login Required!</strong><br>`;
		setup_html += `<button id='login-button' onclick="return auth.do_redirect(false);">Click Here to Login to Twitch</button>`;

		let obs_html = `<div id='spacer'></div>`;
		obs_html += `<strong>OBS Browser Source Detected!</strong><br><br>`;
		obs_html += `You will first need to Right Click this Browser Source in your Sources List.<br>`;
		obs_html += `Then Click "Interact" which will allow you to Continue and Login.`;

		if (main.is_obs()) setup_html += obs_html;

        $('#setup-info').html(setup_html);

		main.show_all();

	}

	// NOTE Convery Seconds to Days
	_seconds_to_days(seconds) {
		return Math.floor(Number(seconds) / (3600 * 24));
	}

	// NOTE Get Parsed Scopes
	_get_required_scopes() {
		return JSON.parse(settings.get('required_scopes'));
	}

	// NOTE Clean for Console
	_clean_scopes(scopes) {
		return scopes.toString().replaceAll(',', ', ');
	}

}

auth = new Auth();
