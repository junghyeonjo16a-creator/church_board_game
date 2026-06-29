// 선택지 태그 분류
const TAGS = {
    PACKAGED_GREED: "포장된 욕심",       // 신앙으로 포장한 이기심
    PEER_PRESSURE: "또래 압박",          // 주변 분위기에 휩쓸림
    POSTPONE: "미루기",                  // 나중에 하겠다는 합리화
    IDOL_MONEY: "물질 우상화",           // 돈이 하나님보다 위에
    NINETY_PERCENT: "90%는 내 것",       // 십일조 후 나머지는 자유
    SELF_RATIONALIZE: "자기합리화",       // 그럴듯한 변명
    HONEST_ADMIT: "솔직한 인정",         // 내 욕심을 인정
    FAITH_FIRST: "신앙 우선",            // 하나님/예배를 우선
    STEWARD_CONFESS: "청지기 고백",      // 모든 것이 하나님의 것
    PRAYER_DECIDE: "기도 후 결정",       // 성급히 결정하지 않음
    TRUST_GOD: "하나님 신뢰",            // 채워주심을 믿음
    SELF_CHECK: "자기 점검",             // 내 마음을 돌아봄
    SMALL_DISHONEST: "작은 부정직",      // 사소한 부정직
    HONESTY: "정직",                     // 하나님 앞에 정직
    CONTENTMENT: "만족",                 // 있는 것에 감사
    COMPARISON: "비교/원망",             // 남과 비교하며 불만
    FUTURE_ANXIETY: "미래 불안",         // 미래에 대한 두려움
    IMPULSE: "충동/탐욕",               // 순간적 욕심
    COMMUNITY: "공동체 의지",            // 교회 공동체에 도움 요청
    DECISION: "결단"                     // 과감한 신앙적 결단
};

