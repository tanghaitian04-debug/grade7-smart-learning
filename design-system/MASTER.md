# 初一智慧课堂 · V1.1 设计系统

## 依据与取舍
UI UX Pro Max 官方源码版本 e59ff376a41f7ca47b7541ad5c116495cbade3ee。使用 Python 运行 scripts/search.py。全站检索词为 digital library reading，结果 Swiss Modernism 2.0；保留阅读网格与层级。教育产品检索 online learning course 匹配 Online Course/E-learning，采用它的真实学习进度与学科入口。页面首要动作为进入学习。以下规范为本项目采用的最终设计。

| 检索域 | 查询 | 采用结果 |
|---|---|---|
| style | minimalism editorial reading | Minimalism & Swiss Style，清晰字阶和对齐 |
| color | school university blue | Research Lab / University Department，深学院蓝 #1E3A5F、交互蓝、浅中性背景 |
| typography | chinese bilingual education | Chinese Simplified；优先本机思源黑体、苹方、微软雅黑。书名与阅读标题用系统宋体 |
| ux | keyboard focus visible / touch target size | 操作有焦点环、主控件至少 44 CSS px、选项至少 48px 高 |
| react | accessible form labels | 原生表单、可见标签及可访问名称 |

## 维护入口
src/design/tokens.css 是运行时颜色、字族、间距、圆角、阴影与动效变量的来源。src/design/subjects.ts 管理学科图标。新增页面先选语义变量，浅色和深色一起验证。进度绿用于掌握和正确反馈，赭红用于错误，须同时写明结果。代码不加载远程字体。KaTeX 继续使用随包字体。

## 字阶与节奏
标题 28–42px，模块标题 20–26px，卡片标题 18px，界面正文 16px，辅助说明 13px。知识点正文默认 18px，可选 16/18/21/24px，行高 1.9，阅读栏最大 820px。中文可自然换行，长英文、公式须在手机宽度测试。主要间距 4/8/12/16/24/32px，控件圆角 8px，卡片 14px，主课卡 20px。

## 组件与响应式
手机按欢迎与搜索、当前课程、进度、学科书架排列。底部四项导航留出安全区。620px 起推荐与进度并列；1000px 起使用桌面侧导航，个人学习中心分栏。1450px 起可用四列学科卡。答题进度读取当前已填写题数，学习进度读取已掌握记录。课程无内容时标出建设状态。
 
正文使用学习目标、重点提示、例题面板与前后翻页。目录采用原生 details/summary；练习保留 radio、fieldset/legend；导入使用原生文件控件。可点击区域具备焦点、按压、选中、禁用状态。全站使用 160ms 的微动效；减少动态效果时关闭动画。真实业务的统计、成绩、存储版本由原业务模块负责。

## 验收
运行 npm run build 与 npm run test:browser。覆盖 iPhone、Android、iPad 竖横屏和桌面，核对焦点跳转、点击区、明暗模式、深链接、上下册、阅读翻页、提交与订正、JSON 迁移。浏览器模拟与实机辅助技术测试分别记录。
