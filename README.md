# Shion Race: The Manufactured Utopia — A Clockwork Fox Doll

RimWorld 1.6 向けの Shion Core です。三人の機械狐娘型 Shion による独立遠征、物理 Thing を保持する Core 独自 Storage、同盟通貨 Account、Kombinat の三段階自動生産を一つの α ゲームループとして実装します。

## αで遊べる内容

- バニラ `Human` を継承した、無性・不老・食事不要の Shion 種族
- Biotech 標準 Gene による不妊、猫耳、毛皮の尾、耐毒性
- `Shion_Cell` など五つの物理資源と、三段階生産用の中間品・完成品
- `ThingOwner` が identity・品質・耐久・Comp を保持する Core Storage
- operation ID 付きの直接転送、手動入庫、個数・全量排出、破壊時の安全な Drop
- World 保存される同盟 Account と、冪等な `reserve → commit/release`
- 「原料 → Relay Blank → Calibrated Core → Clockwork Relay」の三段階生産
- Core＋Royalty／Ideology／Biotech／Anomaly／Odyssey の通常Recipeから自動生成する量産カタログ
- Kombinat Terminal からの発注、取消、Storage 予約確認、無バッファ生産
- 概要、在庫、生産、設備、物流、財務を追加Page Defで拡張できる内政管理UI
- VEF Animated Graphic、Fleck、Custom Overlay
- 日本語・英語 UI

公式量産カタログは、実際に存在する公開Recipe Defから候補を生成します。研究、材料Filter、設備利用者、物理Item出力を満たす通常レシピを扱い、アルコテック技術品、手術、特殊生成物、派閥・ミーム等の文脈依存品、反復Recipeを持たないクエスト／特殊入手品は除外します。製品名の固定リストではなく、`KombinatMassProductionPolicyDef`が対象package、除外技術、品質、作業量、通貨費を所有します。

画像は α 用の識別可能な仮アートです。最終アート、Pawn Foundry、Clone/Archive、Red Star 運用、The Hive、軍装、複雑な身体 Module は対象外です。

## Shion 身体のバニラ優先実装

HAR は不要です。Shion のゲーム内表現は次の公式機構を使います。

| 要件 | 実装 |
| --- | --- |
| 人型 Pawn・服・通常 UI | Verse 標準 `ThingDef ParentName="Human"` とバニラ Pawn renderer |
| 食事不要・生物学的加齢停止 | Biotech `GeneDef.disablesNeeds` と `biologicalAgeTickFactorFromAgeCurve` |
| 生物学的生殖なし | Biotech 標準 `Sterile` Gene と無性の `RaceProperties` |
| 狐娘型の外見 | Biotech 標準 `Ears_Cat` と `Tail_Furry` Gene |
| 機械身体 | バニラ `RaceProperties` の `fleshType`、`bloodDef`、肉・皮量、年齢 Hediff 設定 |

Shion 独自コードは遠征シナリオ、Storage、Kombinat に限定されます。年齢・食事・妊娠を差し替える Harmony patch はありません。

## 必須環境

- RimWorld `1.6.4871`
- Vanilla Expanded Framework
- Royalty、Ideology、Biotech、Anomaly、Odyssey

Humanoid Alien Races と Shion からの Harmony 直接依存はありません。ロード順は RimWorld 本体、公式 DLC、Vanilla Expanded Framework、Shion Core です。Matter Network は依存関係ではありません。

## ビルド

`.NET Framework 4.7.2` と C# 7.3 を使用します。既定では Steam Workshop の標準配置から VEF を検証し、必要なら `VEFAssemblyPath` で DLL パスを上書きできます。VEF DLL は `Private=false` で参照され、配布物へ複製されません。

```powershell
dotnet restore Shion.sln --ignore-failed-sources
dotnet build Shion.sln -c Release --no-restore -m:1
./Scripts/Validate-Mod.ps1 -SkipBuild
```

成果物は `1.6/Assemblies` の `Shion.Core.dll`、`Shion.Storage.dll`、`Shion.Kombinat.dll` です。

## セーブ互換性

これは公開前 α の表現方式変更です。HAR の `AlienRace.ThingDef_AlienRace` で作成した旧 α セーブからの移行は保証しません。新規ゲームで検証してください。新方式でも race Def 名 `Shion_Race` は維持します。

## 実装資料

- [Architecture](docs/ARCHITECTURE.md)
- [Framework usage and pinned verification](docs/FRAMEWORKS.md)
- [Alpha acceptance and test matrix](docs/TEST-MATRIX.md)
- [Log collection and performance diagnostics](docs/DIAGNOSTICS.md)
- [Latest validation record](docs/VALIDATION.md)

## License

MIT。依存 framework の DLL・アート・ソースはこのリポジトリへ複製しません。
