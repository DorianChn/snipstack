# Next Gen Award — Demo Video Script (≤ 3 min)

> Next Gen 评审依据：**视频 + 开源代码**。视频放 YouTube（unlisted 即可），
> 链接贴到 Devpost。旁白用英文，下面是分镜 + 台词 + 中文备注。

## Shot list

### 0:00–0:15 — Hook（问题）
- **画面**：录屏：在 Notes / 微信文件传输助手 / 桌面 txt 之间来回翻找一段常用回复模板。
- **旁白**："Power users paste the same things every day — and waste minutes
  digging for them. I built SnipStack so saving takes five seconds and finding
  takes two taps."

### 0:15–0:45 — 保存流（speed of capture）
- **画面**：打开 SnipStack → 点 + → 选 Text → 输入标题 "Standup reply"、粘贴内容、
  打两个 tag → Save。全程一镜到底，右上角可放计时器贴纸。
- **旁白**："One inbox for text, links, images, and files. Title it, tag it
  loosely, done — under five seconds."
- **中文备注**：提前把内容放剪贴板，录两遍取快的。

### 0:45–1:20 — 取回流（speed of retrieval）
- **画面**：Search tab 输入 "standup" → 秒出结果 → 点开 → Copy to clipboard →
  震动反馈 → 切到邮件 app 粘贴。再演示：Pin 一条 → 回 Inbox 出现在 Pinned 区；
  点 tag chip 过滤。
- **旁白**："Live search across titles, content, and tags. Pinned and most-used
  snippets float to the top. Two taps, haptic confirmation, paste anywhere."
- **中文备注**：这段是 Productivity 奖的核心卖点，节奏要快。

### 1:20–1:50 — 设计细节（Design Award 加分）
- **画面**：浅色/深色模式切换；空状态插画；卡片排布；kind 图标系统。
- **旁白**："Fully themed for light and dark, with a design language built
  around one idea: your snippets are the interface."

### 1:50–2:25 — 变现（RevenueCat / HAMM）
- **画面**：免费版存到第 16 条 → 自动弹出 Paywall → 展示月/年/买断三个真实商品 →
  Settings 里 Restore purchases 入口。
- **旁白**："SnipStack is freemium: fifteen snippets free, Pro removes the
  limit. The entire paywall — offerings, purchase, restore, real-time
  entitlement updates — runs on the RevenueCat SDK. The gate appears exactly
  when the app has proven its value."
- **中文备注**：**成片按此执行**——录到支付墙展示为止（三个商品为 SDK 真实返回），
  **没有录制付款完成**，旁白也未作此声称。若日后补录沙盒购买，用 RevenueCat
  测试账号，并同步改本段与「录制配置说明」。

### 2:25–3:00 — 收尾（学生身份 + 开源）
- **画面**：GitHub 仓库页面（MIT license、README）→ 结束卡：SnipStack logo +
  "Built by a student, for the Shipaton Next Gen Award. Open source, MIT."
- **旁白**："I'm a student, and SnipStack is fully open source under MIT —
  code, design, and the RevenueCat integration, all in the repo. Thanks for
  watching."

## 录制清单

- [x] **安卓真机录屏**（Redmi 23013RK75C / Android 15，adb `7a66c12a`），1080×2400，浅色模式为主 — 已完成（由 `src/demo/autoDemo.ts` 脚本化自动演示录制）
- [x] 录制前置：确认 `DEMO_UNLOCK = false`（理由见下节） — 已确认
- [x] 剪映/CapCut 剪到 3 分钟内，加字幕（旁白用英文） — 已成片 113.9s，英文字幕已烧录
- [ ] **上传 YouTube（unlisted）** → 链接填入 Devpost "Demo video"（描述里放仓库链接） ← **仅剩此项**
- [ ] Devpost 勾奖项 + Submit（见 `DEVPOST_FINAL_CHECKLIST.md`）

## 录制配置说明（重要）

`src/services/purchases.ts` 里的 `DEMO_UNLOCK` 决定录屏时支付墙能否出现：

| 取值 | 实际效果 | 用途 |
|---|---|---|
| `false`（**录制用这个**） | 免费限额真实生效，存满 15 条后第 16 条**自动弹出支付墙**，freemium 卖点可见 | 1:50–2:25 变现段 |
| `true` | Pro 永久解锁，首页/设置页的 Upgrade 入口被 `!isPro` 隐藏，**支付墙无法从 UI 打开** | 仅用于演示"已解锁"状态 |

> **状态更新（2026-09-18）**：RevenueCat 已接入真实项目 `projb4f9a730`（Test Store key 存于
> `src/services/purchases.keys.ts`，该文件 **gitignored、不入仓库**）。成片里支付墙显示的是
> SDK 拉回的真实商品（Monthly US$9.99 / Yearly US$79.99 / Lifetime US$99.99），不是假价格。
> 旁白照实说「整条订阅链路（offerings / purchase / restore / entitlement 实时更新）
> 都跑在 RevenueCat SDK 上」，**不要声称已跑通沙盒购买** —— 成片也确实没声称。
>
> 注意：`DEMO_AUTOPLAY`（`src/demo/flags.ts`）与 `SHOW_DEMO_PRICING`
> （`src/screens/PaywallScreen.tsx`）在仓库中**均为 `false`**，评委 clone 后得到的是正常生产行为。
