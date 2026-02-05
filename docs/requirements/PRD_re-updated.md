# TDD Tutorial - 製品要件定義書（PRD）v3

## 概要

子ども向けにTest-Driven Development（TDD）を体験学習させるためのWebアプリケーション。Blocklyを使用した視覚的プログラミング環境で、テストを先に書き、実装して、検証するというTDDサイクルを直感的に学習できる。

## 目的

- 子どもがTDDの基本概念（RED → GREEN → REFACTOR）を体験的に理解する
- ブロックベースのプログラミングでコーディングのハードルを下げる
- 安全なサンドボックス環境でコード実行を体験させる

---

## システム構成

### 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | Next.js 16.1.6, React 19.2.3, TypeScript 5 |
| UI | Tailwind CSS 4 (@tailwindcss/postcss), shadcn/ui (new-york), Radix UI |
| アイコン | Lucide React |
| CSS ユーティリティ | class-variance-authority, clsx, tailwind-merge |
| 視覚的プログラミング | Blockly 12.3.1, react-blockly 9.0.0 |
| バリデーション | Zod 4.3.6 |
| テスト（ユニット） | Vitest 4.0.18, @vitest/coverage-v8, @testing-library/react, @testing-library/jest-dom |
| テスト（E2E） | Playwright 1.58.1 |
| コード実行 | `new Function()` サンドボックス（メインスレッド実行） |

### アーキテクチャ

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # ログイン画面
│   ├── workspace/
│   │   └── page.tsx       # TDDワークスペース
│   ├── layout.tsx         # ダークテーマ・フォント設定
│   ├── globals.css        # グローバルスタイル・CSS変数
│   └── favicon.ico
├── components/
│   ├── auth/              # ログインフォーム
│   ├── blockly/           # Blocklyエディタ・カスタムブロック・コード生成
│   │   ├── blocks/        # カスタムブロック定義（8種類）
│   │   ├── generators/    # JavaScriptコード生成器
│   │   ├── blockly-editor.tsx
│   │   └── toolbox.ts     # ツールボックス設定（9カテゴリ）
│   ├── console/           # 実行結果表示
│   ├── layout/            # ヘッダ（ログアウト・エクスポート・インポート）
│   └── ui/                # 基本UIコンポーネント（Button, Card, Input, Label）
├── hooks/
│   ├── use-session.ts     # セッション管理フック
│   └── use-code-execution.ts  # コード実行・結果解析フック
├── lib/
│   ├── sandbox/           # コード実行エンジン・レート制限
│   ├── session/           # セッション管理
│   ├── validation/        # コードセキュリティ検証
│   ├── errors/            # エラーメッセージ翻訳
│   └── utils.ts           # ユーティリティ（cn関数）
├── types/
│   ├── session.ts         # セッション型定義
│   └── execution.ts       # 実行結果型定義
└── test/
    └── setup.ts           # テストセットアップ
