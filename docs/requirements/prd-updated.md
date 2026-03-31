# TDD Tutorial App - 製品要件定義書（PRD）

> **このドキュメントの目的**: AIにこのPRDを読み込ませ、実装計画の策定からコード生成までを一貫して行えるようにすること。現在の本番環境の仕様をすべて網羅している。

---

## 1. プロダクト概要

### 1.1 What（何を作るか）

Google Blocklyを使ったブロック型ビジュアルプログラミング環境で、TDD（Test-Driven Development）の考え方を体験学習できるWebアプリケーション。

### 1.2 Who（誰のためか）

CS（コンピュータサイエンス）の授業を受ける生徒（主に小中高生）。英語プログラムと日本語プログラムの両方に対応する。

### 1.3 Why（なぜ作るか）

- TDDの基本サイクル「テストを書く → 実装する → テストを実行して検証する」を、テキストコーディングなしで体験させたい
- ブロックベースUIでプログラミングの障壁を下げる
- 安全なサンドボックスで自由にコードを実行させる

### 1.4 コアコンセプト

1. **テストファースト**: テストブロックを先に配置し、関数の中身を後から埋める
2. **視覚的フィードバック**: テスト結果がブロックの色（緑=合格、赤=失敗）で即座にわかる
3. **段階的学習**: ガイド → サンプルコード挿入 → チュートリアル → 自由制作

---

## 2. 技術スタック

| カテゴリ | 技術 | バージョン | 備考 |
|---------|------|-----------|------|
| フレームワーク | Next.js (App Router) | 16.x | SSR + CSR |
| UI | React | 19.x | |
| 言語 | TypeScript | 5.x | strict mode |
| スタイリング | Tailwind CSS | 4.x | `@tailwindcss/postcss` |
| UIライブラリ | Radix UI | - | Label, Slot, DropdownMenu |
| CSSユーティリティ | class-variance-authority, clsx, tailwind-merge | - | `cn()` ヘルパー |
| アイコン | Lucide React | 0.563+ | |
| ビジュアルプログラミング | Blockly | 12.x | |
| Blockly React連携 | react-blockly | 9.x | （参考用、実際はBlockly.inject直接使用） |
| バリデーション | Zod | 4.x | |
| ユニットテスト | Vitest | 4.x | jsdom環境、カバレッジ80%閾値 |
| テストユーティリティ | @testing-library/react, @testing-library/jest-dom | - | |
| E2Eテスト | Playwright | 1.58+ | Chromium |
| コード実行 | `new Function()` | - | メインスレッド、サンドボックス |

### 2.1 重要な技術的判断

- **`new Function()` を使用**: Web Workerではなくメインスレッドで実行。Blockly生成コードがグローバル変数を使うため `"use strict"` は付けない
- **`unsafe-eval` が必要**: CSPヘッダで `script-src 'self' 'unsafe-eval' 'unsafe-inline'` を設定（Blockly + `new Function()` に必要）
- **BlocklyEditor は動的インポート**: `next/dynamic` でSSR無効化（Blocklyがwindow/documentに依存するため）
- **react-blockly は不使用**: 直接 `Blockly.inject()` を使用し、`forwardRef` + `useImperativeHandle` で親コンポーネントにAPIを公開

---

## 3. プロジェクト構造

