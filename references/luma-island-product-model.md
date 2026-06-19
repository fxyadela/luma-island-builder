# Luma Island Product Model

Use this reference to keep the work island focused. The mistake to avoid is building a cute desktop object that does not remove any real work friction.

## Positioning

A desktop work island is a small, persistent task layer at the edge of the desktop. It gathers the actions users repeat every day:

- open common links, tools, folders, and projects
- copy reusable information
- generate or fill template replies
- record quick todos or notes
- show status such as quotas, script results, deadlines, or recent activity
- run local scripts when the user explicitly accepts the risk

It is not a decoration project. Personality and visual style may help users like it, but the product value comes from faster execution.

## Product Principles

1. One glance tells the user what it does.
2. The surface stays small; the configuration stays underwater.
3. Start with cards, not plugins.
4. Store private information locally by default.
5. Let non-technical users configure through choices, forms, and templates.
6. Finish a working MVP before discussing ecosystem, sync, or AI agents.

## MVP Card Types

| Card type | User value | Required config |
| --- | --- | --- |
| 快捷入口 | Open a web page, app, folder, project, or document | title, URL/path, icon |
| 资料复制 | Copy reusable generic information | title, text/template, sensitivity |
| 模板回复 | Fill a message or reply from variables | title, template, variables |
| 待办记录 | Capture small tasks or notes | title, storage target |
| 状态面板 | Display quota, script result, deadline, or simple status | title, data source, refresh rule |
| 文件夹入口 | Open a local workspace quickly | title, path, file permission |
| 本地脚本 | Run a local command | title, command, risk confirmation |
| AI 提示词 | Copy or open a reusable prompt | title, prompt, target app/link |

Default to three cards:

1. one open action
2. one copy/template action
3. one record/status action

## Anti-Patterns

- Do not start with a plugin market.
- Do not make the surface a large dashboard.
- Do not use private or real customer/pricing/payment data as examples.
- Do not add AI automation before the manual action works.
- Do not make every card visible at once; prioritize 3-6 actions.
- Do not hide permissions behind vague words like "smart" or "automatic".
- Do not turn onboarding into a long questionnaire. Ask, lock, build.

## First-Version Acceptance Criteria

A first version passes if the user can:

1. see the island
2. open it
3. click each configured module
4. get a real result from each click
5. change module config without editing private code
6. understand which permissions are used

It does not need account systems, cloud sync, polished onboarding screens, a marketplace, or a complete settings center.