```

---

## 画面構成

### 1. ログイン画面 (`/`)

**目的**: ユーザーの識別とセッション開始

**機能**:
- ニックネーム入力フォーム
  - 2〜20文字（最小2文字に変更済み）
  - 使用可能文字: ひらがな、カタカナ、漢字、英数字、アンダースコア
  - スペース・特殊文字は禁止
- セッション作成（ニックネーム + タイムスタンプベースID）
- 既存セッションがある場合は自動的にワークスペースへリダイレクト
- ローディング状態の表示

**UI構成**:
- 中央配置のカードレイアウト
- Code2アイコン付きタイトル
- バリデーションエラーのインライン表示
- 送信ボタン（ローディング状態対応）

**データ保存**:
- sessionStorage使用（キー: `tdd-tutorial-session`）
- タブ/ウィンドウを閉じると自動的にセッション消失

### 2. ワークスペース画面 (`/workspace`)

**目的**: TDD体験のメイン作業エリア

**構成要素**:

#### ヘッダ
- アプリ名表示
- ニックネーム表示
- ワークスペースダウンロードボタン（JSONエクスポート）
- ワークスペースインポートボタン（JSONファイル読み込み）
- ログアウトボタン

#### Blocklyエディタ
- 左サイドバー: TDDブロックのツールボックス（9カテゴリ）
- 中央: ブロック配置エリア
- ドラッグ&ドロップでブロック配置
- カスタムダークテーマ
- グリッド・ゴミ箱・スクロールバー表示
- Ctrl+マウスホイールでズーム操作
- ワークスペース自動保存（localStorageへ）
- 起動時に初回カテゴリを自動オープン

#### 実行パネル（コンソール出力）
- 「実行」ボタン（実行中・未準備時は無効化）
- ターミナル風コンソール出力エリア
- テスト結果のカラーコード表示
  - 青: 情報メッセージ
  - 緑: 成功メッセージ・テスト合格
  - 赤: エラーメッセージ・テスト失敗
- テスト結果の背景ハイライト（緑/赤）
- テスト間の空行区切り
- 最新メッセージへの自動スクロール
- 固定幅 320px

**ワークスペース永続化**:
- localStorageキー: `tdd-tutorial-workspace`
- ワークスペース変更時に自動保存
- ページ読み込み時に自動復元
- JSONファイルとしてエクスポート/インポート可能

**アクティビティ追跡**:
- 60秒間隔でセッションの`lastActiveAt`を更新

---

## TDDブロック仕様

### カスタムブロック一覧（8種類）

#### 1. TestCase（テストケース）ブロック

**目的**: テストの構造化

**フィールド**:
- NAME: テスト名（テキスト入力）

**セクション**:
- SETUP（準備）: 初期値の設定
- EXECUTE（実行）: テスト対象の関数呼び出し
- ASSERT（検証）: 結果の確認

**色**: 210（青系）

**生成コード構造**:
```javascript
(function() {
  console.log('[TEST_START] テスト名');
  try {
    // SETUP
    // EXECUTE
    // ASSERT
    console.log('[TEST_PASS] テスト名');
  } catch (e) {
    if (e.message && e.message.startsWith('[ASSERTION]')) {
      console.log('[TEST_FAIL] ' + e.message.substring(11));
    } else {
      console.log('[TEST_ERROR] ' + e.message);
    }
  } finally {
    console.log('[TEST_END]');
  }
})();
```

#### 2. Assert Equals（検証）ブロック

**目的**: 値の比較検証

**入力**:
- ACTUAL: 実際の値（値入力）
- EXPECTED: 期待値（値入力）

**色**: 120（緑系）
**接続**: 前後ステートメント

**生成コード**:
```javascript
if (actual !== expected) {
  throw new Error('[ASSERTION] 期待値: ' + expected + ' / 実際: ' + actual);
}
```

#### 3. Function Definition（関数定義）ブロック

**目的**: 関数の作成

**フィールド**:
- NAME: 関数名（テキスト入力、デフォルト: "myFunction"）

**ステートメント**: BODY（関数本体）
**色**: 290（紫系）

**生成コード**:
```javascript
function myFunction() {
  // body
}
```

#### 4. Call Function（関数呼び出し）ブロック

**目的**: 定義した関数の呼び出し

**フィールド**:
- NAME: 関数名（テキスト入力）

**色**: 290（紫系）
**接続**: 前後ステートメント

**生成コード**:
```javascript
functionName();
```

#### 5. Set Variable（変数作成）ブロック

**目的**: 新しい変数の作成と初期値設定

**フィールド**:
- NAME: 変数名（テキスト入力、重複チェックバリデーター付き）
- VALUE: 初期値（値入力）

**色**: 330（ピンク系）

**生成コード**:
```javascript
variableName = value;
```

#### 6. Assign Variable（変数代入）ブロック

**目的**: 既存変数への値の再代入

**フィールド**:
- NAME: 変数名
- VALUE: 新しい値

**色**: 330（ピンク系）

**生成コード**:
```javascript
variableName = value;
```

#### 7. Get Variable（変数取得）ブロック

**目的**: 変数の値を取得

**フィールド**:
- NAME: 変数名（テキスト入力）

**色**: 330（ピンク系）
**出力**: 値

**生成コード**: 変数名をそのまま返す

#### 8. Print（出力）ブロック

**目的**: 値をコンソールに出力

**入力**:
- TEXT: 出力する値（値入力）

**色**: 160（シアン系）

**生成コード**:
```javascript
console.log(text);
```

### ツールボックス構成（9カテゴリ）

| カテゴリ | 日本語名 | ブロック |
|---------|---------|---------|
| テスト | テスト | test_case, assert_equals |
| 関数 | 関数 | function_definition, call_function |
| 変数 | 変数 | set_variable, assign_variable, get_variable |
| 入出力 | 入出力 | print |
| 値 | 値 | math_number, text, logic_boolean |
| 計算 | 計算 | math_arithmetic, math_single |
| 論理 | 論理 | logic_compare, logic_operation, logic_negate, controls_if |
| ループ | ループ | controls_repeat_ext, controls_whileUntil, controls_for |
| テキスト | テキスト | text, text_join, text_length |

### コード生成の特徴

- **コード並べ替え**: 関数定義を先に、テストケースを後に自動的に並べ替え
- **テストマーカー**: `[TEST_START]`, `[TEST_PASS]`, `[TEST_FAIL]`, `[TEST_ERROR]`, `[TEST_END]` で構造化
- **IIFE（即時実行関数）**: 各テストケースをIIFEで包んでスコープを分離

---

## コード実行システム

### 実行フロー

```
ユーザーが実行ボタンをクリック
    ↓