```
src/
├── app/                           # Next.js App Router
│   ├── layout.tsx                # ルートレイアウト（I18nProvider, ダークテーマ, フォント）
│   ├── page.tsx                  # ログインページ（/）
│   ├── globals.css               # グローバルCSS + Blocklyカスタマイズ
│   ├── workspace/
│   │   └── page.tsx              # メインワークスペース（/workspace）
│   ├── guide/
│   │   └── page.tsx              # 使い方ガイド（/guide）
│   └── tutorial/
│       ├── en/page.tsx           # 英語チュートリアル（/tutorial/en）
│       └── ja/page.tsx           # 日本語チュートリアル（/tutorial/ja）
│
├── components/
│   ├── blockly/
│   │   ├── blockly-editor.tsx    # Blocklyエディタ本体（ref API公開）
│   │   ├── toolbox.ts            # ツールボックス定義（9カテゴリ）
│   │   ├── blocks/               # カスタムブロック定義（8種類）
│   │   │   ├── test-case.ts
│   │   │   ├── assert-equals.ts
│   │   │   ├── function-definition.ts
│   │   │   ├── call-function.ts
│   │   │   ├── set-variable.ts
│   │   │   ├── assign-variable.ts
│   │   │   ├── get-variable.ts
│   │   │   ├── print.ts
│   │   │   └── index.ts          # 一括登録
│   │   ├── generators/
│   │   │   └── javascript.ts     # ブロック→JSコード生成
│   │   └── icons/
│   │       └── collapse-icon.ts  # テストケース折りたたみアイコン
│   │
│   ├── console/
│   │   └── console-output.tsx    # コンソール出力パネル
│   │
│   ├── auth/
│   │   └── login-form.tsx        # ログインフォーム
│   │
│   ├── layout/
│   │   └── header.tsx            # 共通ヘッダ
│   │
│   ├── tutorial/
│   │   └── tutorial-page.tsx     # チュートリアル表示コンポーネント
│   │
│   └── ui/                       # shadcn/ui ベースコンポーネント
│       ├── button.tsx
│       ├── card.tsx
│       ├── dropdown-menu.tsx
│       ├── input.tsx
│       └── label.tsx
│
├── hooks/
│   ├── use-session.ts            # セッション管理
│   └── use-code-execution.ts     # コード実行・テスト結果解析
│
├── lib/
│   ├── sandbox/
│   │   ├── executor.ts           # CodeExecutor（タイムアウト・レート制限）
│   │   ├── executor.test.ts
│   │   ├── rate-limiter.ts       # RateLimiter
│   │   └── rate-limiter.test.ts
│   ├── session/
│   │   ├── session-manager.ts    # セッションCRUD
│   │   └── session-manager.test.ts
│   ├── validation/
│   │   ├── code-validator.ts     # 禁止パターン検出
│   │   └── code-validator.test.ts
│   ├── errors/
│   │   ├── error-translator.ts   # エラーメッセージ翻訳
│   │   └── error-translator.test.ts
│   ├── sample-codes/
│   │   ├── types.ts              # SampleCode型
│   │   ├── index.ts              # レジストリ
│   │   └── admission-fee-en.ts   # サンプル: 入場料関数
│   ├── parse-text.tsx            # マークダウン風テキストパーサー（**太字**対応）
│   └── utils.ts                  # cn() ユーティリティ
│
├── i18n/
│   ├── context.tsx               # I18nProvider, useI18n フック
│   ├── index.ts                  # public exports
│   ├── types.ts                  # Translations 型定義
│   └── translations/
│       ├── ja.ts                 # 日本語翻訳
│       └── en.ts                 # 英語翻訳
│
├── guide/
│   ├── ja-guide.ts               # 日本語ガイド内容
│   └── en-guide.ts               # 英語ガイド内容
│
├── tutorial/
│   ├── types.ts                  # TutorialData, TutorialStep 型
│   ├── ja-tutorial.ts            # 日本語チュートリアル
│   └── en-tutorial.ts            # 英語チュートリアル
│
├── types/
│   ├── session.ts                # Session, SessionValidationResult
│   └── execution.ts              # ExecutionResult, CodeValidation
│
└── test/
    └── setup.ts                  # Vitest セットアップ（matchMedia, ResizeObserver モック）

e2e/
├── login.spec.ts                 # ログインE2Eテスト
└── workspace.spec.ts             # ワークスペースE2Eテスト

public/
├── 1.png - RED.png, GREEN.png    # チュートリアル用スクリーンショット
└── fees.png                      # 料金表画像
```

---

## 4. 画面仕様

### 4.1 ログイン画面（`/`）

**目的**: ニックネームによるセッション開始

**UI構成**:
- 中央配置のカードレイアウト
- Code2アイコン付きタイトル
- ニックネーム入力フォーム
- 言語切替ボタン（ヘッダ内）

**機能**:
- ニックネームバリデーション:
  - 2〜20文字
  - 使用可能: 英数字、ひらがな、カタカナ、漢字、アンダースコア
  - 禁止: スペース、特殊文字
- セッション作成（`session_{timestamp}_{random}` 形式のID）
- 既存セッションがあればワークスペースへ自動リダイレクト
- バリデーションエラーのインライン表示

**データ保存**: sessionStorage（キー: `tdd-tutorial-session`）

### 4.2 ワークスペース画面（`/workspace`）

**目的**: TDD体験のメインエリア

**セッション保護**: セッションがなければ `/` にリダイレクト

