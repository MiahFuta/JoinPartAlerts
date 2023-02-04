let main;

class Main {

    client;
    joined;
    parted;

    run() {

        main.hide_all();
        auth.inspect_url();

    }

    init() {

        main.joined = new Array();
        main.parted = new Array();

        $(document).ready(function () {

            main.client = new tmi.Client({
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
            
            main.client.connect();

            main.client.on("join", (channel, username, self) => {

                if (username === settings.get('channel_name')) return;
                if (!main.joined.includes(username)) main.joined.push(username);

            });

            main.client.on("part", (channel, username, self) => {

                if (username === settings.get('channel_name')) return;
                if (!main.parted.includes(username)) main.parted.push(username);

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
        $('#title-info').css('display', 'none');
        $('#setup-info').css('display', 'none');
        $('html').css('background-color', 'transparent');
        $('body').css('background-color', 'transparent');

    }

    show_all() {

        $('#container').css('display', '');
        $('#title-info').css('display', '');
        $('#setup-info').css('display', '');
        $('html').css('background-color', '#1E1E1E');
        $('body').css('background-color', '#1E1E1E');

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

        let audio = document.getElementById(joined ? "join" : "part");
        
        audio.volume = 1;
        audio.play();

        if (list.includes(username)) list.splice(list.indexOf(username), 1);

        return time;

    }

}

main = new Main();
main.run();
