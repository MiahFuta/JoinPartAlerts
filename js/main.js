let main;

class Main {

    client;

    joined;
    parted;

    run() {

        auth.inspect_url();

    }

    init() {

        this.hide_all();

        this.joined = new Array();
        this.parted = new Array();

        $(document).ready(function () {

            this.client = new tmi.Client({
                options: { 
                    debug: true,
                    skipMembership: false
                },
                identity: {
                    username: `${settings.get('channel_name')}`,
                    password: `oauth:${auth.get_token()}`
                },
                channels: [ `${settings.get('channel_name')}` ]
            });
            
            this.client.connect();
            
            this.client.on('message', (channel, tags, message, self) => {
                if(self) return;
            });

            this.client.on("join", (channel, username, self) => {
                if (username === settings.get('channel_name')) return;
                console.log(`${username} Joined!`);
                if (!main.joined.includes(username)) {
                    main.joined.push(username);
                }
            });

            this.client.on("part", (channel, username, self) => {
                if (username === settings.get('channel_name')) return;
                console.log(`${username} Parted!`);
                if (!main.parted.includes(username)) {
                    main.parted.push(username);
                }
            });

            main.display_alerts();

        });

    }

    is_obs() {

		let agent = navigator.userAgent;

		if (agent.includes('OBS')) return true;
		if (agent.includes('StreamlabsDesktop')) return true;

		return false;

	}

    hide_all() {

        $('#container').css('display', 'none');
        $('#setup-info').css('display', 'none');
        $('html').css('background-color', 'transparent');
        $('body').css('background-color', 'transparent');

    }

    show_all() {

        $('#container').css('display', '');
        $('#setup-info').css('display', '');

    }

    display_alerts() {
        
        var toggle = true;
        var showing = false;
        var times = 0;

        $('#popup-alert').css('display', 'none');

        var interval = setInterval(function() {
            
            if (showing) {

                if (times > 10) {

                    showing = false;
                    times = 0;

                } else {

                    times++;

                }

            } else {

                $('#popup-alert').css('display', 'none');

                if (toggle) {

                    if (main.joined.length !== 0) {
                        main.joined.forEach(username => {

                            times = main.show_alert(username, true, main.joined, 0);

                            showing = true;
                            return;

                        });
                    }
    
                } else {
    
                    if (main.parted.length !== 0) {
                        main.parted.forEach(username => {

                            times = main.show_alert(username, false, main.parted, 5);

                            showing = true;
                            return;

                        });
                    }
    
                }
    
                toggle = !toggle;

            }

        }, 1000);
        
    }

    show_alert(username, joined, list, time) {

        let status = joined ? 'Joined' : 'Left';
        $('#popup-alert').css('display', 'block');
        $('#username').html(`${username} ${status} the Stream!`)

        if (joined) {
            const audio = document.getElementById("join");
            audio.volume = 1;
            audio.play();
        } else {
            const audio = document.getElementById("part");
            audio.volume = 1;
            audio.play();
        }

        if (list.includes(username)) {
            list.splice(list.indexOf(username), 1);
        }

        return time;
    }

}

main = new Main();
main.run();
