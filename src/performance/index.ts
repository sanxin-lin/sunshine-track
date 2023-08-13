import { _global, getTimestamp, on } from '../utils';
// import { getWebVitals, getResource } from './performance';
import { getWebVitals } from './performance';
import { StatusType } from '../types';

export default class WebPerformance {
  constructor({ report }: any) {
    // 获取FCP、LCP、TTFB、FID等指标
    getWebVitals((res: any) => {
      // name指标名称、rating 评级、value数值
      const { name, rating, value } = res;
      report.send({
        type: 'performance',
        category: 'performance',
        status: StatusType.Ok,
        time: getTimestamp(),
        data: {
          name,
          rating,
          value,
        },
      });
    });

    const observer = new PerformanceObserver(list => {
      for (const long of list.getEntries()) {
        // 上报长任务详情
        report.send({
          type: 'performance',
          category: 'longTask',
          data: long,
          time: getTimestamp(),
          status: StatusType.Ok,
        });
      }
    });
    observer.observe({ entryTypes: ['longtask'] });

    on({
      el: _global,
      eventName: 'load',
      event: () => {
        // 上报资源列表
        // report.send({
        //   type: 'performance',
        //   category: 'resourceList',
        //   time: getTimestamp(),
        //   status: StatusType.Ok,
        //   data: getResource(),
        // });

        // 上报内存情况, safari、firefox不支持该属性
        const performance = window.performance as any;
        if ((performance as any).memory) {
          report.send({
            type: 'performance',
            category: 'memory',
            time: getTimestamp(),
            status: StatusType.Ok,
            data: {
              jsHeapSizeLimit: performance.memory && performance.memory.jsHeapSizeLimit,
              totalJSHeapSize: performance.memory && performance.memory.totalJSHeapSize,
              usedJSHeapSize: performance.memory && performance.memory.usedJSHeapSize,
            },
          });
        }
      },
    });
  }
}
