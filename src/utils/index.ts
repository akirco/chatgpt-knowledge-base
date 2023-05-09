import { CreateStyled } from '@emotion/styled';
import type MarkdownIt from 'markdown-it';

export const transientOptions: Parameters<CreateStyled>[1] = {
  shouldForwardProp: (propName: string) => !propName.startsWith('$'),
};

export function preWrapperPlugin(md: MarkdownIt) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const fence = md.renderer.rules.fence!;
  md.renderer.rules.fence = (...args) => {
    const [tokens, idx] = args;
    const token = tokens[idx];

    token.info = token.info.replace(/\[.*\]/, '');

    const lang = extractLang(token.info);

    const rawCode = fence(...args);
    return rawCode.replace(
      '<pre>',
      `<pre style="position: relative"><span class="lang">${lang}</span><button title="Copy Code" class="copy-code"></button>`
    );
  };
}

export function extractTitle(info: string) {
  return info.match(/\[(.*)\]/)?.[1] || extractLang(info) || 'txt';
}

const extractLang = (info: string) => {
  return info.trim().replace(/:(no-)?line-numbers({| |$).*/, '');
};

export function getCurrentDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const second = now.getSeconds();
  return `${year}-${month}-${day} ${hour}-${minute}-${second}`;
}
