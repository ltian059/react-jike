const path = require('path');

module.exports = {
    // webpack 配置
    webpack: {
        // 配置别名：这里是对路径的转换，@ 表示 src 文件所在路径。对于路径的提示，需要在jsconfig.json中配置
        alias: {
            // 约定：使用 @ 表示 src 文件所在路径
            '@': path.resolve(__dirname, 'src'),
        },
    },
    style: {
        sass: {
            loaderOptions: {
                sassOptions: {
                    includePaths: [path.resolve(__dirname, 'src')]
                }
            }
        }
    }
}; 