BlocklyEditor.handleExecute()
    ↓
Blocklyワークスペースからコード生成
    ├─ 関数定義を先頭に並べ替え
    └─ テストケースを後方に配置
    ↓
useCodeExecution.execute(code)
    ↓
CodeExecutor.execute(code)
    ├─ RateLimiter.canExecute() → レート制限チェック
    ├─ validateCode(code) → セキュリティ検証
    └─ new Function(code)() → サンドボックス実行
        ├─ カスタムconsoleオブジェクトで出力キャプチャ
        ├─ Promise.raceでタイムアウト制御
        └─ エラー時はerrorTranslatorで日本語変換
    ↓
useCodeExecution がテストマーカーを解析
    ├─ [TEST_START] → テスト開始メッセージ（info）
    ├─ [TEST_PASS] → 成功メッセージ（success） + 実行時間
    ├─ [TEST_FAIL] → 失敗メッセージ（error）
    ├─ [TEST_ERROR] → エラーメッセージ（error）
    └─ その他 → 通常出力（info）
    ↓
ConsoleOutputコンポーネントに表示
```

### 実行エンジン（CodeExecutor）

**クラス構成**:
```typescript
class CodeExecutor {
  constructor(options?: {
    timeoutMs?: number;           // デフォルト: 5000ms
    maxExecutionsPerMinute?: number; // デフォルト: 10
  })
  execute(code: string): Promise<ExecutionResult>
  getRemainingExecutions(): number
  getTimeUntilReset(): number
}
```

**実行方式**:
- `new Function()` を使用（Web Workerではなくメインスレッド実行）
- "use strict" なし（ブロック生成コードでグローバル変数を許可するため）
- カスタムconsoleオブジェクトで `log`, `error`, `warn` をインターセプト
- `Promise.race` によるタイムアウト保護
- 遅延初期化（`useCodeExecution` フック内）

### セキュリティ層

#### 1. コードバリデーター

禁止パターン一覧:

| カテゴリ | パターン |
|---------|---------|
| 実行系 | `eval()`, `new Function()` |
| DOM操作 | `document`, `window` |
| グローバル | `globalThis`, `process`, `require` |
| ネットワーク | `fetch()`, `XMLHttpRequest`, `WebSocket` |
| ストレージ | `localStorage`, `sessionStorage`, `indexedDB` |
| 危険API | `import()`, `Worker`, `SharedArrayBuffer` |

各違反には `pattern`, `message`, `severity`（error/warning）が含まれる。

#### 2. レートリミッター

```typescript
class RateLimiter {
  constructor(options?: {
    maxRequests?: number;  // デフォルト: 10
    windowMs?: number;     // デフォルト: 60000ms（1分間）
  })
  canExecute(): boolean
  recordExecution(): void
  getRemainingRequests(): number
  getTimeUntilReset(): number
  reset(): void
}
```

- スライディングウィンドウ方式（タイムスタンプ配列を管理）
- 古いエントリを自動クリーンアップ
- 超過時はエラーメッセージ表示

#### 3. Content Security Policy (CSP)

```
script-src: 'self', 'unsafe-eval', 'unsafe-inline'  # Blockly動作に必要
style-src: 'self', 'unsafe-inline'
worker-src: 'self', blob:
```

- `next.config.ts` でヘッダとして設定
- iframe、外部スクリプト、信頼されていないソースをブロック

---

## エラーハンドリング

### 子ども向けエラーメッセージ変換

`translateError()` 関数が JavaScript エラーを日本語の分かりやすいメッセージに変換する。

| エラータイプ | 元のメッセージ | 日本語メッセージ | ヒント |
|-------------|--------------|-----------------|-------|
| SyntaxError | Unexpected token | プログラムの書き方に間違いがあるよ | ブロックの組み合わせを確認してみよう |
| SyntaxError | Unexpected end of input | プログラムが途中で終わっているよ | ブロックが足りないかも |
| ReferenceError | is not defined | まだ作っていないものを使おうとしているよ | 変数や関数を先に作ってね |
| TypeError | is not a function | 関数じゃないものを関数として呼び出しているよ | 関数ブロックで先に定義してね |
| TypeError | Cannot read property | 空っぽのデータを使おうとしているよ | データが入っているか確認してね |
| RangeError | Maximum call stack | プログラムが終わらないループになっているよ | 関数の中で自分を呼んでいないか確認してね |
| その他 | - | プログラムの実行中にエラーが起きたよ | ブロックの組み合わせを見直してみよう |

**戻り値の型**:
```typescript
interface ErrorTranslation {
  friendlyMessage: string
  originalMessage: string
  hint: string
  errorType: string
}
```

---

## セッション管理

### データ構造

```typescript
interface Session {
  id: string;           // session_{timestamp}_{random} 形式
  nickname: string;     // ユーザーニックネーム
  createdAt: Date;      // 作成日時
  lastActiveAt: Date;   // 最終アクティビティ日時
}
```

### バリデーション

```typescript
interface SessionValidationResult {
  valid: boolean;
  errors: string[];
}
```

- 文字数: 2〜20文字
- 許可文字: 英数字、ひらがな、カタカナ、漢字、アンダースコア
- 禁止: スペース、特殊文字

### 保存先
- sessionStorage（キー: `tdd-tutorial-session`）
- タブ/ウィンドウを閉じると自動消失

### 管理関数

| 関数 | 説明 |
|------|------|
| `validateNickname(nickname)` | ニックネームのバリデーション |
| `createSession(nickname)` | 新規セッション作成・保存 |
| `getSession()` | 保存済みセッションの取得（日付のパース含む） |
| `clearSession()` | セッションの削除 |
| `updateSessionActivity()` | `lastActiveAt`の更新 |

### ライフサイクル
1. ログイン時にセッション作成（`createSession`）
2. ページ読み込み時にセッション存在チェック
3. ワークスペースで60秒ごとにアクティビティ更新
4. ログアウト時にセッション削除（`clearSession`）
5. タブ/ウィンドウクローズで自動消失（sessionStorageの特性）

### カスタムフック（useSession）

```typescript
function useSession(): {
  session: Session | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (nickname: string) => SessionValidationResult;
  logout: () => void;
  updateActivity: () => void;
}
```

---

## UIデザイン

### テーマ
- ダークテーマ（`<html class="dark">`）
- CSS変数によるカラー管理（`globals.css`）
- プライマリカラー: Neutral（shadcn/ui デフォルト）

### フォント
- Geist Sans（本文）
- Geist Mono（コード・コンソール）

### カラースキーム
- 背景: Gray-900ベースのダークパレット
- コンソール: 黒背景にカラーコードテキスト
- Blockly: カスタムダークテーマ（暗い背景色のブロック）

### コンポーネント

#### Button
- バリアント: default, destructive, outline, secondary, ghost, link
- サイズ: default, xs, sm, lg, icon
- Radix UI Slot対応（asChild プロップ）

#### Card
- サブコンポーネント: CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction

#### Input
- Tailwindスタイリング
- フォーカス状態・ダークモード対応

#### Label
- Radix UI Label プリミティブのラッパー

### BlocklyEditor コンポーネント

**ref経由で公開するAPI**:
```typescript
interface BlocklyEditorHandle {
  handleExecute(): void;      // コード生成・実行トリガー
  isReady: boolean;           // エディタ準備状態
  exportWorkspace(): string | null;   // ワークスペースJSON出力
  importWorkspace(json: string): boolean; // ワークスペースJSON読み込み
}
```

**エディタ設定**:
- グリッド表示（間隔20px, スナップ有効）
- ゴミ箱表示
- スクロールバー表示
- ズーム: Ctrl+マウスホイール対応
- テーマ: カスタムダーク配色

### ConsoleOutputコンポーネント

**Props**:
```typescript
interface ConsoleOutputProps {
  messages: ConsoleMessage[];
  isExecuting?: boolean;
  isReady?: boolean;
  onExecute?: () => void;
  className?: string;
}