**レイアウト**: ヘッダ + メインエリア（Blocklyエディタ flex-1 + コンソール固定幅380px）

#### 4.2.1 ヘッダ

| 要素 | 説明 |
|------|------|
| アプリ名 | Code2アイコン + タイトル |
| ガイドリンク | `/guide` へのリンク（BookTextアイコン） |
| チュートリアルドロップダウン | 日本語版・英語版の選択（新しいタブで開く） |
| サンプルコードドロップダウン | サンプル関数をワークスペースに挿入 |
| ダウンロード | ワークスペースをJSONファイルとして保存 |
| インポート | JSONファイルからワークスペースを復元（上書き確認ダイアログあり） |
| 言語切替 | JA ↔ EN トグル（Globeアイコン） |
| ニックネーム表示 | 「こんにちは、{nickname}さん」 |
| ログアウト | セッション削除 → ログイン画面へ |

#### 4.2.2 Blocklyエディタ

**初期化**:
- `Blockly.inject()` で直接生成（`next/dynamic` でSSR無効化）
- カスタムダークテーマ適用
- グリッド表示（間隔20px、スナップ有効）
- ゴミ箱・スクロールバー表示
- 起動時に最初のカテゴリを自動オープン

**操作**:
- ドラッグ&ドロップでブロック配置
- マウスホイールでスクロール
- Ctrl+マウスホイールでズーム（0.3x〜3x）
- ズームコントロールボタン

**永続化**:
- localStorageキー: `tdd-tutorial-workspace`
- BLOCK_CHANGE, BLOCK_CREATE, BLOCK_DELETE, BLOCK_MOVE イベントで自動保存
- ページ読み込み時に自動復元
- `Blockly.serialization.workspaces` API使用

**テスト結果の視覚フィードバック**:
- デフォルト: 青（hue 210）
- 合格: 緑（hue 120）
- 失敗: 赤（hue 0）
- 失敗時: ブロック下部にエラーメッセージバブル表示（`Blockly.bubbles.TextBubble` API）
- ドラッグ中もバブルがブロックに追従（`requestAnimationFrame` で追跡）

**コード生成ルール**:
- トップレベルの `function_definition` と `test_case` ブロックのみからコード生成
- 未接続のルーズブロックは無視
- 関数定義を先、テストケースを後に自動並べ替え

**言語切替対応**:
- ロケール変更時にブロック定義・ジェネレータ・ツールボックスを再登録
- ワークスペースの状態を保存→クリア→再ロードして新しいブロック定義を反映

**ref API（`BlocklyEditorHandle`）**:
```typescript
interface BlocklyEditorHandle {
  handleExecute: () => void           // コード生成→実行トリガー
  isReady: boolean                    // エディタ準備状態
  exportWorkspace: () => string | null // ワークスペースJSON出力
  importWorkspace: (json: string) => boolean // ワークスペースJSON読み込み
  insertBlocks: (blockStates: object[]) => boolean // サンプルブロック挿入
  resetBlockColours: () => void       // 全テストブロックの色をリセット
  setTestResult: (blockId: string, passed: boolean, errorMessage?: string) => void
}
```

#### 4.2.3 コンソール出力パネル

**UI**:
- 「実行」ボタン（実行中・未準備時は無効化）
- ターミナル風の黒背景出力エリア
- 最新メッセージへ自動スクロール

**メッセージ表示**:
| type | 色 | 用途 |
|------|-----|------|
| `info` | 青 | テスト開始、一般情報 |
| `success` | 緑 | テスト合格、実行完了 |
| `error` | 赤 | テスト失敗、エラー |
| `output` | 白/デフォルト | console.log出力、テスト間空行 |

- テスト結果行（✓ 合格 / ✗ 失敗）に背景ハイライト（緑/赤）
- テスト間に空行を挿入

**ConsoleMessage型**:
```typescript
interface ConsoleMessage {
  id: string
  type: 'output' | 'error' | 'success' | 'info'
  content: string
  timestamp: Date
}
```

### 4.3 ガイド画面（`/guide`）

**目的**: アプリの使い方を説明するビジュアルガイド

