Frontend app for [Movie-Notifier](https://www.movie-notifier.com).

Tracker app for the website can be found [here](https://github.com/Xeraphin/torrent_notifier_tracker) and the backend app can be found [here](https://github.com/Xeraphin/torrent_notifier_backend).

-----------------

This app was written in React.js. In order for the app to work, private.key, certificate.crt and ca_bundle.crt files must be present in the root directory. These files are required because the app uses HTTPS protocol.

There is one more file that is not included here. It is the info.json file in the src folder. This file contains the backend address for the app, and all fetch requests are made to that address. The structure for the info.json file is as follows:

    {
        "server_address": "my-backend-address/"
    }

The app is served using Express in the main.js file. A production build can be built with the command "npm run build" and then the main.js file can be run with the command "(sudo) node main.js".

Since the app uses HTTPS protocols, all requests made to http addresses are redirected to https addresses. Also, if "www" is not included in the url, the request is redirected to the same url with "www".