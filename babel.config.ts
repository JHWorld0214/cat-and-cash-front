//@ts-ignore
module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            [
                "module-resolver",
                {
                    alias: {
                        "@app": "./app",
                        "@components": "./components",
                        "@hooks": "./hooks",
                        "@store": "./store",
                        "@services": "./services",
                        "@constants": "./constants",
                    },
                },
            ],
        ],
    };
};