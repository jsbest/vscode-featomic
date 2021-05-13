"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const events_1 = require("events");
const path = require("path");
const fs = require("fs");
const index_1 = require("./parsers/index");
class Hub extends events_1.EventEmitter {
    constructor() {
        super();
        this.configPath = '';
        this.rootPath = '';
        this.classPalettes = [];
        /**
         * broadcast the config file changed
         */
        this._notice = () => __awaiter(this, void 0, void 0, function* () {
            let palettes = yield this.getConfig();
            this.emit('update', palettes);
        });
        const [rootPath = ''] = vscode_1.workspace.workspaceFolders || [];
        if (rootPath) {
            const { uri: { fsPath } } = rootPath;
            this.rootPath = fsPath;
            this.configPath = path.join(this.rootPath, '.ferc.js');
            this._watch();
        }
    }
    /**
     * add a config watcher of '.ferc.js'
     */
    _watch() {
        this.configWatcher = vscode_1.workspace.createFileSystemWatcher(this.configPath);
        this.configWatcher.onDidChange(this._notice);
    }
    /**
     * get the absolute path of `.ferc.js`  in current workspace
     * @param configPath
     * @returns
     */
    _getConfigPath(configPath) {
        const exactPath = path.join(this.rootPath, (configPath.match(/^\./)
            ? ''
            : 'node_modules'), configPath);
        if (fs.existsSync(exactPath)) {
            return exactPath;
        }
        throw new Error(`config path ${exactPath} doesn't exists,please check!`);
    }
    /**
     * 获取参数
     * @returns
     */
    getConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fs.statSync(this.rootPath)) {
                return null;
            }
            try {
                //clear cache to make sure config is latest version
                delete require.cache[require.resolve(this.configPath)];
            }
            catch (error) {
                console.log(error);
            }
            const config = require(this.configPath);
            const palettes = yield this.parseConfig(config);
            return palettes;
        });
    }
    /**
     * 管道运行
     * @param key
     * @param config
     * @returns
     */
    pipe(key, config) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const handler = index_1.default.get(key);
            const pathArray = (_a = config[key]) === null || _a === void 0 ? void 0 : _a.map((item) => {
                return this._getConfigPath(item);
            });
            const palettes = yield handler.parse(handler.format(pathArray));
            return palettes;
        });
    }
    /**
     * 解析参数
     * @param config
     * @returns
     */
    parseConfig(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = {};
            const keys = Object.keys(config);
            const paletteArray = yield Promise.all(keys.map((item) => __awaiter(this, void 0, void 0, function* () {
                const palettes = yield this.pipe(item, config);
                return palettes;
            })));
            for (let i = 0; i < keys.length; i++) {
                provider[keys[i]] = paletteArray[i];
            }
            return provider;
        });
    }
}
exports.default = Hub;
//# sourceMappingURL=index.js.map