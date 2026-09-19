# SnipStack × Shipaton 2026 — 提交收尾清单

> 更新：2026-09-19 14:55 GMT+8 ｜ 截止：**2026-10-01 14:45 GMT+8**（还剩 12 天）
> 👉 要动手时直接看 `_shipaton\SUBMIT_PASTE_KIT.md`（逐字段现成文本 + 线上页待修的 4 处）。

## 一、线上真实状态（2026-09-19 实测 `devpost.com/software/snipstack-w1tdh5`）

| 项目 | 状态 |
|---|---|
| Devpost 项目页 | ✅ 已建，侧栏 `Submitted to` → **RevenueCat Shipaton 2026** |
| Devpost 视频 | ✅ **已嵌入** YouTube `ZVwdq6t-tnM`（页面上有 iframe，不是空的） |
| ↳ 该 YouTube 视频 | Public、113s、作者「山川志」；⚠️ 标题仍是 YouTube 默认「2026年9月18日」、**描述为空** |
| Devpost 故事 | ✅ 7 段已填（I 语气）；⚠️ 另有 1 个空节 + 1 个错名节 + 5 个空模板节 |
| Devpost 画廊 | ⚠️ 4 张 1536×1024 带机身外框的设计图（与 `marketing/gallery-*.png` 字节完全相同） |
| Try it out | ✅ `github.com/DorianChn/snipstack` |
| 演示视频成片 | ✅ 113.9s、1080×2400、h264+aac、3.44MB、字幕已烧录、md5 `390e9347…` |
| 仓库 | ✅ public + MIT，远端 main 已同步 |
| 手机 `7a66c12a` | ❌ 本轮不在线（`adb devices` 为空）——**不影响提交** |

## 二、官方硬性物料（`revenuecat-shipaton-2026.devpost.com` 原文）

- 视频：**≤ 2 分钟** essential footage（**不是 3 分钟**）；且必须 **publicly visible** on YouTube / Vimeo
- 截图：**≥1 张 1179×2556，且不能带设备外框**
- 图标：**1024×1024 app icon**
- 商店链接：通用赛道要「fully published app」的商店 URL
- **Next Gen Award 例外**：学生交「视频 + 开源代码」即可，无需上架、无需付费开发者账号
- 截止：Oct 1, 2026 8:45am GMT+2 = **2026-10-01 14:45 GMT+8**

## 三、距离提交还差什么（4 处，全是手工点击，不用写代码）

1. **YouTube** 补标题 + 描述（视频已是 Public，**不用重传**）
2. **Devpost 故事区**：删空节、把 `Wha## Inspiration` 改名为 `Inspiration`、清掉 5 个空模板节
3. **Devpost 画廊**：补 2 张真机 1179×2556 无外框截图；第 4 张换成 `gallery-4-paywall-v2.png`
4. **确认提交状态** → 改完再点一次 Submit / Update submission

## 四、诚实性说明（保持）

- 视频是 app **脚本化演示模式**的真机录制（真界面、真 RevenueCat 数据，操作由程序触发）。
  `src/demo/flags.ts` 的 `DEMO_AUTOPLAY` 在仓库里**默认 false**，README 已说明，评委可复现。
- 未上架任何商店（商店 URL 栏留空，走 Next Gen 通道）。
- 未演示真实付款完成流程，旁白也未作此声称。
- 画廊图是**设计排版图**（左文案 + 手机框），非设备截图；真机截图单独按官方规格提供。

## 五、手机上的 App 现状（不影响提交）

- 机上跑的是 **debug 包**（无内嵌 JS bundle），JS 依赖 Metro；Metro 已停 → 进程一死即白屏。
  恢复：在 `SnipStack` 起 Metro + 补一次 `adb reverse tcp:8081 tcp:8081`。
- 提交**不需要**这台手机（Devpost 只看视频 + 仓库）。

## 六、可选加分项

- **挂 GitHub Release + APK**：⚠️ 现有 `app-release.apk` 是早期产物，与当前代码不一致，
  要用得先重新编译（约 41min）；且属对外可见动作，需用户确认。
- 发一条 build-in-public 内容（掘金 / X），可补 Devpost 的 Build in Public 两栏。