interface ConsoleMessage {
  id: string;
  type: 'info' | 'success' | 'error';
  content: string;
  timestamp: number;
}
```

### レスポンシブ
- デスクトップ優先設計
- ワークスペース: Flexレイアウト（エディタ: flex-1, コンソール: 固定320px幅）
- 最小幅: 1024px推奨

---

## ワークスペース機能

### ワークスペース永続化
- localStorageキー: `tdd-tutorial-workspace`
- ブロック変更のたびに自動保存
- ページ読み込み時に自動復元

### エクスポート/インポート
- **エクスポート**: ワークスペースをJSONファイルとしてダウンロード
- **インポート**: JSONファイルからワークスペースを復元
- ヘッダのボタンから操作

### コード実行フック（useCodeExecution）

```typescript
function useCodeExecution(): {
  code: string;
  setCode: (code: string) => void;
  messages: ConsoleMessage[];
  isExecuting: boolean;
  execute: (code: string) => Promise<void>;
  clearMessages: () => void;
  getRemainingExecutions: () => number;
}
```

- CodeExecutorの遅延初期化（初回実行時に生成）
- テストマーカー解析によるメッセージ分類
- 成功時に実行時間を付加表示

---

## 型定義

### セッション型（`src/types/session.ts`）

```typescript
interface Session {
  id: string;
  nickname: string;
  createdAt: Date;
  lastActiveAt: Date;
}

