# Swipe 轮播

### 介绍

用于循环播放一组图片或内容。

### 引入

在`app.json`或`index.json`中引入组件，详细介绍见[快速上手](#/quickstart#yin-ru-zu-jian)。

```json
"usingComponents": {
  "van-swipe": "@vant/weapp/swipe/index"
}
```

## 代码演示

### 基础用法

每个 SwipeItem 代表一张轮播卡片，可以通过 `autoplay` 属性设置自动轮播的间隔。

```html
<van-swipe custom-class="my-swipe" :autoplay="3000" indicator-color="white">
  <van-swipe-item>1</van-swipe-item>
  <van-swipe-item>2</van-swipe-item>
  <van-swipe-item>3</van-swipe-item>
  <van-swipe-item>4</van-swipe-item>
</van-swipe>

<style>
  .my-swipe .van-swipe-item {
    color: #fff;
    font-size: 20px;
    line-height: 150px;
    text-align: center;
    background-color: #39a9ed;
  }
</style>
```

## API

### Swipe Props

| 参数             | 说明                     | 类型               | 默认值    |
| ---------------- | ------------------------ | ------------------ | --------- |
| autoplay         | 自动轮播间隔，单位为 ms  | _number \| string_ | -         |
| duration         | 动画时长，单位为 ms      | _number \| string_ | `500`     |
| initial-swipe    | 初始位置索引值           | _number \| string_ | `0`       |
| width            | 滑块宽度，单位为 `px`    | _number \| string_ | `auto`    |
| height           | 滑块高度，单位为 `px`    | _number \| string_ | `auto`    |
| loop             | 是否开启循环播放         | _boolean_          | `true`    |
| show-indicators  | 是否显示指示器           | _boolean_          | `true`    |
| vertical         | 是否为纵向滚动           | _boolean_          | `false`   |
| touchable        | 是否可以通过手势滑动     | _boolean_          | `true`    |
| stop-propagation | 是否阻止滑动事件冒泡     | _boolean_          | `true`    |
| lazy-render      | 是否延迟渲染未展示的轮播 | _boolean_          | `false`   |
| indicator-color  | 指示器颜色               | _string_           | `#1989fa` |

### Swipe Events

| 事件名 | 说明                 | 回调参数            |
| ------ | -------------------- | ------------------- |
| change | 每一页轮播结束后触发 | index, 当前页的索引 |

### SwipeItem Events

| 事件名 | 说明       | 回调参数            |
| ------ | ---------- | ------------------- |
| click  | 点击时触发 | _event: MouseEvent_ |

### Swipe 方法

通过 selectComponent 可以获取到 Area 实例并调用实例方法。

| 方法名 | 说明 | 参数 | 返回值 |
| --- | --- | --- | --- |
| prev | 切换到上一轮播 | - | - |
| next | 切换到下一轮播 | - | - |
| swipeTo | 切换到指定位置 | _index: number, options: SwipeToOptions_ | - |
| resize | 外层元素大小或组件显示状态变化时，可以调用此方法来触发重绘 | - | - |

### SwipeToOptions 格式

| 名称      | 说明         | 类型      |
| --------- | ------------ | --------- |
| immediate | 是否跳过动画 | _boolean_ |

### Swipe Slots

| 名称               | 说明         | 参数                                |
| ------------------ | ------------ | ----------------------------------- |
| default            | 轮播内容     | -                                   |
| indicator | 自定义指示器 | _{ active: number, total: number }_ |

## 主题定制

### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider 组件](#/zh-CN/config-provider)。

| 名称 | 默认值 | 描述 |
| --- | --- | --- |
| --van-swipe-indicator-size | _6px_ | - |
| --van-swipe-indicator-margin | _var(--van-padding-sm)_ | - |
| --van-swipe-indicator-active-opacity | _1_ | - |
| --van-swipe-indicator-inactive-opacity | _0.3_ | - |
| --van-swipe-indicator-active-background-color | _var(--van-primary-color)_ | - |
| --van-swipe-indicator-inactive-background-color | _var(--van-border-color)_ | - |
