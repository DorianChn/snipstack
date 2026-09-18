# SnipStack × Shipaton 2026 — 提交收尾清单

> 更新：2026-09-18 22:50 GMT+8 ｜ 截止：**2026-10-01 14:45 GMT+8**（还剩 12 天）
> 👉 **要动手时直接看 `_shipaton\SUBMIT_PASTE_KIT.md`**（YouTube 元数据 + Devpost 逐栏文本，复制粘贴即可）。

## 一、当前状态（已核验）

| 项目 | 状态 |
|---|---|
| 手机 `7a66c12a`（Redmi / Android 15） | ✅ 在线，app 可运行、无 FATAL |
| **演示视频** | ✅ **终稿 v2** — 113.9s、1080×2400、h264+aac、3.44MB、字幕已烧录、英文旁白已混入 |
| ↳ 终稿副本（md5 相同 `390e9347…`） | ① `SnipStack/marketing/snipstack-demo.mp4` ② `demo/snipstack-final-v2.mp4` ③ 桌面 `SnipStack-演示视频-2分钟.mp4` |
| 视频内容 | ✅ 覆盖全部功能；支付墙显示 **RevenueCat 真实商品**（Monthly US$9.99 / Yearly US$79.99 / Lifetime US$99.99） |
| RevenueCat 项目 | ✅ `projb4f9a730`，Test Store key 已接入（本地 `purchases.keys.ts`，**已 gitignore**） |
| 连线证据 | ✅ `[RC-PROBE] offering=default packages=$rc_monthly\|$rc_annual\|$rc_lifetime` |
| gallery 展示图 | ✅ 4 张，1536×1024（精确 3:2） |
| 仓库 | ✅ `github.com/DorianChn/snipstack` public + MIT，远端 main = `ecfb993` |
| Devpost 已填 | ✅ name / pitch / story / built-with / try-it-out / 平台=Android / 学生邮箱 / RC Project ID |
| **YouTube 链接** | ❌ 还没上传 |
| **Devpost 提交** | ❌ 未 Submit |

## 二、只剩 2 件事

> 逐字段的现成文本见 `_shipaton\SUBMIT_PASTE_KIT.md`，下面只是概览。

### ① 传 YouTube（unlisted）
1. 上传 `C:\Users\36712\Desktop\SnipStack-演示视频-2分钟.mp4`（终稿，**不要再剪**）
   - 若该副本被清掉，用 `SnipStack\marketing\snipstack-demo.mp4`（同一文件，md5 `390e9347c43ec1f5fe96ad5625c19ac0`）
2. 可见性 **Unlisted**
3. 描述放仓库链接 `https://github.com/DorianChn/snipstack`
4. **不要**再额外上传字幕文件（字幕已烧进画面）

### ② Devpost 收尾 → Submit
- Video demo link ← 第 ① 步链接
- 奖项勾选：**Next Gen Award**、**Influencer Award — Productivity**、**RevenueCat Design Award**、**HAMM Award**
- 点 **Submit**

## 三、诚实性说明（保持）

- 视频为 app 的**脚本化演示模式**录制（真机、真界面、真 RevenueCat 数据，操作由程序触发）。
  `src/demo/flags.ts` 里的 `DEMO_AUTOPLAY` 在仓库中**默认 false**，README 已说明用途 —— 评委可复现，无需隐瞒。
- 未上架任何商店（Devpost 三个商店 URL 栏留空，走 Next Gen 通道）。
- 未演示真实付款完成流程（没有商店商品），视频旁白也未作此声称。

## 四、手机上的 App 现状（不影响提交，但要知道）

- 机上跑的是 **debug 包**（`base.apk` 167,601,416 B，19:45 安装），**内部没有 JS bundle**，JS 靠 Metro 实时拉。
- **Metro 现在已经不在监听 8081 了**（跑 `netstat -ano | grep LISTENING | grep 8081` 无输出）。
  → 现在界面正常，只是因为 App 进程（PID 29849）还活着、bundle 还在内存里。
  → **一旦 App 进程被杀 / 手机重启，再打开就是白屏**。
- 想恢复：在 `SnipStack` 目录起 Metro，并补一次 `adb reverse tcp:8081 tcp:8081`（Bash 每次调用会重启 adb server，该反向映射会丢）。
- 提交本身**不需要**这台手机 —— Devpost 只看视频 + 仓库。所以不必为它折腾，除非你还想加录镜头。

## 五、可选加分项

- **挂 GitHub Release + APK**：让评委真机体验。
  ⚠️ 现有 `app-release.apk` 是早期产物，与当前代码不一致，**要用必须先重新构建**；且这是对外可见动作，需用户确认。
- 若愿意发一条 build-in-public 内容（掘金/X），可补 Devpost 的 Build in Public 两栏，多一个奖项机会。