// 12개 상황 카드 데이터
const SITUATION_CARDS = [
    {
        id: 1,
        category: "주식/코인",
        icon: "📈",
        title: "친구의 코인 권유",
        situation: "친구가 \"20대에 안 하면 늦어, 10만원만 넣어봐\"라며 코인 앱을 보여준다. 최근 수익 인증도 보여줬다.",
        choices: [
            {
                text: "소액이니까 해본다. 수익 나면 감사헌금 드리지 뭐",
                tag: TAGS.PACKAGED_GREED
            },
            {
                text: "해본다. 다들 하는데 나만 안 하면 뒤처지니까",
                tag: TAGS.PEER_PRESSURE
            },
            {
                text: "안 한다. 지금은 공부에 집중할 때다",
                tag: TAGS.SELF_CHECK
            },
            {
                text: "안 한다. 차트 보느라 예배 집중 못 할까봐 걱정된다",
                tag: TAGS.FAITH_FIRST
            }
        ]
    },
    {
        id: 2,
        category: "재물관",
        icon: "💰",
        title: "첫 아르바이트 월급",
        situation: "첫 알바비 80만원이 들어왔다. 내 시간, 내 땀으로 번 돈이다. 이 돈을 어떻게 써야 할까?",
        choices: [
            {
                text: "8만원 십일조 드린다. 나머지는 내가 번 거니까 자유롭게 쓴다",
                tag: TAGS.NINETY_PERCENT
            },
            {
                text: "십일조 드리고, 이 돈 전부가 하나님 것임을 고백한다",
                tag: TAGS.STEWARD_CONFESS
            },
            {
                text: "이번 달은 빠듯하니까 다음 달에 몰아서 드린다",
                tag: TAGS.POSTPONE
            },
            {
                text: "하나님 것이라는데... 솔직히 와닿지 않아서 그냥 쓴다",
                tag: TAGS.HONEST_ADMIT
            }
        ]
    },
    {
        id: 3,
        category: "직장/진로",
        icon: "🎯",
        title: "인턴 vs 단기선교",
        situation: "방학에 대기업 인턴 기회가 왔다. 그런데 교회 여름 단기선교 일정과 정확히 겹친다. 인턴은 이번이 마지막 기회일 수 있다.",
        choices: [
            {
                text: "인턴 간다. 좋은 데 취직하면 나중에 더 크게 섬기지",
                tag: TAGS.PACKAGED_GREED
            },
            {
                text: "인턴 간다. 현실적으로 이 기회는 다시 안 온다",
                tag: TAGS.FUTURE_ANXIETY
            },
            {
                text: "단기선교 간다. 이 시간은 돈으로 살 수 없으니까",
                tag: TAGS.FAITH_FIRST
            },
            {
                text: "기도하며 결정한다. 급하게 움직이지 않는다",
                tag: TAGS.PRAYER_DECIDE
            }
        ]
    },
    {
        id: 4,
        category: "주식/코인",
        icon: "📱",
        title: "예배 중 차트 확인",
        situation: "코인에 50만원을 넣었는데, 예배 시간에 가격이 급등락 중이라는 알림이 왔다. 핸드폰이 계속 진동한다.",
        choices: [
            {
                text: "예배 중에 몰래 핸드폰을 확인한다",
                tag: TAGS.IDOL_MONEY
            },
            {
                text: "예배 끝나고 본다. 어차피 소액이니까",
                tag: TAGS.SELF_RATIONALIZE
            },
            {
                text: "불안해서 예배에 집중이 안 된다. 이게 맞나 싶다",
                tag: TAGS.SELF_CHECK
            },
            {
                text: "이 정도면 투자가 아니라 도박인 것 같아서 정리하기로 한다",
                tag: TAGS.DECISION
            }
        ]
    },
    {
        id: 5,
        category: "재물관",
        icon: "🛍️",
        title: "세일의 유혹",
        situation: "좋아하는 브랜드 70% 세일 마지막 날. \"지금 안 사면 손해\"라는 느낌이 강하다. 이번 달 생활비는 빠듯하다.",
        choices: [
            {
                text: "신용카드로 산다. 세일 기회는 지금뿐이니까",
                tag: TAGS.IMPULSE
            },
            {
                text: "필요한 것만 산다. 사고 싶은 것 다 살 수는 없으니까",
                tag: TAGS.SELF_CHECK
            },
            {
                text: "안 산다. 없어도 살 수 있다",
                tag: TAGS.CONTENTMENT
            },
            {
                text: "산다. 십일조 냈으니 나머지는 내 자유지",
                tag: TAGS.NINETY_PERCENT
            }
        ]
    },
    {
        id: 6,
        category: "직장/진로",
        icon: "⏰",
        title: "토요모임 vs 알바",
        situation: "이번 달 등록금이 부족하다. 토요일 교회 청년부 모임 대신 알바를 뛰면 딱 맞출 수 있다.",
        choices: [
            {
                text: "이번 주만 빠진다. 급하니까 어쩔 수 없지",
                tag: TAGS.POSTPONE
            },
            {
                text: "공동체에 상황을 나누고 기도를 부탁한다",
                tag: TAGS.COMMUNITY
            },
            {
                text: "알바를 뛴다. 현실이 우선이지, 하나님도 이해하시겠지",
                tag: TAGS.SELF_RATIONALIZE
            },
            {
                text: "교회 가되, 등록금 걱정에 마음이 무겁다. 하나님께 맡긴다",
                tag: TAGS.TRUST_GOD
            }
        ]
    },
    {
        id: 7,
        category: "기타",
        icon: "📋",
        title: "장학금 용도",
        situation: "국가 장학금을 받았다. 학업용으로 제한된 돈인데, 사실 확인하는 사람은 없다. 생활비가 부족한 상황이다.",
        choices: [
            {
                text: "어차피 확인 안 하니까 생활비로 쓴다",
                tag: TAGS.SMALL_DISHONEST
            },
            {
                text: "학업용으로만 쓴다. 제도의 취지를 지킨다",
                tag: TAGS.HONESTY
            },
            {
                text: "학업비로 쓰고, 아낀 생활비로 어려운 친구를 돕는다",
                tag: TAGS.STEWARD_CONFESS
            },
            {
                text: "규정대로 쓰되, 솔직히 답답하다. 생활비가 진짜 부족한데...",
                tag: TAGS.HONEST_ADMIT
            }
        ]
    },
    {
        id: 8,
        category: "재물관",
        icon: "😤",
        title: "교회 안 비교",
        situation: "같은 또래 교회 친구는 부모님 지원으로 여유롭게 봉사한다. 나는 생활비 벌어야 해서 봉사 시간도 없다.",
        choices: [
            {
                text: "억울하다. 환경이 다른데 같은 걸 기대하지 마",
                tag: TAGS.COMPARISON
            },
            {
                text: "나도 저렇게 되고 싶다. 빨리 돈 벌어야겠다",
                tag: TAGS.IDOL_MONEY
            },
            {
                text: "각자 처한 형편에서 최선을 다하면 된다",
                tag: TAGS.CONTENTMENT
            },
            {
                text: "하나님이 불공평하신 것 같다. 솔직히 화가 난다",
                tag: TAGS.HONEST_ADMIT
            }
        ]
    },
    {
        id: 9,
        category: "주식/코인",
        icon: "💸",
        title: "수익금과 십일조",
        situation: "주식으로 30만원 수익이 났다. 내가 직접 분석하고 공부해서 번 돈이다. 십일조를 내야 할까?",
        choices: [
            {
                text: "내 실력으로 번 건데 십일조를 왜 내? 노동소득도 아닌데",
                tag: TAGS.NINETY_PERCENT
            },
            {
                text: "수익에서도 3만원 십일조 드린다. 이것도 하나님이 허락하신 것",
                tag: TAGS.STEWARD_CONFESS
            },
            {
                text: "원금 회복한 거니까 수익이 아니야. 안 내도 돼",
                tag: TAGS.SELF_RATIONALIZE
            },
            {
                text: "내야 하나... 귀찮은데 일단 다음에 생각하자",
                tag: TAGS.POSTPONE
            }
        ]
    },
    {
        id: 10,
        category: "직장/진로",
        icon: "🏢",
        title: "취업 목표의 본심",
        situation: "취준 중이다. \"대기업 가서 하나님 영광 드리겠다\"고 기도하는데, 문득 스스로에게 물어본다. 왜 대기업이어야 하지?",
        choices: [
            {
                text: "...사실 연봉 높고 남들한테 인정받고 싶어서다",
                tag: TAGS.HONEST_ADMIT
            },
            {
                text: "영향력도 있고 헌금도 많이 할 수 있으니까 둘 다 맞는 거지",
                tag: TAGS.PACKAGED_GREED
            },
            {
                text: "하나님이 보내시는 곳이면 중소기업이어도 간다",
                tag: TAGS.FAITH_FIRST
            },
            {
                text: "솔직히 모르겠다. 내 동기가 뭔지 헷갈린다",
                tag: TAGS.SELF_CHECK
            }
        ]
    },
    {
        id: 11,
        category: "재물관",
        icon: "🍽️",
        title: "후배에게 밥 사주기",
        situation: "교회 후배가 요즘 힘들어 보인다. 밥 한끼 사주고 싶은데, 이번 달 내 생활비도 빠듯하다.",
        choices: [
            {
                text: "내 형편이 안 되니까 다음에 사준다",
                tag: TAGS.POSTPONE
            },
            {
                text: "빠듯해도 사준다. 하나님이 채워주실 거다",
                tag: TAGS.TRUST_GOD
            },
            {
                text: "밥 대신 이야기라도 들어준다. 돈이 전부는 아니니까",
                tag: TAGS.CONTENTMENT
            },
            {
                text: "사주고 싶지만... 솔직히 내가 먼저 살고 봐야지",
                tag: TAGS.HONEST_ADMIT
            }
        ]
    },
    {
        id: 12,
        category: "직장/진로",
        icon: "🙏",
        title: "졸업 후 미래",
        situation: "졸업이 다가온다. 주변에서는 \"교회는 나중에, 지금은 스펙 쌓을 때\"라고 한다. 마음이 흔들린다.",
        choices: [
            {
                text: "맞는 말이다. 현실적으로 준비하고 자리 잡으면 그때 열심히 하자",
                tag: TAGS.POSTPONE
            },
            {
                text: "취업 준비하면서도 예배와 공동체는 지킨다. 둘 다 놓지 않는다",
                tag: TAGS.FAITH_FIRST
            },
            {
                text: "스펙도 쌓고 교회도 가면... 아, 현실적으로 시간이 없다",
                tag: TAGS.FUTURE_ANXIETY
            },
            {
                text: "\"먼저 그의 나라와 의를 구하라\"는 말씀을 붙들어 본다",
                tag: TAGS.TRUST_GOD
            }
        ]
    }
];