**構成**:
- ヘッダ（共通）
- イントロ文
- セクション一覧（アイコン + アクセントカラー付き）:
  1. App Overview（アプリ概要）
  2. Logging In（ログイン）
  3. Create an Empty Function（空関数の作成）
  4. Insert a Sample Function（サンプル挿入）
  5. Create a Test Case（テストケース作成）
  6. Run Tests（テスト実行）
  7. Complete the Function（関数の完成）
  8. Final Test Run（最終テスト）
  9. Export / Import（エクスポート/インポート）
  10. Insert Sample Functions（サンプル関数一覧）

**テキスト内の`**太字**`記法をパース**: `parseText()` ユーティリティで `<strong>` タグに変換

### 4.4 チュートリアル画面（`/tutorial/en`, `/tutorial/ja`）

**目的**: 「入場料関数」を題材にしたステップバイステップのTDDチュートリアル

**構成**:
- ヘッダ（共通）
- タイトル + サブタイトル + イントロ文
- 料金表（feeTable）
- ステップ一覧（アコーディオン展開）
  - 各ステップ: 番号、タイトル、説明、ポイントリスト、ヒント、期待結果（pass/fail/partial）、スクリーンショット
- ディスカッション（質問 + ヒント）
- ワークスペースに戻るリンク

**TutorialData型**:
```typescript
interface TutorialStep {
  id: string
  stepNumber: number
  title: string
  description: string
  points: string[]
  tip?: string
  expectedResult?: 'pass' | 'fail' | 'partial'
  images?: string[]
}

interface TutorialData {
  pageTitle: string
  subtitle: string
  intro: string
  feeTable: {
    title: string
    rows: { label: string; age: string; fee: string }[]
  }
  steps: TutorialStep[]
  discussion: {
    title: string
    questions: { question: string; hint: string }[]
  }
  backToWorkspace: string
}
```

**チュートリアルの流れ**（入場料関数の例）:
1. 空の `getFee` 関数を作成
2. テストを先に書く（age=12→500, age=15→800, age=18→1000）
3. テスト実行 → 全て失敗（RED）
4. 関数の中身をif/elseで実装
5. テスト再実行 → 全て合格（GREEN）
6. 追加テスト・リファクタリング

---

## 5. カスタムBlocklyブロック仕様

### 5.1 ブロック一覧（8種類）

| # | ブロック名 | type | 色(hue) | 接続 | 目的 |
|---|-----------|------|---------|------|------|
| 1 | テストケース | `test_case` | 210 | なし（トップレベル） | テストの構造化（Setup→Execute→Assert） |
| 2 | 検証 | `assert_equals` | 120 | statement | 値の等価比較 |
| 3 | 関数定義 | `function_definition` | 290 | なし（トップレベル） | 引数なし関数の定義 |
| 4 | 関数呼び出し | `call_function` | 290 | statement | 引数なし関数の呼び出し |
| 5 | 変数作成 | `set_variable` | 330 | statement | グローバル変数の作成と初期値設定 |
| 6 | 変数代入 | `assign_variable` | 330 | statement | 既存変数への再代入 |
| 7 | 変数取得 | `get_variable` | 330 | output（値） | 変数の値を取得 |
| 8 | 出力 | `print` | 160 | statement | console.log出力 |

### 5.2 コード生成仕様

#### test_case → JavaScript

```javascript
// テスト: {テスト名}
(function() {
  console.log("[TEST_START] {テスト名}");
  console.log("[TEST_BLOCK_ID] {blockId}");
  try {
    // --- Setup ---
    {SETUPセクションのコード}
    // --- Execute ---
    {EXECUTEセクションのコード}
    // --- Assert ---
    {ASSERTセクションのコード}
    console.log("[TEST_PASS] {テスト名}");
  } catch (error) {
    console.log("[TEST_ERROR] " + error.message);
    console.log("[TEST_FAIL] {テスト名}");
  }
  console.log("[TEST_END]");
})();
```

#### assert_equals → JavaScript

```javascript
if (actual !== expected) {
  throw new Error("期待値: " + expected + " / 実際: " + actual);
  // ※ メッセージはi18nで切り替え
}
```

#### function_definition → JavaScript

```javascript
function myFunction() {
  // body
}
```

#### その他のブロック

- `call_function`: `functionName();`
- `set_variable`: `variableName = value;` （`let`/`var` なし、グローバル変数として扱う）
- `assign_variable`: `variableName = value;`
- `get_variable`: 変数名をそのまま値として返す
- `print`: `console.log(text);`

### 5.3 ツールボックス構成（9カテゴリ）

