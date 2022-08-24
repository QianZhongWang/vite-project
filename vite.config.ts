import type {UserConfig, ConfigEnv} from 'vite'
import {resolve} from "path";
import {createVitePlugins} from './build/vite/plugin';


function pathResolve(dir: string) {
    return resolve(process.cwd(), '.', dir)
}

export default ({command, mode}: ConfigEnv): UserConfig => {
    console.log('command--', command)
    console.log('mode--', mode)
    const root = process.cwd();
    console.log('root--', root)
    return {
        base: '/',
        root,
        resolve: {
            alias: [
                {
                    find: /\/@\//,
                    replacement: pathResolve('src') + '/',
                },
                {
                    find: /\/#\//,
                    replacement: pathResolve('types') + '/',
                }
            ]
        },
        server: {
            https: false,
            host: false,
            port: 3001,

        },
        // 项目中使用了大量的插件，所以单独抽取出来进行管理
        plugins: createVitePlugins()
    }


}
