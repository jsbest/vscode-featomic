import { WorkspaceFolder, workspace, FileSystemWatcher} from  'vscode';
import { EventEmitter } from 'events';
import * as path from  'path';
import * as fs from  'fs';
import parserMap from './parsers/index';
import { IConfig, ClassNameTipType } from '#types';

export default class Hub extends EventEmitter {

    private configPath:string ='';
    private rootPath:string ='';
    public configWatcher:FileSystemWatcher|undefined;
    public classPalettes :Map<string, ClassNameTipType>[]=[];

    constructor(){
        super();
        const [ rootPath = '' ] = workspace.workspaceFolders || [];
        if (rootPath) {
            const { uri: { fsPath } } = rootPath as WorkspaceFolder;
            this.rootPath = fsPath;
            this.configPath = path.join(this.rootPath, '.ferc.js');
            this._watch();
        }
    }

    /**
     * add a config watcher of '.ferc.js'
     */
    _watch(){
        this.configWatcher = workspace.createFileSystemWatcher(this.configPath);
        this.configWatcher.onDidChange(this._notice);
    }

    /**
     * broadcast the config file changed
     */
    _notice = async ()=>{
        let palettes = await this.getConfig();
        this.emit('update',palettes);
    };

    /**
     * get the absolute path of `.ferc.js`  in current workspace
     * @param configPath
     * @returns
     */
    _getConfigPath(configPath:string){
        const exactPath = path.join(
            this.rootPath,
              (
                configPath.match(/^\./)
                ? ''
                : 'node_modules'
              ),
              configPath,
        );
        if (fs.existsSync(exactPath)) {
            return exactPath;
        }
        throw new Error(`config path ${exactPath} doesn't exists,please check!`);
    }

    public async getConfig(){
        if (!fs.statSync(this.rootPath)) {
            return null;
        }
        try {
            //clear cache to make sure config is latest version
            delete require.cache[require.resolve(this.configPath)];
        } catch (error) {
            console.log(error);
        }
        const config = require(this.configPath);
        const palettes = await this.parseConfig(config);
        return palettes;
    }

    async pipe(key:keyof IConfig,config:IConfig){
        const handler = parserMap.get(key);
        const pathArray = config[key]?.map((item)=>{
            return this._getConfigPath(item);
        });
        const palettes = await handler.parse(handler.format(pathArray));
        return palettes;
    }

    async parseConfig(config:IConfig){

        const provider:any= {};
        const keys = Object.keys(config);
        const paletteArray = await Promise.all(keys.map(async item=>{
            const palettes = await this.pipe(item as keyof IConfig,config);
            return palettes;
        }));

        for(let i=0;i<keys.length;i++){
            provider[keys[i]] = paletteArray[i];
        }

        return provider;
    }
}

