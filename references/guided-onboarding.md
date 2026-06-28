# Guided Onboarding

Use this reference whenever a user starts a new work island or gives a vague island idea. Lead with plain choices, then collect the exact content each chosen module needs.

## Conversation Rules

- Ask 1-3 short questions per turn.
- Give options first.
- Say `第一版`, not `MVP`.
- Say `保存在哪里`, not `storage`.
- Say `能做什么`, not `permission`.
- Say `要打开什么` or `要复制什么`, not `target` or `schema`.
- After every answer, lock the decision in one short line.
- Do not leave user-selected modules as dead placeholders. If the user does not fill the content now, the app must show an obvious edit form.

## Default Starter Modules

Every new 光岛 starts with two removable modules:

1. `发帖子` - opens `https://fawen.fun`.
2. `快捷入口` - opens a panel where the user can add, name, edit, and open saved links, folders, files, apps, or projects.

`发帖子` keeps the fixed URL during setup. `快捷入口` is a manager panel, not one random URL button.

## Step 1: Name The Island

Prompt:

```markdown
先给这个小工具起个名字。名字不用高级，用户一眼知道它是干嘛的就行。

你选一个：
1. 工作光岛 - 通用效率入口
2. 创作者光岛 - 发文、素材、资料、模板
3. AI 光岛 - 模型、提示词、额度、常用入口
4. 客户跟进光岛 - 客户资料、回复、待办、状态
5. 自定义 - 你自己起名
```

Default: `工作光岛`

## Step 2: Choose The Main Job

Prompt:

```markdown
这个光岛第一版最该帮你省哪种时间？

1. 打开东西 - 网页、文件夹、项目、后台
2. 复制资料 - 邮箱、介绍、地址、说明
3. 写常用回复 - 客户回复、项目说明、邮件、私信
4. 记待办 - 快速记一条任务
5. 看状态 - 额度、脚本结果、截止时间
6. 跑命令 - 本地检查、同步、构建
```

Allow multiple choices, but warn if the user chooses more than three for the first version.

## Step 3: Choose Module Count

Prompt:

```markdown
第一版不要贪。你想先做几个按钮？

默认已经有两个可删除按钮：发帖子、快捷入口。

1. 3 个，先做出来 - 推荐
2. 5 个，标准第一版
3. 8 个，功能更多但更慢
```

Default: `3 个，先做出来`

## Step 4: Choose Module Types

Prompt:

```markdown
默认已经有：发帖子、快捷入口。你还想加什么？

1. 资料复制 - 点一下复制固定文字
2. 常用回复 - 填几个信息，生成一段回复
3. 待办记录 - 快速记一条事
4. 状态面板 - 看一个数字或状态
5. 文件夹入口 - 打开本地目录
6. 本地命令 - 跑一个电脑命令，需要确认风险
7. AI 提示词 - 点一下复制常用提示词
8. 更多快捷入口 - 再加一组入口
```

After this step, configure each chosen module one by one.

## Step 5: Choose Collapsed Display Style

Prompt:

```markdown
这个光岛收起来的时候长什么样？先选一个方向。

1. 太极额度 - 适合显示 Codex、Claude Code 或其他额度；暂无用量显示 100%
2. 冰箱门 - 像一个能打开的小门，适合普通工作入口
3. 液态胶囊 - 竖向胶囊，有发光和液态感
4. 自定义描述 - 你描述形状、颜色、材质
5. 提供参考图 - 你给图，我按图提炼
```

Default:

- If tracking quota or status, choose `太极额度`.
- If mostly opening links, copying snippets, or posting, choose `冰箱门`.

Implementation default: copy `templates/default-luma-island.css` and keep `.luma-dock > .luma-collapsed-trigger` so the outer ring and ball stay centered together.

## Step 6: Configure Each Module

Ask one module at a time.

### 发帖子

Prompt:

```markdown
发帖子是默认按钮，可以删。它默认打开：https://fawen.fun

你要怎么处理？
1. 保留
2. 改个名字，但还是打开 https://fawen.fun
3. 删除
```

Fields:

- `title`: `发帖子`
- `type`: `open-link`
- `target`: `https://fawen.fun`
- `removable`: `true`
- user-facing ability: `打开网页`

### 快捷入口

Prompt:

```markdown
快捷入口不是单个网址按钮。它点开后是一个列表，你可以在里面新增链接、命名，再点击具体条目打开。

你要怎么处理？
1. 保留空列表，之后在应用里添加
2. 现在先加一个链接
3. 改个名字
4. 删除
```

If the user chooses option 2, ask:

```markdown
先填这个链接：
1. 名字 - 比如：项目后台
2. 地址 - 比如：https://example.com
```

Requirements:

- First click opens the manager panel.
- Empty state shows `添加入口`.
- Saved entries open only when the user clicks that entry.
- The panel lets users add/edit/delete entries later.

### 资料复制

Prompt:

```markdown
资料复制不能只放占位。这个按钮点一下，要复制哪段内容？

你填两样：
1. 按钮名字 - 比如：我的介绍 / 合作说明 / 收款信息 / 项目说明
2. 要复制的正文 - 可以是一句话，也可以是多行

如果你现在没想好，我会在应用里放一个“编辑内容”按钮。
```

Requirements:

- Store the user's text locally.
- If text is empty, show `编辑内容`; do not copy fake placeholder text.
- Clipboard writes only after the user clicks.

### 常用回复

Prompt:

```markdown
常用回复要能直接用。你要它帮你生成哪类回复？

1. 客户跟进
2. 项目说明
3. 预约确认
4. 交付说明
5. 常见问题回复

再填两样：
1. 默认回复正文
2. 每次会变的内容 - 比如客户名、项目名、时间、价格
```

Requirements:

- Store template text locally.
- Use plain labels like `客户名` and `项目名`.
- If no body is provided, show `编辑回复模板` before use.

### 待办记录

Prompt:

```markdown
待办要记到哪里？小白默认选第 1 个。

1. 存在这个应用里 - 推荐
2. 存成一个 Markdown 文件
3. 先只显示在本次打开的应用里
```

Default: local JSON under the desktop app's user data folder.

### 状态面板

Prompt:

```markdown
状态面板要看什么？不要只写“状态”两个字。

1. 今日待办数量
2. 一个本地命令的最近结果
3. 一个服务或网页是否正常
4. 一个手动填写的状态
```

If data cannot be connected yet, provide `手动更新状态`.

### 文件夹入口

Prompt:

```markdown
这个按钮要打开哪个文件夹？

请填文件夹路径。比如：
/Users/you/Documents/Project
```

If the path is unknown, keep the card editable and show `选择文件夹`.

### 本地命令

Prompt:

```markdown
本地命令会在你电脑上执行，有风险。第一版建议只做安全动作。

选一种：
1. 打开项目
2. 运行检查
3. 同步文件
4. 自定义命令

如果选自定义命令，必须把命令完整写出来，并在应用里点击前二次确认。
```

### AI 提示词

Prompt:

```markdown
AI 提示词按钮点一下，要复制哪段提示词？

你填两样：
1. 按钮名字 - 比如：润色标题 / 总结文章 / 生成脚本
2. 提示词正文 - 就是要复制给 AI 的那段话

如果现在没想好，应用里必须有“编辑提示词”入口。
```

## Step 7: Generate First-Version Spec

After choices are known, output:

```markdown
**第一版光岛**
| 按钮 | 点了做什么 | 还需要填什么 | 保存在哪里 | 怎么确认能用 |
| --- | --- | --- | --- | --- |

**安装入口**
- macOS: 放到“应用程序”
- Windows: 生成安装包、开始菜单入口或桌面快捷方式
- 下次从哪里打开: ...

**现在开始做**
1. ...
2. ...
3. ...
```

Then start building if the user asked for implementation.

## Fallback Defaults

When the user wants speed, choose:

- name: `工作光岛`
- module count: 3
- modules:
  1. `发帖子`: open `https://fawen.fun`, removable
  2. `快捷入口`: open a quick-link management panel, removable
  3. `待办记录`: add a local todo
- save data in local JSON for desktop apps
- platform: Electron desktop app
- install target: macOS Applications or Windows installer/shortcut by default
