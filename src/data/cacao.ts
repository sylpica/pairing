import type { CacaoTraditionalGroup, CacaoGeneticGroup, CacaoClone } from '../types'

// カカオ分類データベース（追加指示 2026-10-30）。
// 調査記録: docs/research/cacao-genetics.md / 設計: docs/design/cultivar-data-model.md
// 原則: 伝統的分類・遺伝集団・個別クローンは独立した階層として管理し、
// 伝統↔遺伝の一対一対応フィールドは持たない。遺伝分類のみから味を断定しない。
// 香味の実測がある対象にのみ findings を付け、それ以外は science='unconfirmed' とする。
const ICCO = 'icco-growing-cocoa'
const MOTA = 'motamayor-2008-cacao-populations'
const CORNEJO = 'cornejo-2018-cacao-domestication'
const BOZA = 'boza-2014-ccn51'
const ELWERS = 'elwers-2009-cocoa-phenolics'
const KADOW = 'kadow-2013-fine-flavour-genotypes'
const COL21 = 'colonges-2021-nacional-floral'
const COL22 = 'colonges-2022-nacional-bitterness'
const SYSTEM = 'Motamayor et al. 2008（SSRマーカーによる10遺伝集団）'

// ===== 伝統的分類（歴史的・商業的な呼称体系） =====
export const cacaoTraditionalGroups: CacaoTraditionalGroup[] = [
  {
    id: 'trad-criollo', name: 'Criollo', nameJa: 'クリオロ', aliases: ['Cacao Criollo'],
    nature: '歴史的・商業的な呼称体系の一つで、遺伝的に均一な品種ではない。ICCO によれば、18世紀半ばまで市場を支配したが、現在では純粋な Criollo の木は「ほとんど、あるいは全く」残っていないとされる。遺伝集団 Criollo（gen-criollo）と概ね対応するが、一部の著者は Criollo 自体を「遺伝グループ」ではなく「伝統的栽培品種」とみなすべきだとしている（Motamayor et al. 2008 の序論が引く見解）。無条件の一対一対応としては扱わない。',
    verification: { existence: 'confirmed', classification: 'confirmed', science: 'partial' },
    findings: [
      { kind: 'composition', statement: 'Elwers et al. 2009 のタイプ別種子試料の分析で、Criollo の種子はアントシアニンを含まず、他のタイプよりカフェ酸アスパルテート（caffeic acid aspartate）が多かった。', conditions: '伝統的タイプ区分による試料群の分析であり、Motamayor の遺伝集団そのものの実測ではない。', sourceIds: [ELWERS] },
      { kind: 'composition', statement: '同じ研究で、総ポリフェノール量と (−)-エピカテキン量には、タイプ間で遺伝的に決定された差は見出されなかった。むしろ土壌施肥の有無が有意な影響を与えた。発酵・乾燥中のカテキン類の減少は Criollo 試料で他より強く、これが Criollo チョコレートのマイルドな香味の一因かもしれないと著者らは解釈している。', conditions: '「Forastero はポリフェノールが多く苦い」式の単純な集団間比較は、この実測では支持されない。後段は著者らの解釈である。', sourceIds: [ELWERS] },
    ],
    sourceIds: [ICCO, MOTA, ELWERS],
  },
  {
    id: 'trad-forastero', name: 'Forastero', nameJa: 'フォラステロ', aliases: [],
    nature: '栽培・半野生・野生の集団を含む大きな集団（large group）を指す歴史的な呼称であり、単一の遺伝集団ではない。Motamayor et al. 2008 の10集団のうち Criollo を除く大半（Amelonado、Contamana、Curaray、Guiana、Iquitos、Marañon、Nanay、Purús、および Forastero 型とされる Nacional）にまたがる。その中で最も広く植えられているのは Amelonado 集団である。市場では bulk（ordinary）豆は Forastero の木から生産されると一般化されるが、例外が明記されている（下記の注記参照）。',
    verification: { existence: 'confirmed', classification: 'confirmed', science: 'unconfirmed' },
    scienceNote: '総称としての実測は原理的に存在しない。Elwers et al. 2009 には Upper Amazon Forastero / Lower Amazon Forastero のタイプ試料が含まれるが、Motamayor の遺伝集団との対応は未確認のため、本分類の所見としては登録しない。',
    findings: [],
    sourceIds: [ICCO, MOTA],
    note: 'fine/flavour と bulk の市場区分は伝統的分類と完全には対応しない。エクアドルの Nacional は Forastero 型とされながら fine/flavour 豆を生産し、逆にカメルーンの Trinitario 型の豆は bulk に分類される（ICCO）。',
  },
  {
    id: 'trad-trinitario', name: 'Trinitario', nameJa: 'トリニタリオ', aliases: [],
    nature: 'Criollo と Forastero の交雑に由来する多様な集団の総称であり、単一の遺伝集団ではない。ICCO は「Trinitario 集団は Forastero に属すると考えられている」と位置付ける。トリニダードで植栽が始まり、ベネズエラ、エクアドル、カメルーン、サモア、スリランカ、ジャワ、パプアニューギニアへ広がった。Motamayor et al. 2008 の枠組みでは、交雑個体（所属係数 0.70 未満）として扱われる。',
    verification: { existence: 'confirmed', classification: 'confirmed', science: 'partial' },
    findings: [
      { kind: 'composition', statement: 'Elwers et al. 2009 で、Trinitario タイプの種子試料がフェノール組成の分析対象となった（総ポリフェノール量と (−)-エピカテキン量に遺伝的に決定された差は見出されなかった知見を含む）。', conditions: '伝統的タイプ区分による試料群の分析であり、Motamayor の遺伝集団そのものの実測ではない。', sourceIds: [ELWERS] },
    ],
    sourceIds: [ICCO, MOTA, ELWERS],
    note: '個別クローン ICS-95 は Trinitario タイプとされ、クローンとして別途登録している（ics-95）。',
  },
]
export const traditionalGroupById = (id: string) => cacaoTraditionalGroups.find((g) => g.id === id)

