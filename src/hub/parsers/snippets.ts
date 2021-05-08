import * as fs from 'fs';
import {Snippet} from '#types';

const parser = async (content:any):Promise<Map<string, Snippet>>=>{
    const snippets = Object.keys(content);
    const snippetsMappings: Map<string, Snippet> = new Map();
    snippets.forEach((item)=>{
        const detail = content[item];
        const obj = {
            ...detail,
            content:Array.isArray(detail.body)?detail.body.join('\n'):detail.body
        };
        snippetsMappings.set(item,obj);
    });
    return snippetsMappings;
};


const handler = {
    format(arr:string[]){
      const rawData = arr.map(item=>{
            return {
                path:item,
                content:JSON.parse(fs.readFileSync(item, 'utf8'))
            };
      });
      return rawData;
    },
    async parse(rawData:any[]){
        const palettes = await Promise.all(
            rawData.map(async (item)=>{
                const palette = parser(item.content);
                return palette;
            })
        );
        return palettes;
    }
};

export default handler;