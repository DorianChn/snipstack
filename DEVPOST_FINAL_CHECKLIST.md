# SnipStack × Shipaton 2026 — 提交收尾清单

> 更新：2026-09-18 20:35 GMT+8 ｜ 截止：**2026-10-01 14:45 GMT+8**（还剩 12 天）
> 相比上一版：**视频已成品**（原「❌ 无成品」已解决）

## 一、当前状态（已核验，勿重复操作）

| 项目 | 状态 |
|---|---|
| 手机 `7a66c12a`（Redmi 23013RK75C / Android 15） | ✅ 在线 |
| App 安装 | ✅ 已装 `com.snipstack.app` v0.1.0（19:45 重装），MainActivity 前台，logcat 无 FATAL |
| **演示视频** | ✅ **已成品** `marketing/snipstack-demo.mp4` — 1:56（115.9s）、1080×2400、h264+aac |
| 视频旁白 | ✅ 有（mean −24.1 dB，句间自然停顿）；**英文字幕已烧录进画面** |
| gallery 展示图 | ✅ 4 张，均 1536×1024 = 精确 3:2 |
| SUBMISSION / DEVPOST_STORY / VIDEO_SCRIPT | ✅ 齐备 |
| 仓库 | ✅ `github.com/DorianChn/snipstack` **public + MIT**，origin/main = `d9003ae` |
| 远端 YouTube 链接 | ❌ 还没有（本轮已核实全仓库无任何 youtube 链接） |
| Devpost 提交 | ❌ 未提交 |

## 二、距离提交只剩 2 件事（约 10 分钟）

### ① 传 YouTube（unlisted）
1. 上传 `marketing/snipstack-demo.mp4`（已是终稿，**不要再剪**）
2. 可见性选 **Unlisted**
3. 描述里放仓库链接：`https://github.com/DorianChn/snipstack`
4. **不要额外上传 `demo-subtitles.srt`** —— 画面里字幕已烧录，再挂一份会双重字幕

### ② Devpost 填表（按此顺序，直接整段复制）

| Devpost 栏位 | 粘贴来源 |
|---|---|
| Project name | `SnipStack` |
| Elevator pitch | `SUBMISSION.md` → 「Elevator pitch」段（138 字符，限 200） |
| Thumbnail | `marketing/gallery-1-inbox.png` |
| **Video demo link** | 第 ① 步的 YouTube 链接 |
| **About the project** | `DEVPOST_STORY.md` 全文（**跳过第 1 行说明**，从 `## Inspiration` 开始） |
| Gallery | `gallery-1-inbox` → `gallery-2-search` → `gallery-3-detail` → `gallery-4-paywall` |
| Built with | `expo` `react-native` `typescript` `revenuecat` `zustand` `react-navigation` `async-storage` |
| Try it out | `https://github.com/DorianChn/snipstack` |

**勾选奖项**（4 个）：
- [ ] **Next Gen Award**（学生；评审依据 = 视频 + 开源代码）
- [ ] **Influencer Award — Productivity**
- [ ] **RevenueCat Design Award**
- [ ] **HAMM Award**

→ 最后 **Submit**。

## 三、⚠️ 仓库红线：有未提交的演示代码，**不要 push**

工作区未提交改动（均已核实）：

| 文件 | 内容 | 处置 |
|---|---|---|
| `src/demo/flags.ts` | **`DEMO_AUTOPLAY = true`** — 文件注释明写 "MUST be false for any store release"；开启后 store 变 ephemeral（不读写 AsyncStorage） | 保持未提交 |
| `src/screens/PaywallScreen.tsx` | `SHOW_DEMO_PRICING = true` — 硬编码 $19.99 / $2.99 假价格 | 保持未提交 |
| `App.tsx` / `EditorScreen` / `SearchScreen` / `useSnippets.ts` | autoDemo 驱动脚手架 | 保持未提交 |
| `src/demo/autoDemo.ts` | 免手动的 120s 脚本演示（正是视频的走位来源） | 保持未提交 |

**已推送的仍是 `d9003ae`（干净状态）—— 这是评委看到的那一份，正确。**

> 视频里的价格卡带 "Demo pricing — no store products are connected in this build." 小字，
> 属于如实标注，可以留。但那份代码**不能**进开源仓库，否则会被读成演示造假。

## 四、可选加分项（非必须）

- **给仓库挂 GitHub Release + `app-release.apk`**（36.4MB，16:38 编译，**早于**所有 demo 改动 = 干净产物）。
  理由：Devpost「Try it out」只能链仓库，评委无法真机体验；挂个 APK 能让人真的装上。
  ⚠️ 这是对外可见动作，需你确认后再做。
- 视频结尾是 App 首页 + 字幕卡（`SnipStack - open source, MIT. Built by a student for Shipaton 2026`），
  **没有出现 GitHub 仓库画面**。评委拿到的仓库链接靠 Devpost 栏位与视频描述传递，记得两处都放。

## 五、诚实性红线（重申）

- `purchases.keys.ts` 里仍是 `appl_REPLACE…` / `goog_REPLACE…` 占位符 → **没有真实 RevenueCat 项目**
- 不要声称已跑通真实沙盒购买（视频旁白也没这么说，保持现状即可）
- 不要伪造 Devpost 链接、不要代提交
