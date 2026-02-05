# TDD Tutorial - 製品要件定義書（PRD）

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
| フレームワーク | Next.js 16, React 19, TypeScript |
| UI | Tailwind CSS 4, shadcn/ui, Radix UI |
| 視覚的プログラミング | Blockly 12, react-blockly |
| バリデーション | Zod |
| テスト | Vitest (Unit), Playwright (E2E) |
| コード実行 | Web Worker サンドボックス |

### アーキテクチャ

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # ログイン画面
│   ├── workspace/         # TDDワークスペース
│   └── layout.tsx         # ダークテーマレイアウト
├── components/
│   ├── auth/              # ログインフォーム
│   ├── blockly/           # Blocklyエディタ・カスタムブロック
│   ├── console/           # 実行結果表示
│   ├── layout/            # ヘッダ
│   └── ui/                # 基本UIコンポーネント
├── hooks/                 # カスタムフック
├── lib/
│   ├── sandbox/           # コード実行エンジン
│   ├── session/           # セッション管理
│   ├── validation/        # 入力検証
│   └── errors/            # エラーメッセージ
└── types/                 # TypeScript型定義
```

---

## 画面構成

### 1. ログイン画面 (`/`)

**目的**: ユーザーの識別とセッション開始

**機能**:
- ニックネーム入力フォーム
  - 1〜20文字
  - 使用可能文字: ひらがな、カタカナ、漢字、英数字
  - 特殊文字・スペースは禁止
- セッション作成（ニックネーム + デバイスID + タイムスタンプ）
- 24時間でセッション有効期限切れ
- 既存セッションがある場合は自動ログイン

**データ保存**:
- localStorage使用
- デバイスID: ランダムUUID生成

### 2. ワークスペース画面 (`/workspace`)

**目的**: TDD体験のメイン作業エリア

**構成要素**:

#### ヘッダ
- アプリ名表示
- ニックネーム表示
- ログアウトボタン

#### Blocklyエディタ
- 左サイドバー: TDDブロックのツールボックス
- 中央: ブロック配置エリア
- ドラッグ&ドロップでブロック配置

#### 実行パネル
- 「実行」ボタン
- コンソール出力エリア（ターミナル風UI）
- テスト結果表示（SUCCESS / FAILED / INVALID TEST）

---

## TDDブロック仕様

### 1. TestCase（テストケース）ブロック

**目的**: テストの構造化

**セクション**:
- SETUP（準備）: 初期値の設定
- FUNCTION（実行）: テスト対象の関数呼び出し
- ASSERTIONS（検証）: 結果の確認

**生成コード構造**:
```javascript
try {
  // SETUP
  // FUNCTION
  // ASSERTIONS
  console.log('[SUCCESS] テスト合格');
} catch (error) {
  console.log('[FAILED] ' + error.message);
}
```

### 2. Assert Equals（検証）ブロック

**目的**: 値の比較検証

**形式**: `Assert [変数] equals [期待値]`

**動作**:
- 変数と期待値が一致 → 処理継続
- 不一致 → エラーをthrow

### 3. Function Definition（関数定義）ブロック

**目的**: 関数の作成

**機能**:
- 関数名の指定
- パラメータの動的追加（ミューテータUI）
- 関数本体の実装

**セキュリティ**:
- 関数名の検証（有効なJavaScript識別子のみ）
- 無効な名前はデフォルト値を使用

### 4. Run Function（関数実行）ブロック

**目的**: 定義した関数の呼び出し

**機能**:
- ワークスペース内の関数をドロップダウンで選択
- 引数の渡し方を指定

### 5. Set Parameter（パラメータ設定）ブロック

**目的**: 変数への値代入

**形式**: `Set [変数名] to [値]`

---

## コード実行システム

### 実行フロー

```
ユーザーが実行ボタンをクリック
    ↓
useCodeExecution.execute(code)
    ↓
executor.executeCode()
    ├─ rate-limiter.canExecute() → レート制限チェック
    ├─ validator.validateCode() → セキュリティ検証
    └─ worker.executeInWorker() → サンドボックス実行
        ↓
