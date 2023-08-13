import { __sunshine_track__, getUUID } from '../utils';
import { handleScreen } from './recordscreen';

export default class RecordScreen {
  type!: string;
  recordScreentime = 10; // 默认录屏时长
  recordScreenTypeList: string[] = [
    'error'
  ]; // 录屏事件集合
  // constructor(params = {}) {
  // }
  // setOptions(params: any) {
  // }
  init({ report }: any) {
    // 添加初始的recordScreenId
    __sunshine_track__.recordScreenId = getUUID();
    handleScreen(report, this.recordScreentime);
  }
}