| カテゴリ | 色(hue) | 含まれるブロック |
|---------|---------|-----------------|
| テスト | 210 | test_case, assert_equals |
| 関数 | 290 | function_definition, call_function |
| 変数 | 330 | set_variable, assign_variable, get_variable |
| 入出力 | 160 | print |
| 値 | 160 | math_number, text, logic_boolean |
| 計算 | 230 | math_arithmetic, math_single |
| 論理 | 210 | logic_compare, logic_operation, logic_negate, controls_if |
| ループ | 120 | controls_repeat_ext, controls_whileUntil, controls_for |
| テキスト | 160 | text, text_join, text_length |

### 5.4 テストマーカープロトコル

コード実行後の出力を以下のマーカーで構造化解析する:

| マーカー | 意味 | 処理 |
|---------|------|------|
| `[TEST_BLOCK_ID] {id}` | テストブロックのBlockly ID | 結果マッピング用に保持 |
| `[TEST_START] {name}` | テスト開始 | info メッセージ |
| `[TEST_PASS] {name}` | テスト合格 | success メッセージ + ブロック緑化 |
| `[TEST_ERROR] {msg}` | エラー詳細 | error メッセージ（バブル表示用に保持） |
| `[TEST_FAIL] {name}` | テスト失敗 | error メッセージ + ブロック赤化 + バブル表示 |
| `[TEST_END]` | テスト完了 | ID・エラーリセット + 空行挿入 |

---

## 6. コード実行システム

### 6.1 実行パイプライン

```
実行ボタンクリック
  → BlocklyEditor.handleExecute()
    → Blocklyワークスペースからコード生成
      → 関数定義をテストケースの前に並べ替え
    → useCodeExecution.execute(code, onTestResult)
      → CodeExecutor.execute(code, translations)
        → RateLimiter.canExecute() チェック
        → validateCode(code) セキュリティ検証
        → new Function('console', code)(customConsole) 実行
          → カスタムconsoleオブジェクトで出力キャプチャ
          → Promise.race でタイムアウト制御（5秒）
          → エラー時は errorTranslator で翻訳
      → テストマーカー解析
        → onTestResult コールバックでブロック色変更
      → ConsoleOutput に表示
```

### 6.2 CodeExecutor

```typescript
class CodeExecutor {
  constructor(options?: {
    timeoutMs?: number           // デフォルト: 5000ms
    maxExecutionsPerMinute?: number // デフォルト: 10
  })
  execute(code: string, t: Translations): Promise<ExecutionResult>
  getRemainingExecutions(): number
  getTimeUntilReset(): number
}
```

- 遅延初期化（`useCodeExecution` フック内で初回実行時に生成）
- カスタムconsole: `log`, `error`, `warn` をインターセプト
- `"use strict"` なし（グローバル変数許可のため）

### 6.3 RateLimiter

```typescript
class RateLimiter {
  constructor(options?: {
    maxRequests?: number  // デフォルト: 10
    windowMs?: number     // デフォルト: 60000ms
  })
  canExecute(): boolean
  recordExecution(): void
  getRemainingRequests(): number
  getTimeUntilReset(): number
  reset(): void
}
```

- スライディングウィンドウ方式（タイムスタンプ配列管理）

### 6.4 コードバリデーター（禁止パターン）

| カテゴリ | 禁止パターン |
|---------|------------|
| 実行系 | `eval()`, `new Function()` |
| DOM操作 | `document`, `window` |
| グローバル | `globalThis`, `process`, `require` |
| ネットワーク | `fetch()`, `XMLHttpRequest`, `WebSocket` |
| ストレージ | `localStorage`, `sessionStorage`, `indexedDB` |
| 危険API | `import()`, `Worker`, `SharedArrayBuffer` |

各違反: `{ pattern: string, message: string, severity: 'error' | 'warning' }`

### 6.5 エラー翻訳（translateError）

JavaScriptエラーを生徒向けのフレンドリーなメッセージに変換。i18nで言語切替対応。

