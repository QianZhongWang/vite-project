import type {UserConfig, ConfigEnv} from 'vite'
import pkg from "./package.json"
import {loadEnv} from 'vite'
import {resolve} from "path";
import {createVitePlugins} from './build/vite/plugin';
import {wrapperEnv} from "./build/utils";
import {createProxy} from "./build/vite/proxy";
import {OUTPUT_DIR} from "./build/constant";

const {dependencies, devDependencies, name, version} = pkg;
const __APP_INFO__ = {
    pkg: {dependencies, devDependencies, name, version},
    // TODO 转换为 `YYYY-MM-DD hh:mm:ss`
    lastBuildTime: new Date().toISOString()
}

function pathResolve(dir: string) {
    return resolve(process.cwd(), '.', dir)
}

export default ({command, mode}: ConfigEnv): UserConfig => {

    const root = process.cwd();

    const env = loadEnv(mode, root);


    // the boolean type read by loadEnv is a string,this function can convert it to boolean
    const viteEnv = wrapperEnv(env);


    const {VITE_PORT, VITE_PUBLIC_PATH, VITE_PROXY, VITE_DROP_CONSOLE} = viteEnv;

    const isBuild = command === 'build';


    return {
        base: VITE_PUBLIC_PATH,
        root,
        resolve: {
            alias: [
                // TODO 添加vue-i8n的别名
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
            host: true,
            port: VITE_PORT,
            proxy: createProxy(VITE_PROXY),
        },
        esbuild: {
            pure: VITE_DROP_CONSOLE ? ['console', 'debugger'] : [],
        },
        build: {
            target: 'es2015',
            cssTarget: 'chrome80',
            outDir: OUTPUT_DIR,
            chunkSizeWarningLimit: 1024 * 2
        },
        define: {
            __APP_INFO__: JSON.stringify(__APP_INFO__),
        },

        // 项目中使用了大量的插件，所以单独抽取出来进行管理
        plugins: createVitePlugins(viteEnv, isBuild)
    }


}