// ===== 現代の遺伝的分類（Motamayor et al. 2008 の10集団） =====
export const cacaoGeneticGroups: CacaoGeneticGroup[] = [
  {
    id: 'gen-criollo', name: 'Criollo', aliases: ['Cacao Criollo'],
    namingBasis: '伝統的栽培品種 Criollo にちなんで命名された。',
    distribution: '中央アメリカの原生林に見られる唯一のクラスター。10クラスター全てが南アメリカの森林に存在し、Criollo も南アメリカに分布する。',
    classificationSystem: SYSTEM,
    verification: { existence: 'confirmed', classification: 'confirmed', science: 'partial' },
    findings: [
      { kind: 'genetic', statement: '200 アクセッションの集団ゲノミクス解析で、単一の集団（Criollo 集団）のみが約3,600年前（95%信頼区間: 2,481–13,806年前）に強い家畜化を受けたことが示され、アントシアニン代謝と刺激成分テオブロミン代謝に関わる遺伝子、および病害抵抗性遺伝子に強い選択が働いた。家畜化された Criollo 集団は高頻度の有害変異を多く保持し、Criollo の祖先割合が増えるほど収量が有意に低下する（家畜化のコスト）。', conditions: '分類・家畜化過程の実測であり、香味の実測ではない。', sourceIds: [CORNEJO] },
    ],
    sourceIds: [MOTA, CORNEJO],
    note: '伝統的分類の Criollo（trad-criollo）とは別エンティティとして管理する。概ね対応するが同一ではない。',
  },
  {
    id: 'gen-amelonado', name: 'Amelonado', aliases: [],
    namingBasis: '伝統的栽培品種 Amelonado にちなんで命名された。',
    distribution: '野生個体（遠く離れた地点のもの）と栽培遺伝子型（ブラジル・バイーア州、コスタリカ、ガーナ）が同一クラスターに含まれる。下流アマゾン起源の伝統的栽培品種で、パラ川（Para River）流域の木々から家畜化された可能性が歴史資料から示唆される。ブラジルと西アフリカの広い地域に植えられている。',
    classificationSystem: SYSTEM,
    verification: { existence: 'confirmed', classification: 'confirmed', science: 'unconfirmed' },
    scienceNote: 'Motamayor 集団としての香味・成分実測は本調査で未確認。CCN-51 の祖先構成に 21.5% 含まれる（クローン側の記録を参照）。',
    findings: [],
    sourceIds: [MOTA],
  },
  {
    id: 'gen-nacional', name: 'Nacional', aliases: [],
    namingBasis: '伝統的栽培品種 Nacional にちなんで命名された。',
    distribution: 'クラスター自体はエクアドル・アンデスのアマゾン側（モローナ川、ナンガリツァ川、サモラ川流域）の個体をグループ化する。栽培品種としての Nacional はエクアドル太平洋側（海岸部）での数世紀にわたる人為選択の産物と推定され、現在の「現代 Nacional」と呼ばれる植栽は、祖先的 Nacional と導入された Trinitario との遺伝的混合である。',
    classificationSystem: SYSTEM,
    verification: { existence: 'confirmed', classification: 'confirmed', science: 'peer-reviewed' },
    findings: [
      { kind: 'sensory', statement: '現代 Nacional の集団品種に属する 152 遺伝子型を対象とした GWAS で、ARRIBA フレーバーの主体である花のノートに主に関連する生合成経路が2つ同定された: モノテルペン生合成経路と、L-フェニルアラニン分解経路（アセトフェノンや 2-フェニルエタノール等の合成に関わる）。著者らは「遺伝的背景がカカオの花のノートを大きく説明するように見える」と結論した。', conditions: '現代 Nacional という特定の栽培集団内での変異の研究であり、「Nacional 集団の豆は常に花香が強い」という集団レベルの断定とは異なる。', sourceIds: [COL21] },
      { kind: 'sensory', statement: '栽培された現代 Nacional 集団とエクアドル南部アマゾンのアクセッション集団を対象とした研究で、苦味と渋味の官能データについて20の関連領域、非揮発性化合物について53の関連領域が検出され、計81の候補遺伝子が同定された。', conditions: '苦味・渋味の遺伝的要因は集団内の遺伝子型間変異として検出されたものであり、「遺伝集団＝苦味・渋味の強さ」という集団レベルの換算を支持するものではない。', sourceIds: [COL22] },
      { kind: 'sensory', statement: '伝統的 Nacional 遺伝子型は大きな豆と甘いパルプを持ち、発酵豆は低酸味・低苦味・低渋味で、スミレ、ジャスミン、ライラック、オレンジの花に似た果実様・花様の味を示す（Boza et al. 2014 が先行研究を引いた整理）。', conditions: '先行研究の引用による整理であり、ファインフレーバーの潜在力は発酵工程とチョコレート製造の実践に大きく影響されると同論文は明記している。', sourceIds: [BOZA] },
    ],
    sourceIds: [MOTA, COL21, COL22, BOZA],
    note: '「Nacional」には複数の用法が併存する: (1) 本エンティティ＝遺伝集団、(2) 伝統的栽培品種としての Nacional、(3) 商業呼称 "Arriba"（エクアドル産ファインカカオの香味・商業呼称であり、遺伝集団名そのものではない）。また ICCO の体系では Nacional は Forastero 型と位置付けられるなど、用いる分類体系によって位置付けが変わる。',
  },
  {
    id: 'gen-contamana', name: 'Contamana', aliases: [],
    namingBasis: '地理的位置（コンタマナ）にちなんで命名された。',
    classificationSystem: SYSTEM,
    verification: { existence: 'confirmed', classification: 'partial', science: 'unconfirmed' },
    scienceNote: '集団としての香味実測は未確認。なお SCA6 は個別遺伝子型として Kadow et al. 2013 で揮発性成分の実測があるが、クローン個体の実測であり集団の実測ではないため、本集団の所見としては登録しない。',
    findings: [],
    sourceIds: [MOTA],
    note: 'Pound コレクションの SCA（Scavina）系列が本クラスターの 28% を占める（Motamayor et al. 2008）。原著本文範囲ではこれ以上の個別記述は未確認のため、分類確認は「一部確認」とする。',
  },
  {
    id: 'gen-curaray', name: 'Curaray', aliases: [],
    namingBasis: '地理的位置（クラライ川）にちなんで命名された。',
    classificationSystem: SYSTEM,
    verification: { existence: 'confirmed', classification: 'partial', science: 'unconfirmed' },
    scienceNote: '集団としての香味・成分実測は未確認。',
    findings: [],
    sourceIds: [MOTA],
    note: '原著本文範囲で個別の分布記述は未確認のため、分類確認は「一部確認」とする。Cornejo et al. 2018 の関連報道では Criollo の祖先的 germplasm として言及されているが、一次の抄録範囲を超えるため本文未確認として扱う。',
  },
  {
    id: 'gen-guiana', name: 'Guiana', aliases: ['Cacao guiana'],
    namingBasis: '地理的位置（ギアナ）にちなんで命名された。',
    classificationSystem: SYSTEM,
    verification: { existence: 'confirmed', classification: 'partial', science: 'unconfirmed' },
    scienceNote: '集団としての香味・成分実測は未確認。',
    findings: [],
    sourceIds: [MOTA],
    note: '原著の採取対象地域にフランス領ギアナが含まれることまでは確認できるが、クラスター固有の分布記述は本文範囲では未確認のため、分類確認は「一部確認」とする。',
  },
  {
    id: 'gen-iquitos', name: 'Iquitos', aliases: [],
    namingBasis: '地理的位置（イキトス）にちなんで命名された。',
    distribution: 'ペルー・アマゾンのイキトス周辺。Pound コレクションの IMC（Iquitos Mixed Calabacillo）系列が本クラスターの 54% を占める。Nanay クラスターと採取地が重なり合う。',
    classificationSystem: SYSTEM,
    verification: { existence: 'confirmed', classification: 'confirmed', science: 'unconfirmed' },
    scienceNote: '集団としての香味実測は未確認。CCN-51 の祖先構成の最大要素（45.4%）である（クローン側の記録を参照）。IMC-67 はクローンとして別途登録している。',
    findings: [],
    sourceIds: [MOTA],
  },
  {
    id: 'gen-maranon', name: 'Marañon', aliases: ['Maranon'],
    namingBasis: '地理的位置（マラニョン川）にちなんで命名された。',
    distribution: 'ペルー・アマゾン上流。Pound コレクションの PA（Parinari）系列が本クラスターの 68% を占める。Parinari はマラニョン川流域の地名である。',
    classificationSystem: SYSTEM,
    verification: { existence: 'confirmed', classification: 'confirmed', science: 'unconfirmed' },
    scienceNote: '集団としての香味・成分実測は未確認。',
    findings: [],
    sourceIds: [MOTA],
  },
  {
    id: 'gen-nanay', name: 'Nanay', aliases: [],
    namingBasis: '地理的位置（ナナイ川）にちなんで命名された。',
    distribution: 'ペルー・アマゾンのナナイ川流域。Pound コレクションの NA（Nanay）系列が本クラスターの 90% を占める。Iquitos とは対立遺伝子頻度の差で区別される（小サンプルでは両者が1クラスターに融合する結果も原著に併記されている）。',
    classificationSystem: SYSTEM,
    verification: { existence: 'confirmed', classification: 'confirmed', science: 'unconfirmed' },
    scienceNote: '集団としての香味・成分実測は未確認。',
    findings: [],
    sourceIds: [MOTA],
  },
  {
    id: 'gen-purus', name: 'Purús', aliases: ['Purus'],
    namingBasis: '地理的位置（プルス川）にちなんで命名された。',
    distribution: 'プルス川・ソリモンエス川流域。上ソリモンエス川とイサ川（Iça River）のサブクラスターが含まれる。ソリモンエス川沿いでは遺伝子流動が広範で、下流の移入集団のクラスタリングは困難とされる。',
    classificationSystem: SYSTEM,
    verification: { existence: 'confirmed', classification: 'confirmed', science: 'unconfirmed' },
    scienceNote: '集団としての香味・成分実測は未確認。',
    findings: [],
    sourceIds: [MOTA],
  },
]
export const geneticGroupById = (id: string) => cacaoGeneticGroups.find((g) => g.id === id)

