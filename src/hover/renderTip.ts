
import { MarkdownString } from 'vscode';
import { ClassNameTipType } from '#types';

export default (tip: ClassNameTipType): MarkdownString => {
  let markdown = `##### ${tip.comment}\n\`\`\`css\n.${tip.value}{`;
  tip.hover.forEach(item=>{
    markdown += `\n ${item.prop}:${item.value};`;
  });
  markdown += `\n}\n \`\`\``;
  return new MarkdownString(markdown);
};