interface SessionValidationResult {
  valid: boolean;
  errors: string[];
}
```

### 実行結果型（`src/types/execution.ts`）

```typescript
interface ExecutionResult {
  success: boolean;
  output: string[];
  error?: string;
  executionTime: number;
}

interface CodeValidationResult {
  valid: boolean;
  violations: CodeViolation[];
}

interface CodeViolation {
  pattern: string;
  message: string;
  severity: 'error' | 'warning';
}
```

---

## テスト要件

### ユニットテスト（Vitest）

| 対象 | テストファイル | テスト内容 |
|------|--------------|-----------|
| CodeExecutor | executor.test.ts | コンストラクタ（デフォルト/カスタム）、有効なコード実行、console.logキャプチャ、構文/実行時エラー、禁止パターン拒否、実行時間追跡、レート制限（許可/ブロック/リセット） |
| RateLimiter | rate-limiter.test.ts | コンストラクタ、制限内/制限超過判定、ウィンドウ経過後のリセット、残りリクエスト数計算、リセット時間計算、手動リセット |
| SessionManager | session-manager.test.ts | ニックネーム検証（有効: 英数字/日本語/混在/アンダースコア/2-20文字、無効: 空/短/長/スペース/特殊文字）、セッション作成/取得/削除、一意ID生成、日付パース、アクティビティ更新 |
| CodeValidator | code-validator.test.ts | 有効なコード通過（関数/console.log/配列）、禁止パターン検出（eval/Function/DOM/グローバル/ネットワーク/ストレージ/危険API）、複数違反検出、大文字小文字区別 |
| ErrorTranslator | error-translator.test.ts | SyntaxError/ReferenceError/TypeError/RangeError変換、不明エラーハンドリング、ErrorTranslation構造体検証 |

### テストセットアップ（`src/test/setup.ts`）
- `window.matchMedia` モック
- `ResizeObserver` モック
- `@testing-library/jest-dom` インポート

### Vitest設定（`vitest.config.ts`）
- 環境: jsdom
- カバレッジ: v8プロバイダ
- パス: `@` → `./src`
- 除外: node_modules, e2e, テストファイル, types, 設定ファイル

### E2Eテスト（Playwright）

| 対象 | テストファイル | テスト内容 |
|------|--------------|-----------|
| ログイン | login.spec.ts | ログインページ表示、有効なニックネームでログイン成功、空/短いニックネームのエラー、特殊文字のエラー、日本語ニックネームの受け入れ |
| ワークスペース | workspace.spec.ts | ワークスペースコンポーネント表示（ヘッダ/エディタ/コンソール）、Blocklyエディタ読み込み、ログアウトによるログイン画面リダイレクト、セッションなしでのリダイレクト、コード実行と出力表示 |

### Playwright設定（`playwright.config.ts`）
- テストディレクトリ: `./e2e`
- ベースURL: `http://localhost:3000`
- ブラウザ: Chromium（Desktop Chrome）
- Webサーバー: `npm run dev`（CIでない場合は既存サーバー再利用）
- レポーター: HTML
- リトライ: CI時2回、ローカル0回

