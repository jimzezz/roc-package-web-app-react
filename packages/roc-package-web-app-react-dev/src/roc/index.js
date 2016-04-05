import config from '../config/roc.config.js';
import meta from '../config/roc.config.meta.js';
import builder from '../builder';

import { name } from './util';

export default {
    name,
    config,
    meta,
    actions: {
        webpack: {
            hook: 'build-webpack',
            action: builder
        },
        settings: {
            extension: 'roc',
            hook: 'update-settings',
            action: () => ({ settings }) => () => () => {
                const newSettings = { build: { input: {} } };

                if (!settings.build.input.web) {
                    newSettings.build.input.web = require.resolve('roc-package-web-app-react/default/client');
                }

                if (!settings.build.input.node) {
                    newSettings.build.input.node = require.resolve('roc-package-web-app-react/default/server');
                }

                if (settings.build.resources.length > 0) {
                    const resources = settings.build.resources.map((resource) => {
                        const matches = /^roc-package-web-app-react\/(.*)/.exec(resource);
                        if (matches && matches[1]) {
                            return require.resolve(`roc-package-web-app-react/${matches[1]}`);
                        }

                        return resource;
                    });

                    newSettings.build.resources = resources;
                }

                // If a change has been done we will run the hook
                return newSettings;
            }
        }
    },
    packages: [
        require.resolve('roc-package-web-app-dev'),
        require.resolve('roc-package-web-app-react')
    ],
    plugins: [
        require.resolve('roc-plugin-react-dev')
    ]
};