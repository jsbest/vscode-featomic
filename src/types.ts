export type IType = 'js'|'css';

export interface IConfig {
    snippets?:string[],
    classNames:string[]
}

export interface ClassNameTipType {
    hover:any[],
    value:string;
    comment?: string;
}

export interface Snippet {
    prefix:string,
    body:string[],
    content?:string,
    description?:string
}