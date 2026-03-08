# Process Manager

一个基于 Tauri 2 + React 19 构建的跨平台桌面进程管理器。

![Tauri](https://img.shields.io/badge/Tauri-2.x-blue?logo=tauri)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green)

## 功能

- **进程列表** — 实时展示所有系统进程，支持按名称/PID/路径搜索，按 CPU、内存、PID 等字段排序
- **进程操作** — 启动新进程、终止进程（二次确认）、调整进程优先级
- **进程详情** — 点击进程查看完整信息（路径、启动命令、运行时间等）
- **进程树** — 树形结构展示父子进程关系，支持展开/折叠/搜索
- **系统信息** — 实时显示操作系统、CPU 核心数、内存和 Swap 使用情况
- **实时更新** — 后端每 2 秒通过 Tauri 事件系统推送数据，前端自动刷新

## 截图

> 运行 `npm run tauri dev` 后即可看到界面

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 19 + TypeScript 5.8 + Vite 7 |
| 后端 | Rust + Tauri 2 |
| 系统信息 | sysinfo 0.32 |
| 进程管理 | std::process::Command |

## 项目结构

```
├── src/                          # 前端
│   ├── App.tsx                   # 主布局
│   ├── types.ts                  # 类型定义
│   ├── utils.ts                  # 工具函数
│   ├── hooks/
│   │   └── useProcessData.ts     # 数据层 Hook
│   ├── components/
│   │   ├── Header.tsx            # 顶栏
│   │   ├── ProcessTable.tsx      # 进程列表
│   │   ├── ProcessDetail.tsx     # 进程详情弹窗
│   │   ├── ProcessTree.tsx       # 进程树
│   │   ├── SpawnForm.tsx         # 启动进程表单
│   │   └── SystemInfoPanel.tsx   # 系统信息面板
│   └── styles/
│       └── global.css            # 全局样式
├── src-tauri/                    # 后端
│   └── src/
│       ├── lib.rs                # 入口
│       ├── models.rs             # 数据结构
│       ├── commands.rs           # Tauri 命令
│       ├── monitor.rs            # 定时推送
│       └── sysinfo_utils.rs      # 系统信息采集
```

## 快速开始

### 前置要求

- [Node.js](https://nodejs.org/) >= 18
- [Rust](https://www.rust-lang.org/tools/install)
- [Tauri 2 前置依赖](https://v2.tauri.app/start/prerequisites/)

### 安装与运行

```bash
# 安装前端依赖
npm install

# 开发模式（前端 + 后端热重载）
npm run tauri dev

# 生产构建
npm run tauri build
```

### 常用命令

```bash
# 仅检查 Rust 编译
cd src-tauri && cargo check

# 仅检查 TypeScript
npx tsc --noEmit

# 格式化 Rust 代码
cd src-tauri && cargo fmt
```

## License

MIT