### カバレッジ目標
- ユニットテスト: 80%以上（statements, branches, functions, lines）

---

## 前バージョン（PRD v2）からの主な変更点

### セッション管理
| 項目 | v2（旧） | v3（現在） |
|------|---------|-----------|
| ストレージ | localStorage | sessionStorage |
| 有効期限 | 24時間 | タブ/ウィンドウ終了時 |
| デバイスID | あり | なし |
| expiresAt | あり | なし |
| lastActiveAt | なし | あり（60秒間隔更新） |
| ニックネーム最小文字数 | 1文字 | 2文字 |

### コード実行
| 項目 | v2（旧） | v3（現在） |
|------|---------|-----------|
| 実行方式 | Web Worker | `new Function()`（メインスレッド） |
| タイムアウト | 1秒 | 5秒（5000ms） |
| レート制限ウィンドウ | 5秒 | 1分（60秒） |
| Strictモード | あり | なし（グローバル変数対応） |

### Blocklyブロック
| 項目 | v2（旧） | v3（現在） |
|------|---------|-----------|
| カスタムブロック数 | 5種類 | 8種類 |
| 追加ブロック | - | Assign Variable, Get Variable, Print |
| ツールボックスカテゴリ | 記載なし | 9カテゴリ（テスト/関数/変数/入出力/値/計算/論理/ループ/テキスト） |
| 組込みブロック | なし | math, text, logic, loop ブロック |
| テストコード構造 | 単純try/catch | IIFE + テストマーカー |

### UI/UX
| 項目 | v2（旧） | v3（現在） |
|------|---------|-----------|
| ワークスペース保存 | なし | localStorage自動保存 |
| エクスポート/インポート | なし | JSONファイル対応 |
| コンソール表示 | 基本テキスト | カラーコード + テスト背景ハイライト |
| アクティビティ追跡 | なし | 60秒間隔 |
| ヘッダ機能 | ログアウトのみ | ログアウト + ダウンロード + インポート |
| Buttonサイズ | default, sm, lg, icon | default, xs, sm, lg, icon + secondary |

---

## 将来の拡張予定

### Phase 2（未実装）
- [ ] アプリスペース: GUI入出力エリア
- [ ] アニメーション: プログラム結果の視覚化
- [ ] 課題システム: 段階的なTDD課題
- [ ] パラメータ付き関数定義（ミューテータUI）
- [ ] Run Function ブロック（引数渡し対応）

### Phase 3（未実装）
- [ ] Python対応
- [ ] バックエンド認証
- [ ] 進捗保存機能（サーバーサイド）
- [ ] 複数ユーザー対応
- [ ] Web Worker への実行エンジン移行

---

## 非機能要件

### パフォーマンス
- 初回ロード: 3秒以内
- コード実行: 5秒以内（タイムアウト）
- Blocklyエディタ: 動的インポート（SSR無効）で初回ロード最適化

### セキュリティ
- ユーザー入力の検証必須
- コード実行のバリデーション必須（禁止パターン検出）
- レート制限の実装必須
- CSPヘッダの設定

### ブラウザ対応
- Chrome（推奨）
- Firefox
- Edge
- Safari

---

## 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# 本番サーバー起動
npm run start

# ユニットテスト（ウォッチモード）
npm test

# ユニットテスト（CI）
npm run test:run

# E2Eテスト
npm run test:e2e

# E2Eテスト（UIモード）
npm run test:e2e:ui
```
