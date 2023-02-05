var config;

class Config {

    init() {

        if (!main.is_obs()) {

            $('#title-info').html(`<h3>${document.title}</h3>`);

            let config_info = `<strong>Configure Popup Alert Settings</strong>`;

            config_info += `<div id='spacer'></div>`;

            config_info += `<strong>Border Color:</strong> <input id="border-color" type="color" value="#${settings.get('border')}"><br><br>`;

            config_info += `<strong>Background Color:</strong> <input id="background-color" type="color" value="#${settings.get('background')}"><br><br>`;

            config_info += `<strong>Font Color:</strong> <input id="font-color" type="color" value="#${settings.get('font')}"><br><br>`;

            config_info += `<strong>Enable Sounds:</strong> <input id="toggle-sounds" type="checkbox" ${settings.get('sounds') === 'true' ? 'checked' : ''}>`;

            $('#config-info').html(config_info);

            main.show_all(false);

            config.set_listeners();

        } else {

        }

    }

    set_listeners() {

        $(`input[type='color']`).each(function (index, element) {

            $(`#${element.id}`).on('change', function () {

                config.update_colors(element.id, element.value);
                config.generate_browser_source_url();

            }); 

        });

        $(`#toggle-sounds`).on('change', function () {

            let is_checked = $(this).prop('checked');

            $(this).val(!is_checked);

            settings.set('sounds', is_checked);
            
            config.generate_browser_source_url();

        });

    }

    update_colors(element, value) {

        switch (element) {

            case 'border-color':
                $(`#username`).css('border-color', `${value}`);
                settings.set('border', `${value.replaceAll('#','')}`);
                break;

            case 'background-color':
                $(`#username`).css('background-color', `${value}b3`);
                settings.set('background', `${value.replaceAll('#','')}`);
                break;

            case 'font-color':
                $(`#username`).css('color', `${value}`);
                settings.set('font', `${value.replaceAll('#','')}`);
                break;

            default:
                break;

        }

    }

    generate_browser_source_url() {

        let border = `border=${settings.get('border')}`;
        let background = `background=${settings.get('background')}`;
        let font = `font=${settings.get('font')}`;
        let sounds = `sounds=${settings.get('sounds')}`

        let args = `?${border}&${background}&${font}&${sounds}`

        let browser_url = `${location.protocol}//${location.host}${location.pathname}${args}`;

        let browser_string = `<strong>OBS Browser Source Settings</strong><br><br>`;
        browser_string += `<input id="readOnlyField" type="text" readonly value="${browser_url}"><br><br>`;
        browser_string += `<button onclick="copyToClipboard()">Copy Browser Source URL to Clipboard</button><br><br>`;
        browser_string += `<strong>ENABLE &nbsp &rarr; &nbsp</strong> Shutdown source when not visible.<br><br>`;
        browser_string += `<strong>ENABLE &nbsp &rarr; &nbsp</strong> Refresh browser when scene becomes active.`;

        $('#browser-info').html(browser_string);
    }

    load_args() {

        var params = {};
        var url = new URL(window.location.href);
        var searchParams = new URLSearchParams(url.search);

        let will_reload = false;

        for (var pair of searchParams.entries()) {
            params[pair[0]] = pair[1];
            will_reload = true;
        }

        if (params.border !== undefined) settings.set('border', params.border);
		if (params.background !== undefined) settings.set('background', params.background);
		if (params.font !== undefined) settings.set('font', params.font);
		if (params.sounds !== undefined) settings.set('sounds', params.sounds);

        if (will_reload) location = `${location.protocol}//${location.host}${location.pathname}`;

        config.load_config();

    }

    load_config() {

        $(`#username`).css('border-color', `#${settings.get('border')}`);
        $(`#username`).css('background-color', `#${settings.get('background')}b3`);
        $(`#username`).css('color', `#${settings.get('font')}`);

    }

}

config = new Config();