| エラー種別 | パターン | 翻訳例（日本語） | ヒント |
|-----------|---------|-----------------|-------|
| SyntaxError | Unexpected token | プログラムの書き方に間違いがあるよ | ブロックの組み合わせを確認してみよう |
| SyntaxError | Unexpected end | プログラムが途中で終わっているよ | ブロックが足りないかも |
| ReferenceError | is not defined | まだ作っていないものを使おうとしているよ | 変数や関数を先に作ってね |
| TypeError | is not a function | 関数じゃないものを呼び出しているよ | 関数ブロックで先に定義してね |
| TypeError | Cannot read property | 空っぽのデータを使おうとしているよ | データが入っているか確認してね |
| RangeError | Maximum call stack | 終わらないループになっているよ | 自分を呼んでいないか確認してね |

```typescript
interface ErrorTranslation {
  friendlyMessage: string
  originalMessage: string
  hint: string
  errorType: string
}
```

---

## 7. セッション管理

### 7.1 データ構造

```typescript
interface Session {
  id: string           // "session_{timestamp}_{random}"
  nickname: string
  createdAt: Date
  lastActiveAt: Date
}

interface SessionValidationResult {
  valid: boolean
  errors: string[]
}
```

### 7.2 ストレージ

- **sessionStorage** 使用（キー: `tdd-tutorial-session`）
- タブ/ウィンドウを閉じると自動消失
- JSON.stringify/parseでシリアライズ（日付はパース時に復元）

### 7.3 管理関数

| 関数 | 説明 |
|------|------|
| `validateNickname(nickname)` | バリデーション（2-20文字、許可文字チェック） |
| `createSession(nickname)` | 新規作成・保存 |
| `getSession()` | 取得（日付パース含む） |
| `clearSession()` | 削除 |
| `updateSessionActivity()` | `lastActiveAt` 更新 |

### 7.4 useSession フック

```typescript
function useSession(): {
  session: Session | null
  isLoading: boolean
  isLoggedIn: boolean
  login: (nickname: string) => SessionValidationResult
  logout: () => void
  updateActivity: () => void
}
```

### 7.5 アクティビティ追跡

- ワークスペース画面で60秒間隔のsetIntervalで `updateSessionActivity()` を呼び出し

---

## 8. 国際化（i18n）

### 8.1 アーキテクチャ

- **React Context** ベース（`I18nProvider`, `useI18n` フック）
- デフォルトロケール: `ja`
- 対応言語: `ja`, `en`
- ロケール保存: localStorage（キー: `tdd-tutorial-locale`）
- HTMLの `lang` 属性も動的に更新

### 8.2 useI18n フック

```typescript
function useI18n(): {
  locale: Locale        // 'ja' | 'en'
  t: Translations       // 翻訳オブジェクト
  toggleLocale: () => void  // ja ↔ en 切替
}
```

### 8.3 翻訳キー構造（Translations型）

```typescript
interface Translations {
  common: { loading, error }
  header: { title, greeting(nickname), logout, guide, guideTooltip, download, downloadTooltip, import, importTooltip, sampleCode, sampleCodeTooltip, tutorial, tutorialTooltip }
  login: { title, description, nicknameLabel, nicknamePlaceholder, submitButton, submitting }
  validation: { nicknameRequired, nicknameTooShort, nicknameTooLong, nicknameInvalidChars }
  console: { title, executing, execute, emptyMessage, noCode, executionStart, executionComplete(ms), executionError, testStart(name), testPass(name), testFail(name) }
  workspace: { editorLoading, fileTooLarge, confirmOverwrite, importFailed, readFailed, selectFile }
  errors: { unexpectedToken(token), checkBlocks, unexpectedEnd, checkCompletion, notDefined(name), checkNames, notAFunction(name), undefinedProperty, nullProperty, stackOverflow, genericError(message), timeout, rateLimitExceeded, forbiddenCode(violations) }
  blockly: {
    categories: { test, functions, variables, io, values, math, logic, loops, text }
    blocks: {
      testCase: { label, nameDefault, setup, execute, assert, tooltip }
      assertEquals: { message, tooltip }
      functionDef: { label, tooltip }
      callFunction: { suffix, tooltip }
      setVariable: { message, tooltip }
      assignVariable: { message, tooltip }
      getVariable: { message, tooltip }
      print: { label, tooltip }
    }
    codeGen: { testComment(name), setupComment, executeComment, assertComment, expected, actual, assertErrorExpression(actual, expected) }
  }
}
```

### 8.4 言語切替時の処理フロー

1. `toggleLocale()` 呼び出し
2. localStorage に新しいロケールを保存
3. `document.documentElement.lang` を更新
4. Context更新 → 全コンポーネント再レンダリング
5. BlocklyEditor内: ブロック再登録 → ツールボックス更新 → ワークスペース再ロード

