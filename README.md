## 简介

` sunshine-track ` 应用于前端监控，借鉴了 [web-see](https://github.com/xy-sea/web-see#) 的监控设计。` sunshine-track ` 基于 ` 行为上报 `，实现了 ` 用户行为、错误监控、页面跳转、页面白屏检测、页面性能检测 `等上报功能。适用于 ` Vue、React、Angular ` 等框架

## 功能

` sunshine-track `具备以下功能：

- ✅ 用户行为上报：包括 ` 点击、跳转页面、请求 ` 等
- ✅ 用户手动上报：提供 ` Vue 自定义指令` 以及` add、report `函数，实现用户手动上报
- ✅ 自定义上报：提供 ` 格式化上报数据、自定义上报函数 `等配置项，更灵活地上报数据
- ✅ 请求数据上报：提供 ` 检测请求返回、过滤请求 ` 等配置项，让用户决定上报哪些请求数据
- ✅ 上报方式：提供 ` 上报方式 ` 配置项，用户可选择 ` img、http、beacon ` 三种方式
- ✅ 上报数据缓存：可配置 ` 本地缓存、浏览器本地缓存、IndexedDB ` 三种方式
- ✅ 上报数据阈值：可配置上报数据 ` 阈值 ` ，达到 ` 阈值 ` 后进行上报操作
- ✅ 全局点击上报：可通过配置 ` 选择器、元素文本 `，对全局DOM节点进行点击上报
- ✅ 页面的性能检测，包括 ` 白屏、FP、FCP、LCP、CLS、TTFB、FID ` 等

## 上报数据格式

选项 | 描述 | 类型 |  
| ------ | ----------- |   ----------- |
| uuid   | 上报数据的id |  string | 
| type   | 上报数据的类型 | string | 
| data   | 上报数据 |  any | 
| time   | 上报时间 |  number | 
| status   | 上报状态 |  string | 
| domain   | 当前域名 |  string | 
| href   | 当前网页路径 |  string | 
| userAgent   | 当前user-agent |  string | 
| deviceInfo   | 设备的相关信息 |  string | 

## 安装

```js
// npm
npm i sunshine-track

// yarn
yarn add sunshine-track

// pnpm
pnpm i sunshine-track
```

## 使用

```js
import Track from 'sunshine-track'

const options = {
  projectKey: 'test-project', // 项目的key
  userId: 'digger', // 用户id
  report: {
    url: 'http://example.com/report', // 上报url
    reportType: 'img' // 上报方式
  },
  switchs: { // 上报数据开关
    xhr: true, // xhr请求
    fetch: true, // fetch请求
    error: true, // 报错
    hashchange: true, // hash变化
    history: true, // history变化
    whitescreen: true // 白屏
    performance: true // 页面性能
  },
}

// Vue
app.use(Track, options)

// React、Angular
Track.init(options)
```

### 全局点击监听

可以通过配置` globalClickListeners `来对于某些DOM节点进行点击监听上报

```js
app.use(Track, {
  ...options,
  globalClickListeners: [
    {
      selector: '.cla', // 选择器
      data: 'report data1' // 上报数据
    },
    {
      elementText: 'report2', // 元素文本
      data: 'report data2'
    },
    {
      selector: '.r', // 选择器 + 元素文本
      elementText: 'report3',
      data: 'report data3'
    }
  ] 
})

<button class="cla">report1</button>  click => report data1
<button>report2</button>  click => report data2
<button class="r">report3</button>  click => report data3
```

### 配置上报阈值

上报分为几种：

- 用户行为上报：点击、跳转页面、请求，这些上报数据会缓存着，当达到阈值时再进行上报
- 错误上报：请求报错、代码报错、异步错误，这些是立即上报
- 页面性能上报：白屏、FP、FCP、LCP、CLS、TTFB、FID，这些是立即上报

用户行为上报的阈值默认是 ` 10 `，支持自定义 ` maxEvents `

```js
app.use(Track, {
  ...options,
  maxEvents: 30 // 可自定义阈值
})
```

### 配置缓存方式

如果你想要避免用户重新打开网页之后，造成上报数据的丢失，那么你可以配置缓存方式，通过配置` cacheType `：
- normal：默认，本地缓存
- storage：浏览器 localStorage 本地缓存
- db：浏览器 IndexedDB 本地缓存

```js
app.use(Track, {
  ...options,
  cacheType: 'storage' // 配置缓存方式
})
```

### 打印上报数据

可以通过配置 ` log ` ，开启打印上报数据

```js
app.use(Track, {
  ...options,
  log: true // 开启上报数据打印
})
```

### 灵活上报请求数据

请求也是一种行为，也是需要上报的，或许我们有这个需求

- 过滤：某些请求我们并不想上报
- 自定义校验请求响应数据：每个项目的响应规则可能都不同，我们想自己判断哪些响应是成功，哪些是失败

```js
app.use(Track, {
  ...options,
  filterHttpUrl: (url, method) => { // 过滤url
    return url === 'xxx.com' && method === 'post'
  },
  checkHttpStatus: (data) => { // 判断响应数据是否是成功
    return data.status === 200
  }
})
```

### 格式化上报数据、自定义上报

如果你想在数据上报之前，格式化上报数据的话，可以配置` report `中的` format `

```js
app.use(Track, {
  ...options,
  report: {
    url: 'http://example.com/report',
    reportType: 'img',
    format: (data) => { // 格式化上报数据
      const v = data

      // format v

      return v
    }     
  }
})
```

如果你不想用这个库自带的上报功能，想要自己上报，可以配置` report `中的` customReport `

```js
app.use(Track, {
  ...options,
  report: {
    url: 'http://example.com/report',
    reportType: 'img',
    customReport: (data) => { // 自定义上报
      // custom report
    }     
  }
})
```

### 手动上报

手动上报分为三种：

- 手动添加上报数据：添加到缓存中，等到达到阈值再上报
- 手动执行数据上报：立即上报
- 自定义指令上报：如果你是 Vue 项目，支持指令上报

```js
import Track from 'sunshine-track'

<button @click="addTrack">add</button>
<button @click="reportTrack">report</button>

// 手动添加数据
const addTrack = () => {
  Track.add({
    type: 'click',
    data: 'add track'
  })
}
// 手动上报数据
const reportTrack = () => {
  Track.report({
    type: 'click',
    data: 'report track'
  })
}
```

如果你是 Vue 项目，可以使用指令` v-track `进行上报

```html
// 首次上报
<button v-track="{ type: 'click', data: 'report data' }">add</button>
// 点击上报
<button v-track.click="{ type: 'click', data: 'report data' }">add</button>
```

## 配置参数

选项 | 描述 | 类型 | 默认 |  
| ------ | ----------- |   ----------- |   ----------- |
| ` projectKey `   | 项目key |  ` string ` |   - |
| ` userId `   | 用户id | ` string ` |   - |
| ` report.url `   | 上报url |  ` string ` |   - |
| ` report.reportType `  | 上报方式 |  ` img、http、beacon ` |   ` http ` |
| ` report.headers `  | 上报自定义请求头 |  ` object ` |   - |
| ` report.format `  | 上报数据格式化 |  ` function ` |   - |
| ` report.customReport `  | 自定义上报 |  ` function ` |  - |
| ` cacheType `   | 数据缓存方式 |  ` normal、storage、db ` |   ` normal ` |
| ` globalClickListeners `   | 上报状态 |  ` array ` |   - |
| ` log `   | 当前域名 |  ` boolean ` |   ` false ` |
| ` maxEvents `   | 上报阈值 |  ` number ` |   ` 10 ` |
| ` checkHttpStatus `   | 判断响应数据 |  ` function ` |   - |
| ` filterHttpUrl `   | 过滤上报请求数据 |  ` function ` |   - |
| ` switchs.xhr `   | 是否开启xhr请求上报 |  ` boolean ` |   ` false ` |
| ` switchs.fetch `   | 是否开启fetch请求上报 |  ` boolean ` |   ` false ` |
| ` switchs.error `   | 是否开启错误上报 |  ` boolean ` |   ` false ` |
| ` switchs.whitescreen `   | 是否开启白屏检测上报 |  ` boolean ` |   ` false ` |
| ` switchs.hashchange `   | 是否开启hash变化请求上报 |  ` boolean ` |   ` false ` |
| ` switchs.history `   | 是否开启history变化上报 |  ` boolean ` |   ` false ` |
| ` switchs.performance `   | 是否开启页面性能上报 |  ` boolean ` |   ` false ` |