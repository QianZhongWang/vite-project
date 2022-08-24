import {PluginOption} from "vite";
import vue from '@vitejs/plugin-vue'


export function createVitePlugins() {

    const vitePlugins: (PluginOption | PluginOption[])[] = [
        vue()
    ];
    return vitePlugins;
}
