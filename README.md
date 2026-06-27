# 投资模拟平台（Investment Simulator）

一个融合**金融投资模拟**与**黑客世界**的纯前端双轨沙盒游戏。玩家在合规金融体系（银行、P2P、券商、保险）中积累资本，同时可潜入暗网黑客子世界，通过漏洞利用、暗网交易、世界服务器渗透等非对称手段影响全局经济。

---

## 功能概览

项目由两大板块深度耦合构成：

| 板块 | 定位 | 核心玩法 |
|------|------|----------|
| **金融投资模拟** | 合规经济体系 | 银行存取 / P2P 借贷 / 券商交易 / 保险购买 / 跨境汇款 |
| **黑客世界** | 非对称破局手段 | 黑客终端 / 技能训练 / 暗网市场 / VPN 跳板 / 银行攻击 / 世界服务器渗透 |

两大板块通过 `investSimState_v13` 全局状态实时联动：黑客攻击可致银行资产缩水，世界服务器事件可引发金融市场连锁反应。

---

## 技术栈

```
纯前端（零依赖）               构建工具链
─────────────                ──────────
HTML5 + CSS3                  Python 3（生成器脚本）
原生 JavaScript（ES6+）        Node.js（JS 构建/修补脚本）
localStorage 持久化            无外部框架 / 无打包器
```

- **前端**：全部为单文件 HTML 页面（内嵌 `<style>` 与 `<script>`），零外部依赖，浏览器直接打开即可运行
- **生成器**：6 个 Python 脚本负责批量生成结构相似的子页面（银行、券商、保险、P2P、VPN），确保一致性和可维护性
- **辅助脚本**：11 个 Node.js 脚本用于语法检查、碎片注入、Bug 修补等工程任务

---

## 文件结构

```
2026-05-23-task-2/
│
├── invest-sim.html          ★ 主入口：投资中枢面板（495 KB，~8700 行）
│
├── [金融子模块 — 用户页面]
│   ├── atm.html              ATM 机存取款
│   ├── bank-abc.html         中国农业银行
│   ├── bank-boc.html         中国银行
│   ├── bank-bochk.html       中银香港
│   ├── bank-boe.html         英格兰银行
│   ├── bank-ccb.html         中国建设银行
│   ├── bank-hangseng.html    恒生银行
│   ├── bank-hsbc.html        汇丰银行
│   ├── bank-hsbc_uk.html     汇丰英国
│   ├── bank-icbc.html        中国工商银行
│   ├── bank-sc.html          渣打银行
│   ├── bank-attack.html      银行攻击界面（黑客入侵入口）
│   ├── p2p-lufax.html        陆金所
│   ├── p2p-ppdai.html        拍拍贷
│   ├── p2p-renrendai.html    人人贷
│   ├── broker-citics.html    中信证券
│   ├── broker-goldman.html   高盛
│   ├── insurance-aia.html    友邦保险
│   ├── insurance-picc.html   中国人保
│   ├── insurance-pingan.html 中国平安
│   └── remittance.html       跨境汇款
│
├── [黑客世界 — 用户页面]
│   ├── hack-terminal.html    黑客终端（命令行界面）
│   ├── hack-training.html    黑客技能训练
│   ├── darknet-market.html   暗网市场
│   ├── world-server.html     世界服务器（全局事件中枢）
│   ├── vpn-abc.html          VPN 节点 × 9（对应 9 家银行）
│   ├── vpn-boc.html
│   ├── vpn-bochk.html
│   ├── vpn-ccb.html
│   ├── vpn-hangseng.html
│   ├── vpn-hsbc.html
│   ├── vpn-hsbc_uk.html
│   ├── vpn-icbc.html
│   └── vpn-sc.html
│
├── [Python 生成器]
│   ├── gen_banks.py          生成 10 家银行子页面 + bank-attack
│   ├── gen_brokers.py        生成 2 家券商子页面
│   ├── gen_insurance.py      生成 3 家保险子页面
│   ├── gen_p2p.py            生成 3 家 P2P 子页面
│   ├── gen_vpn.py            生成 9 个 VPN 节点子页面
│   └── gen_accounts_excel.py 生成账户清单 Excel
│
├── [JS 构建/修补脚本]
│   ├── _syntax_check_*.js    各页面语法检查文件（30 个）
│   ├── add_fragment_system.js    暗网碎片系统注入
│   ├── add_ws_trade.js           世界服务器交易注入
│   ├── add_ws_clean.js           世界服务器清理逻辑注入
│   ├── apply_ws_clean.js         执行清理
│   ├── rewrite_ws_fragment.js    重写碎片逻辑
│   ├── fix_dm_syntax.js          暗网市场语法修复
│   ├── fix_ws_trade_dom.js       世界服务器 DOM 修复
│   ├── fix_fragment_cluster.js   碎片聚合修复
│   ├── test_fragment_code.js     碎片测试
│   └── test_fragment_simple.js   碎片简单测试
│
├── [数据与辅助]
│   ├── darknet-ws-trade.js   暗网 ↔ 世界服务器交易桥接模块
│   ├── 账户清单.xlsx          预置银行账户数据
│   ├── overview.md            项目概述
│   ├── BUG_REPORT_EXPLORE3.md Bug 报告
│   └── .gitignore
```