code-executor.worker.js（Web Worker）
    ↓
結果をConsoleOutputに表示
```

### セキュリティ層

#### 1. コードバリデーター
禁止パターン（19種類）:
- `eval()`, `Function()`
- `require()`, `import`
- `fetch`, `XMLHttpRequest`, `WebSocket`
- `window`, `document`, `localStorage`
- `process`, `global`
- 無限ループパターン（`while(true)`, `for(;;)`）

#### 2. レートリミッター
- 5秒間に最大10回の実行
- 超過時はエラーメッセージ表示

#### 3. Web Workerサンドボックス
- Strictモード強制
- 危険なグローバルオブジェクトをブロック
- 実行タイムアウト: 1秒
- カスタムconsoleオブジェクトで出力をインターセプト

#### 4. Content Security Policy (CSP)
- `script-src`: 'unsafe-eval', 'unsafe-inline'（Blockly動作に必要）
- `worker-src`: 'self', blob:
- iframe、外部スクリプト、信頼されていないソースをブロック

---

## エラーハンドリング

### 子ども向けエラーメッセージ変換

| エラータイプ | 日本語メッセージ |
|-------------|-----------------|
| SyntaxError | プログラムの書き方に間違いがあるよ |
| ReferenceError (not defined) | まだ作っていない変数を使おうとしているよ |
| TypeError (not a function) | 関数じゃないものを関数として使おうとしているよ |
| TypeError (null/undefined) | 空っぽのデータを使おうとしているよ |
| その他 | プログラムの実行中にエラーが起きたよ |

---

## セッション管理

### データ構造

```typescript
interface Session {
  id: string;          // ランダムUUID
  nickname: string;    // ユーザーニックネーム
  deviceId: string;    // デバイス識別子
  createdAt: number;   // 作成タイムスタンプ
  expiresAt: number;   // 有効期限（24時間後）
}
```

### 保存先
- localStorage（キー: `tdd-tutorial-session`）

### ライフサイクル
1. ログイン時にセッション作成
2. ページ読み込み時に有効期限チェック
3. 期限切れの場合は自動クリア
4. ログアウト時にセッション削除

---

## UIデザイン

### テーマ
- ダークテーマ（目に優しい）
- プライマリカラー: システムデフォルト

### コンポーネント
- Button: 複数バリアント（default, destructive, outline, ghost, link）
- Card: ヘッダ/コンテンツ/フッター構成
- Input: Tailwindスタイリング

### レスポンシブ
- デスクトップ優先設計
- 最小幅: 1024px推奨

---

## テスト要件

### ユニットテスト（Vitest）

| 対象 | テスト内容 |
|------|-----------|
| validator | 有効なコード通過、危険パターン検出 |
| rate-limiter | 制限内許可、超過時ブロック、リセット |
| session | ニックネーム検証、セッション管理 |
| errors | エラータイプ判定、メッセージ変換 |

### E2Eテスト（Playwright）

| 対象 | テスト内容 |
|------|-----------|
| login | ページ表示、ログイン成功、バリデーションエラー、ログアウト |
| code-execution | エディタ読み込み、実行ボタン動作、コンソール出力 |

### カバレッジ目標
- ユニットテスト: 80%以上

---

## 将来の拡張予定

### Phase 2（未実装）
- [ ] アプリスペース: GUI入出力エリア
- [ ] アニメーション: プログラム結果の視覚化
- [ ] 課題システム: 段階的なTDD課題

### Phase 3（未実装）
- [ ] Python対応
- [ ] バックエンド認証
- [ ] 進捗保存機能
- [ ] 複数ユーザー対応（サーバーサイド）

---

## 非機能要件

### パフォーマンス
- 初回ロード: 3秒以内
- コード実行: 1秒以内（タイムアウト）

### セキュリティ
- ユーザー入力の検証必須
- コード実行のサンドボックス化必須
- レート制限の実装必須

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
