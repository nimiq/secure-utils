export default class Config {

    /* Public methods */

    static get tld() {
        const tld = window.location.origin.split('.');
        return [tld[tld.length - 2], tld[tld.length - 1]].join('.');
    }

    static set network(network) {
        Config._network = network;
    }

    static get network() {
        if (Config._network) return Config._network;

        switch (Config.tld) {
            case 'nimiq.com': return 'main';
            case 'nimiq-testnet.com': return 'test';
            default: return 'test'; // Set this to 'test', 'bounty', or 'dev' for localhost development
        }
    }

    static origin(subdomain) {
        return Config._origin(subdomain);
    }

    static src(subdomain) {
        return Config._origin(subdomain, true);
    }

    /* Private methods */

    static _origin(subdomain, withPath) {
        if (location.origin.includes('localhost')) return Config._localhost(subdomain, withPath);

        return `https://${subdomain}.${Config.tld}`;
    }

    static _localhost(subdomain, withPath) {
        let path = '';

        if (withPath) {
            if (Config.offlinePackaged) path = '/' + subdomain;
            else {
                switch (subdomain) {
                    case 'keyguard': path = '/libraries/keyguard'; break;
                    case 'network': path = '/libraries/network'; break;
                    case 'safe': path = '/apps/safe'; break;
                }
                if (location.pathname.includes('/dist')) {
                    path += '/dist';
                } else {
                    path += '/src';
                }
            }
        }

        subdomain = Config.offlinePackaged ? '' : subdomain + '.';

        return `${location.protocol}//${subdomain}localhost${location.port ? `:${location.port}` : ''}${path}`;
    }
}

// Signal if the app should be started in offline mode
Config.offline = navigator.onLine !== undefined && !navigator.onLine;

// When packaged as distributed offline app, subdomains are folder names instead
Config.offlinePackaged = false;
