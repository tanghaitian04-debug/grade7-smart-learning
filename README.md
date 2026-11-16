# 初一智慧课堂
山东邹城七年级学生及家长使用的独立学习辅助工具。课程、答题与复习在浏览器本地运行。参考教材与来源在各科目录页中列出，学校本学年用书待核。

## 开发
使用 Node 22，先运行 npm install，再运行 npm run dev。npm run build 会校验七科的教学字段、题目关联、唯一 ID、答案与选项，再执行 TypeScript 检查及 Vite 生产构建。

## 添加课程
编辑 src/data 下对应学科的 JSON。在 upper 或 lower 的章节 lessons 数组添加知识点，沿用相邻条目的字段。explain 是原创讲解段落，steps 是例题步骤，simple 和 hint 是分层提示，questions 包含题型、选项、答案和解析。选择或判断题的 answer 填完整选项文本；填空题使用单一明确答案。每题和每课使用全站唯一、长期稳定的 ID。公式用一对美元符号包围。各章隶属关系决定了科目、册别和教材依据。录入新教材时同步更新 edition、sources 和对应册目录，避免重用旧 ID 表示不同内容。

## 发布
仓库 Settings → Pages → Source 选择 GitHub Actions。推送 main 后 .github/workflows/deploy.yml 自动安装、校验、构建并部署 dist。资源采用相对路径，页面使用 hash 路由。

## 未来绑定自己的子域名
先在 GitHub 账号 Settings → Pages 验证域名所有权。仓库 Settings → Pages → Custom domain 填入实际子域名，并在域名服务商把该子域的 CNAME 指向 tanghaitian04-debug.github.io（不含路径）。DNS 检查、证书签发完成后启用 Enforce HTTPS。无需改课程或路由。更换域名会改变浏览器存储来源，先在旧网址导出学习记录，再在新网址导入。

## 数据与讲解
无账号、广告、追踪脚本。绑定域名或换设备可通过“我的学习”迁移 JSON。朗读依赖系统语音。Tutor 独立展示预写提示。未来接入模型时通过受控后端调用，密钥只保存在服务端。