---

## 9. サンプルコード

### 9.1 システム

```typescript
interface SampleCode {
  id: string
  nameJa: string
  nameEn: string
  descriptionJa?: string
  descriptionEn?: string
  blocks: object[]  // Blocklyシリアライズ形式のブロック状態配列
}
```

- `getSampleCodes()`: 全サンプル取得
- `getSampleById(id)`: ID指定取得
- ヘッダのドロップダウンから選択 → `insertBlocks()` で挿入

### 9.2 現在のサンプル

**入場料関数（Admission Fee）**:
- ID: `admission-fee`
- ロジック: 年齢に応じた料金判定
  - 0-11歳: ¥500
  - 13-16歳: ¥800
  - 18歳以上: ¥1000
  - その他: ¥0
- Blocklyシリアライズ形式で `controls_if`（elseIfCount: 2, hasElse: true）、`logic_operation`, `logic_compare`, `assign_variable`, `math_number`, `get_variable` を使用

---

## 10. UIデザイン仕様

### 10.1 テーマ

- **ダークテーマ固定**: `<html class="dark">`
- CSS変数: OKLch色空間ベース
- フォント: Geist Sans（本文）、Geist Mono（コード・コンソール）

### 10.2 カラーパレット

| 用途 | 色 |
|------|-----|
| 背景（メイン） | gray-900 系 |
| 背景（カード） | gray-800 |
| ボーダー | gray-700 |
| テキスト | gray-100（メイン）、gray-400（セカンダリ） |
| アクセント | blue-500 |
| 成功 | green |
| エラー | red |
| 情報 | blue |

### 10.3 Blocklyテーマ

- ワークスペース背景: ライトグレー（#e5e7eb）
- ツールボックス: ダークグレー（#374151）
- フライアウトスクロールバー: 非表示
- フライアウトディバイダー: 透明
- ブロック色: カテゴリごとのhue値（上記ツールボックス参照）

### 10.4 レイアウト

- デスクトップ優先（最小幅1024px推奨）
- ヘッダ: full-width, flex, border-bottom, bg-gray-900
- ワークスペース: flex（エディタ flex-1 + コンソール w-[380px]）
- コンソール: 固定幅、Card内にターミナル風表示

### 10.5 UIコンポーネント（shadcn/ui ベース）

- **Button**: バリアント（default, destructive, outline, secondary, ghost, link）、サイズ（default, xs, sm, lg, icon）
- **Card**: CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction
- **Input**: Tailwindスタイリング、ダークモード対応
- **Label**: Radix UI Labelラッパー
- **DropdownMenu**: Radix UI DropdownMenuラッパー

---

## 11. 設定ファイル

### 11.1 next.config.ts

```typescript
// CSPヘッダ設定
headers: [{
  source: '/(.*)',
  headers: [{
    key: 'Content-Security-Policy',
    value: "script-src 'self' 'unsafe-eval' 'unsafe-inline'; worker-src 'self' blob:;"
  }]
}]
```

### 11.2 tsconfig.json

- Target: ES2017
- Strict mode: enabled
- パスエイリアス: `@/*` → `./src/*`
- JSX: react-jsx

### 11.3 vitest.config.ts

- 環境: jsdom
- グローバル: true
- セットアップ: `./src/test/setup.ts`
- カバレッジ閾値: 80%（statements, branches, functions, lines）
- 除外: node_modules, e2e, テストファイル, types, 設定ファイル

### 11.4 playwright.config.ts

- テストディレクトリ: `./e2e`
- ブラウザ: Chromium
- ベースURL: `http://localhost:3000`
- Webサーバー: `npm run dev`
- レポーター: HTML
- リトライ: CI時2回、ローカル0回

### 11.5 globals.css

- Tailwind CSS 4 の `@import` / `@theme` ディレクティブ
- Blocklyカスタマイズ:
  - `.blocklyFlyoutScrollbar { display: none }`
  - `.blocklyFlyoutBackground { stroke: transparent }`
  - ワークスペース背景色設定

---

## 12. テスト仕様

### 12.1 ユニットテスト（Vitest）