// ===== 個別クローン・栽培系統 =====
export const cacaoClones: CacaoClone[] = [
  {
    id: 'ccn-51', name: 'CCN-51', aliases: ['Colección Castro Naranjal 51'],
    origin: 'エクアドル。H. Castro が1960年代初頭に作出。最初の植栽記録は1965年（グアヤキル南部の Naranjal 地区の農園）。エクアドルで約80,000 ha に広がったとされる。',
    breeding: '交配式は（ICS 95 × IMC 67）× Oriente 1。Oriente 1 は Castro がエクアドル・アマゾンの Canelos 谷で採取したアクセッション。ミトコンドリア SSR により、母系の細胞質型は IMC 67 のサイトタイプを継承していることが示された。農学的特徴は高生産性・病害抵抗性・早熟性で、豆のバター含量は54%。',
    ancestry: [
      { groupId: 'gen-iquitos', sharePercent: 45.4 },
      { groupId: 'gen-criollo', sharePercent: 22.2 },
      { groupId: 'gen-amelonado', sharePercent: 21.5 },
      { groupId: 'gen-contamana', sharePercent: 3.9 },
      { groupId: 'gen-purus', sharePercent: 2.5 },
      { groupId: 'gen-maranon', sharePercent: 2.1 },
      { groupId: 'gen-nacional', sharePercent: 1.1 },
    ],
    ancestrySourceIds: [BOZA],
    verification: { existence: 'confirmed', classification: 'confirmed', science: 'peer-reviewed' },
    findings: [
      { kind: 'genetic', statement: 'SSR 70座の解析による祖先構成は Iquitos 45.4%、Criollo 22.2%、Amelonado 21.5% が主要で、Contamana 3.9%、Purús 2.5%、Marañon 2.1%、Nacional 1.1% の混合を含む（合計98.7%。残りは原著の内訳に明示なし）。70座中56座でヘテロ接合を示し、これは伝統的 Nacional 栽培品種には見られない高いヘテロ接合度である。単一の遺伝集団には帰属しない。', sourceIds: [BOZA] },
      { kind: 'sensory', statement: '物理的・化学的・官能的特徴は Nacional 系統のものとは異なり、発酵前の適切な予備乾燥を行えば低酸味で「許容可能な香味（acceptable flavor）」が得られるが、fine-flavored 豆の資格は満たさないと評価されている。Nacional のファインフレーバー豆への CCN-51 豆の混入が一般的になり、豆全体の品質と価格を下げていることも指摘されている。', conditions: 'Boza et al. 2014 が Amores et al. 2011 の評価を引用した範囲。「CCN-51 は味が悪い」という俗説は原著の記述より強い。', sourceIds: [BOZA] },
      { kind: 'composition', statement: '果実パルプと種子の GC-MS 分析で、CCN51 の揮発性成分濃度はファイン/フレーバーカカオの2遺伝子型（SCA6、EET62）に比べて非常に低かった。', conditions: 'Kadow et al. 2013 の特定試料・特定条件での個別遺伝子型の実測であり、CCN-51 全般の断定ではない。', sourceIds: [KADOW] },
    ],
    sourceIds: [BOZA, KADOW],
    note: '莢の形態と樹形は伝統的 Nacional と明確に異なるにもかかわらず、CCN-51 が Nacional 系統と誤認されることがあると原著が注意喚起している。',
  },
  {
    id: 'ics-95', name: 'ICS-95', aliases: ['ICS 95', 'Imperial College Selections 95'],
    origin: 'トリニダード。ICS（Imperial College Selections）は F. J. Pound が1931年／1933–1935年にトリニダードのカカオ集団から選抜したクローン群で、ICS-95 はその一つ。',
    breeding: 'Boza et al. 2014 では「Criollo 集団と Amelonado 集団の遺伝子型同士の交配から作出された Trinitario タイプ」と説明され、CCN-51 の祖父母世代として位置付けられる。ICS クローン群は「独特の Trinitario フレーバー」で知られるとされる（Johnson et al. 2009。ただし本実装では同論文の出典リンクは未検証）。',
    verification: { existence: 'confirmed', classification: 'confirmed', science: 'unconfirmed' },
    scienceNote: 'ICS-95 個体そのものの香味・成分の実測データは未確認。確認できるのは ICS クローン群の遺伝構造に関する知見と、CCN-51 の系譜上の位置付けのみである。',
    findings: [
      { kind: 'classification', statement: 'Trinitario タイプのクローンであり、CCN-51 の祖父母世代にあたる（交配式（ICS 95 × IMC 67）× Oriente 1 の祖父母側）。', sourceIds: [BOZA] },
    ],
    sourceIds: [BOZA],
  },
  {
    id: 'imc-67', name: 'IMC-67', aliases: ['IMC 67', 'Iquitos Mixed Calabacillo 67'],
    origin: 'ペルー・イキトス。IMC（Iquitos Mixed Calabacillo）は F. J. Pound が1938年にイキトスで選抜したアクセッション群で、IMC-67 はその一つ。',
    breeding: 'Boza et al. 2014 は IMC 67 を「アマゾン上流（upper Amazon）の遺伝子型」とし、CCN-51 の母系祖先であることを細胞質マーカーで示した。育種素材として広く使われ、他のクローンの台木にも用いられる。',
    associatedGroupIds: ['gen-iquitos'],
    verification: { existence: 'confirmed', classification: 'confirmed', science: 'unconfirmed' },
    scienceNote: 'IMC-67 個体そのものの香味・成分の実測データは未確認。',
    findings: [
      { kind: 'classification', statement: 'IMC 系列は Motamayor et al. 2008 の Iquitos クラスターの 54% を占める系列であり、IMC-67 はその系列のクローンである。この関連は系列の本拠を示すものであり、個体が単一集団に純粋に帰属することの断定ではない。', sourceIds: [MOTA, BOZA] },
    ],
    sourceIds: [BOZA, MOTA],
  },
]
export const cacaoCloneById = (id: string) => cacaoClones.find((c) => c.id === id)
