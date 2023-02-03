var twitch;

class Twitch {
    
    async get(url, url_data) {
		return await fetch(url + url_data, {
			headers: this.get_headers(),
		})
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            return json;
        })
        .catch((error) => {
            this.send_error(error);
        });
	}

    async patch(url, url_data, data) {
		return await fetch(url + url_data, {
			method: 'PATCH',
			headers: this.get_json_headers(),
            body: data,
		})
        .then((response) => {
            return response;
        })
        .catch((error) => {
            this.send_error(error);
        });
	}

	async post(url, url_data) {
		return await fetch(url + url_data, {
			method: 'POST',
			headers: this.get_headers(),
		})
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            return json;
        })
        .catch((error) => {
            this.send_error(error);
        });
	}

    async post_body(url, url_data, body_array) {
		return await fetch(url + url_data, {
			method: 'POST',
			headers: this.get_json_headers(),
			body: body_array,
		})
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            return json;
        })
        .catch((error) => {
            this.send_error(error);
        });
	}

    get_headers() {
        return {
            'Authorization': `Bearer ${auth.get_token()}`,
            'Client-Id': auth.get_client_id(),
        };
    }

    get_json_headers() {
        return {
            'Authorization': `Bearer ${auth.get_token()}`,
            'Client-Id': auth.get_client_id(),
            'Content-Type': 'application/json',
        };
    }

    send_error(error) {
        console.log(error);
    }
}

twitch = new Twitch();