// 태그별 결과 메시지 & 연결 말씀
const TAG_RESULTS = {
    [TAGS.PACKAGED_GREED]: {
        description: "하나님을 위한다는 이유로 내 욕심을 포장한 적이 많았습니다.",
        verse: "\"너희는 하나님과 재물을 겸하여 섬기지 못하느니라\" (마태복음 6:24)",
        question: "\"나중에 더 잘 섬기려면 지금은 나를 위해\"라는 말, 정말 하나님을 위한 걸까요?"
    },
    [TAGS.PEER_PRESSURE]: {
        description: "주변 분위기에 휩쓸려 결정한 적이 많았습니다.",
        verse: "\"이 세대를 본받지 말고 오직 마음을 새롭게 함으로 변화를 받아\" (로마서 12:2)",
        question: "\"다들 하니까\"라는 이유가 내 삶의 기준이 되고 있진 않나요?"
    },
    [TAGS.POSTPONE]: {
        description: "\"나중에\"를 반복하며 신앙적 결단을 미루는 경향이 있습니다.",
        verse: "\"안식일에 만나를 거두러 나간 자들 — 결국 썩었다\" (출애굽기 16:20)",
        question: "5년 전에도 \"나중에\"라고 했다면... 그 \"나중\"은 언제 올까요?"
    },
    [TAGS.IDOL_MONEY]: {
        description: "물질이 하나님보다 높은 자리를 차지하고 있을 수 있습니다.",
        verse: "\"속히 부하고자 하는 자는 형벌을 면하지 못하리라\" (잠언 28:20)",
        question: "돈 생각이 기도보다 먼저 떠오른다면, 내 마음의 왕좌에는 누가 앉아 있나요?"
    },
    [TAGS.NINETY_PERCENT]: {
        description: "십일조 후 나머지는 \"내 것\"이라는 생각이 강했습니다.",
        verse: "\"오늘 밤 네 영혼을 도로 찾으리니 네 준비한 것이 누구의 것이 되겠느냐\" (누가복음 12:20)",
        question: "10%를 드리는 것은, 나머지 90%도 하나님의 것이라는 고백인데... 정말 그렇게 살고 있나요?"
    },
    [TAGS.SELF_RATIONALIZE]: {
        description: "그럴듯한 이유를 붙여 내 선택을 정당화하는 경향이 있습니다.",
        verse: "\"마음이 만물보다 거짓되고 심히 부패한지라 누가 능히 이를 알리요\" (예레미야 17:9)",
        question: "내가 만든 \"괜찮은 이유\"가 혹시 내 마음이 만들어낸 거짓은 아닐까요?"
    },
    [TAGS.HONEST_ADMIT]: {
        description: "자신의 욕심과 한계를 솔직하게 인정했습니다.",
        verse: "\"진리를 알지니 진리가 너희를 자유롭게 하리라\" (요한복음 8:32)",
        question: "솔직함은 회개의 시작입니다. 이 고백을 하나님 앞에 내어놓을 수 있나요?"
    },
    [TAGS.FAITH_FIRST]: {
        description: "물질보다 신앙을 우선순위에 둔 선택을 했습니다.",
        verse: "\"먼저 그의 나라와 그의 의를 구하라 그리하면 이 모든 것을 너희에게 더하시리라\" (마태복음 6:33)",
        question: "이 선택이 입술의 고백만이 아니라, 삶의 실제가 되고 있나요?"
    },
    [TAGS.STEWARD_CONFESS]: {
        description: "\"모든 것이 하나님의 것\"이라는 청지기 의식으로 결정했습니다.",
        verse: "\"모든 것이 주께로 말미암았사오니 우리가 주의 손에서 받은 것으로 주께 드렸을 뿐이니이다\" (역대상 29:14)",
        question: "이 고백이 풍족할 때도, 부족할 때도 변하지 않는 고백인가요?"
    },
    [TAGS.PRAYER_DECIDE]: {
        description: "성급히 결정하지 않고 기도로 방향을 구했습니다.",
        verse: "\"너는 마음을 다하여 여호와를 신뢰하고 네 명철을 의지하지 말라\" (잠언 3:5)",
        question: "기도 후에 내 뜻과 다른 답이 와도 순종할 준비가 되어 있나요?"
    },
    [TAGS.TRUST_GOD]: {
        description: "보이지 않는 하나님의 공급을 신뢰하는 선택을 했습니다.",
        verse: "\"내가 네 기업이다\" (민수기 18:20)",
        question: "하나님을 기업으로 삼는다는 것, 통장 잔고가 바닥일 때도 고백할 수 있나요?"
    },
    [TAGS.SELF_CHECK]: {
        description: "자신의 마음 동기를 점검하려는 태도를 보였습니다.",
        verse: "\"하나님이여 나를 살피사 내 마음을 아시며 나를 시험하사 내 뜻을 아옵소서\" (시편 139:23)",
        question: "마음을 점검한 후, 그 다음 행동은 무엇이었나요?"
    },
    [TAGS.SMALL_DISHONEST]: {
        description: "\"이 정도는 괜찮다\"며 작은 부정직을 허용했습니다.",
        verse: "\"지극히 작은 것에 충성된 자는 큰 것에도 충성되고\" (누가복음 16:10)",
        question: "아무도 안 본다고 해도, 하나님은 보고 계십니다. 작은 것에 충성되고 있나요?"
    },
    [TAGS.HONESTY]: {
        description: "손해를 감수하더라도 정직을 선택했습니다.",
        verse: "\"여호와여 주의 장막에 머무를 자 누구오니이까... 손해를 볼지라도 변하지 아니하는 자\" (시편 15:1,4)",
        question: "정직으로 인해 손해를 봤을 때, 하나님이 그것을 기억하심을 믿나요?"
    },
    [TAGS.CONTENTMENT]: {
        description: "있는 것에 감사하고 만족하는 마음을 보였습니다.",
        verse: "\"자족하는 마음이 있으면 경건은 큰 이익이 되느니라\" (디모데전서 6:6)",
        question: "이 만족이 게으름이 아닌, 하나님께 대한 신뢰에서 오는 것인가요?"
    },
    [TAGS.COMPARISON]: {
        description: "다른 사람과 비교하며 불만과 원망이 올라왔습니다.",
        verse: "\"범사에 감사하라 이것이 그리스도 예수 안에서 너희를 향하신 하나님의 뜻이니라\" (데살로니가전서 5:18)",
        question: "하나님이 내게 주신 것들을 셀 때, 감사가 먼저일까요 불평이 먼저일까요?"
    },
    [TAGS.FUTURE_ANXIETY]: {
        description: "미래에 대한 불안이 현재의 신앙적 결정을 흔들고 있습니다.",
        verse: "\"그러므로 내일 일을 위하여 염려하지 말라 내일 일은 내일이 염려할 것이요\" (마태복음 6:34)",
        question: "불안이 나를 움직이게 할 때, 그 방향이 하나님을 향한 것인가요?"
    },
    [TAGS.IMPULSE]: {
        description: "순간적인 욕심에 따라 결정하는 경향이 있습니다.",
        verse: "\"망령되이 얻은 재물은 줄어가고 손으로 모은 것은 늘어가느니라\" (잠언 13:11)",
        question: "\"지금 아니면 안 돼\"라는 조급함, 혹시 세상이 만들어낸 거짓 긴급함은 아닌가요?"
    },
    [TAGS.COMMUNITY]: {
        description: "혼자 감당하지 않고 공동체의 도움을 구했습니다.",
        verse: "\"두 사람이 한 사람보다 나음은 그들이 수고함으로 좋은 상을 얻을 것임이라\" (전도서 4:9)",
        question: "나의 약함을 나눌 수 있는 공동체가 있다는 것, 이것도 은혜입니다."
    },
    [TAGS.DECISION]: {
        description: "물질의 유혹 앞에서 과감한 결단을 내렸습니다.",
        verse: "\"네 오른손이 너로 실족하게 하거든 찍어 내버리라\" (마태복음 5:30)",
        question: "이 결단을 지속할 수 있는 힘, 어디서 오나요? 혼자의 의지만으로 될까요?"
    }
};

// 보드 칸 이름 (12칸)
const BOARD_CELLS = [
    { name: "출발", type: "start" },
    { name: "상황 1", type: "situation", cardIndex: 0 },
    { name: "상황 2", type: "situation", cardIndex: 1 },
    { name: "상황 3", type: "situation", cardIndex: 2 },
    { name: "상황 4", type: "situation", cardIndex: 3 },
    { name: "상황 5", type: "situation", cardIndex: 4 },
    { name: "상황 6", type: "situation", cardIndex: 5 },
    { name: "상황 7", type: "situation", cardIndex: 6 },
    { name: "상황 8", type: "situation", cardIndex: 7 },
    { name: "상황 9", type: "situation", cardIndex: 8 },
    { name: "상황 10", type: "situation", cardIndex: 9 },
    { name: "상황 11", type: "situation", cardIndex: 10 },
    { name: "상황 12", type: "situation", cardIndex: 11 }
];
