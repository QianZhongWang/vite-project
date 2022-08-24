import type {UserConfig, ConfigEnv} from 'vite'
import {loadEnv} from 'vite'
import {resolve} from "path";
import {createVitePlugins} from './build/vite/plugin';
import {wrapperEnv} from "./build/utils";


function pathResolve(dir: string) {
    return resolve(process.cwd(), '.', dir)
}

export default ({command, mode}: ConfigEnv): UserConfig => {
    console.log(command)

    const root = process.cwd();

    const env = loadEnv(mode, root);
    // the boolean type read by loadEnv is a string,this function can convert it to boolean
    const viteEnv = wrapperEnv({envConf : env});
    console.log(viteEnv);

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
