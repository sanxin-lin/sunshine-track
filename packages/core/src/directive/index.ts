import { DIRECTIVE_NAME } from '@sunshine-track/configs';
import directive from './directive';

export const setupDirective = (Vue: any) => {
  Vue.directive(DIRECTIVE_NAME, directive);
};