---

## 快速开始

本项目为纯静态前端项目，**无需安装任何依赖或启动服务器**。

1. 双击或用浏览器打开 `invest-sim.html`
2. 主界面三栏布局：左侧资产面板 → 中央操作区 → 右侧市场行情
3. 点击各金融模块按钮（银行 / P2P / 券商 / 保险 / 汇款）在新标签页打开子页面
4. 子页面操作后通过 `localStorage` 的 `investSimState_v13` 键回写数据，主页面自动同步

> **提示**：所有数据存储在浏览器 `localStorage` 中，清除浏览器数据会导致存档丢失。

---

## 主要功能模块

### 金融投资板块

| 模块 | 页面 | 功能 |
|------|------|------|
| **ATM** | `atm.html` | 现金存取、余额查询 |
| **银行系统（10 家）** | `bank-*.html` | 活期 / 定期存款、贷款、利率浮动 |
| **P2P 借贷（3 家）** | `p2p-*.html` | 项目投资、收益率对比、风险评估 |
| **券商（2 家）** | `broker-*.html` | 股票 / 基金买卖、实时行情 |
| **保险（3 家）** | `insurance-*.html` | 寿险 / 财险购买、保费计算 |
| **跨境汇款** | `remittance.html` | 多币种汇款、汇率换算 |

### 黑客世界板块

| 模块 | 页面 | 功能 |
|------|------|------|
| **黑客终端** | `hack-terminal.html` | 命令行风格操作界面，执行黑客命令 |
| **技能训练** | `hack-training.html` | 提升攻击 / 防御 / 编程等技能等级 |
| **暗网市场** | `darknet-market.html` | 购买漏洞利用工具、恶意软件、情报 |
| **VPN 节点（9 个）** | `vpn-*.html` | 跳板连接，隐藏攻击来源，对应 9 家目标银行 |
| **银行攻击** | `bank-attack.html` | 对银行发起渗透攻击，影响金融体系 |
| **世界服务器** | `world-server.html` | 全局事件中枢，黑客可渗透修改世界经济参数 |

### 跨板块联动机制

```
暗网市场 ──购买工具──→ 黑客终端 ──发起攻击──→ bank-attack ──影响──→ 银行资产
    ↑                     ↑
    └── 世界服务器 ←──数据同步──→ darknet-ws-trade.js（桥接模块）
```

世界服务器的状态变更会影响全局利率、汇率、股市波动等，形成"黑客行为 → 经济震荡 → 投资策略调整"的闭环。

---

## 数据持久化

所有游戏状态通过浏览器 `localStorage` 以单一 JSON 对象存储，键名为 `investSimState_v13`。

**数据结构概览**：

| 字段 | 说明 |
|------|------|
| `cash` | 手持现金 |
| `banks` | 10 家银行的存款 / 贷款记录 |
| `p2p` | P2P 投资项目持仓 |
| `brokers` | 券商股票 / 基金持仓 |
| `insurance` | 已购保险保单 |
| `hackSkills` | 黑客技能等级 |
| `inventory` | 暗网购买的物品 / 工具 |
| `worldState` | 世界服务器全局参数 |
| `vpnNodes` | VPN 节点连接状态 |

状态在子页面操作后由子页面写入，主页面通过 `storage` 事件监听实现实时同步。

---

## 构建说明

如需修改银行 / 券商 / 保险等子页面的模板后重新生成：

```bash
# 生成银行子页面（10 家 + bank-attack）
python gen_banks.py

# 生成券商子页面
python gen_brokers.py

# 生成保险子页面
python gen_insurance.py

# 生成 P2P 子页面
python gen_p2p.py

# 生成 VPN 子页面
python gen_vpn.py
```

生成器读取内嵌的 HTML 模板与银行/产品数据，输出完整的独立 HTML 文件到当前目录。