| 対象 | ファイル | テスト内容 |
|------|---------|-----------|
| CodeExecutor | `executor.test.ts` | デフォルト/カスタムコンストラクタ、正常実行、console.logキャプチャ、構文/実行時エラー、禁止パターン拒否、実行時間追跡、レート制限 |
| RateLimiter | `rate-limiter.test.ts` | 制限内/超過判定、ウィンドウ経過後リセット、残数計算、手動リセット |
| SessionManager | `session-manager.test.ts` | ニックネーム検証（有効/無効パターン）、セッションCRUD、ID一意性、日付パース |
| CodeValidator | `code-validator.test.ts` | 有効コード通過、禁止パターン検出、複数違反、大文字小文字区別 |
| ErrorTranslator | `error-translator.test.ts` | 各種エラー変換、ErrorTranslation構造体検証 |

### 12.2 E2Eテスト（Playwright）

| 対象 | ファイル | テスト内容 |
|------|---------|-----------|
| ログイン | `login.spec.ts` | ページ表示、有効ニックネームでログイン、空/短い/特殊文字エラー、日本語ニックネーム対応 |
| ワークスペース | `workspace.spec.ts` | コンポーネント表示、Blocklyロード、ログアウト、セッションなしリダイレクト、コード実行・出力 |

### 12.3 テストセットアップ

`src/test/setup.ts`:
- `window.matchMedia` モック
- `ResizeObserver` モック
- `@testing-library/jest-dom` インポート

---

## 13. データフロー全体図

```
[ユーザー入力]
    ↓
[LoginForm] → validateNickname() → createSession() → sessionStorage
    ↓ (リダイレクト)
[WorkspacePage]
    ├─ useSession() → セッション読み込み・アクティビティ追跡
    ├─ useCodeExecution() → CodeExecutor遅延初期化
    └─ BlocklyEditor (ref)
        ├─ Blockly.inject() → ワークスペース生成
        ├─ localStorage ⇄ 自動保存/復元
        ├─ handleExecute()
        │   ├─ コード生成（関数→テスト順）
        │   └─ execute(code, onTestResult)
        │       ├─ RateLimiter チェック
        │       ├─ validateCode() チェック
        │       ├─ new Function() 実行
        │       ├─ テストマーカー解析
        │       ├─ onTestResult → setTestResult() → ブロック色変更 + バブル
        │       └─ ConsoleOutput に表示
        ├─ exportWorkspace() / importWorkspace()
        └─ insertBlocks() ← サンプルコード
```

---

## 14. 開発コマンド

```bash
npm run dev          # 開発サーバー起動
npm run build        # プロダクションビルド
npm run start        # 本番サーバー起動
npm test             # ユニットテスト（ウォッチモード）
npm run test:run     # ユニットテスト（CI）
npm run test:e2e     # E2Eテスト
npm run test:e2e:ui  # E2Eテスト（UIモード）
```

---

## 15. 実装上の注意点

### AIへの指示事項

このPRDを基に実装する際、以下の点に注意:

1. **Blocklyブロックの登録はi18n対応**: 全ブロック定義が `Translations` オブジェクトを受け取り、ラベルを動的に設定する。ロケール変更時に再登録が必要。

2. **グローバル変数の意図的使用**: `set_variable` が `let`/`var` なしで `name = value;` を生成するのは意図的。テスト（IIFE内）から関数内のグローバル変数にアクセスするため。

3. **テスト結果のブロック↔コンソール連携**: `[TEST_BLOCK_ID]` マーカーで、コンソール出力とBlocklyブロックIDを紐付ける。これにより正しいブロックの色変更とバブル表示が可能。

4. **エラーバブルのライフサイクル管理**: `Blockly.bubbles.TextBubble` で生成するバブルは、ドラッグ追従（requestAnimationFrame）、ロケール変更時の一括dispose、ワークスペースdispose時のクリーンアップが必要。

5. **Blocklyワークスペースの初期化順序**: registerBlocks → registerGenerators → Blockly.inject → loadWorkspace → openFirstCategory。ロケール変更時は saveState → reRegister → clear → loadState。

6. **CSP設定**: `unsafe-eval` は必須（Blockly内部 + `new Function()` で使用）。

7. **`next/dynamic` によるSSR無効化**: BlocklyEditorは `ssr: false` で動的インポート必須。Blocklyがブラウザ専用API（document, window）に依存するため。

8. **コード生成の並べ替えロジック**: トップレベルブロックを走査し、`function_definition` タイプを先に、`test_case` タイプを後に配置する。それ以外のルーズブロックは無視。
