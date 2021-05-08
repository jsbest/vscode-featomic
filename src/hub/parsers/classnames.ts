import * as postcss from 'postcss';
import * as fs from  'fs';
import { ClassNameTipType } from '#types';

interface ChildNode extends postcss.Rule {
  selector: string;
  nodes:[postcss.Declaration,postcss.Comment];
}

const parser = async(css:string,path:string):Promise<Map<string, ClassNameTipType>> =>{
    const cssAST: postcss.Result = await postcss().process(css, {
      from: path,
    });
    const classMappings: Map<string, ClassNameTipType> = new Map();
    if (cssAST.root && Array.isArray(cssAST.root.nodes)) {
        cssAST.root.nodes.forEach((childNode) => {
           const { type,selector, nodes } = childNode as ChildNode;
           const prevNode = childNode.prev();
           if( type === 'rule' ){
            const className = selector.replace('.','');
            classMappings.set(className,{
              value:className,
              comment:prevNode && prevNode.type === 'comment'
                     ? prevNode.text: '',
              hover:nodes
            });
           }
        });
      }

    return classMappings;
};


const handler = {
    format(arr:string[]){
      const rawData = arr.map(item=>{
            return {
                path:item,
                content:fs.readFileSync(item,'utf8')
            };
      });
      return rawData;
    },
    async parse(rawData:any[]){
        const palettes = await Promise.all(
            rawData.map(async (item)=>{
                const palette = await parser(item.content,item.path);
                return palette;
            })
        );
        return palettes;
    }
};

export default handler;
