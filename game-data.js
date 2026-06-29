// ===== 태그 분류 =====
const TAGS = {
    PACKAGED_GREED: "포장된 욕심",
    PEER_PRESSURE: "또래 압박",
    POSTPONE: "미루기",
    IDOL_MONEY: "물질 우상화",
    NINETY_PERCENT: "90%는 내 것",
    SELF_RATIONALIZE: "자기합리화",
    HONEST_ADMIT: "솔직한 인정",
    FAITH_FIRST: "신앙 우선",
    STEWARD_CONFESS: "청지기 고백",
    PRAYER_DECIDE: "기도 후 결정",
    TRUST_GOD: "하나님 신뢰",
    SELF_CHECK: "자기 점검",
    SMALL_DISHONEST: "작은 부정직",
    HONESTY: "정직",
    CONTENTMENT: "만족",
    COMPARISON: "비교/원망",
    FUTURE_ANXIETY: "미래 불안",
    IMPULSE: "충동/탐욕",
    COMMUNITY: "공동체 의지",
    DECISION: "결단",
    FOMO: "FOMO",
    SELF_WORTH_MONEY: "돈=자존감"
};

// ===== 보드판 12칸 구성 =====
// 유형: choice(선택), event(이벤트), sharing(나눔)
const BOARD_CELLS = [
    { id: 0, type: "start", name: "출발", icon: "🚀" },
    { id: 1, type: "choice", name: "선택", icon: "🤔", cardIndex: 0 },
    { id: 2, type: "choice", name: "선택", icon: "🤔", cardIndex: 1 },
    { id: 3, type: "event", name: "이벤트", icon: "⚡", eventIndex: 0 },
    { id: 4, type: "choice", name: "선택", icon: "🤔", cardIndex: 2 },
    { id: 5, type: "choice", name: "선택", icon: "🤔", cardIndex: 3 },
    { id: 6, type: "sharing", name: "나눔", icon: "💬", sharingIndex: 0 },
    { id: 7, type: "choice", name: "선택", icon: "🤔", cardIndex: 4 },
    { id: 8, type: "choice", name: "선택", icon: "🤔", cardIndex: 5 },
    { id: 9, type: "event", name: "이벤트", icon: "⚡", eventIndex: 1 },
    { id: 10, type: "choice", name: "선택", icon: "🤔", cardIndex: 6 },
    { id: 11, type: "choice", name: "선택", icon: "🤔", cardIndex: 7 },
    { id: 12, type: "sharing", name: "나눔", icon: "💬", sharingIndex: 1 }
];

// ===== 선택 칸 카드 8개 =====
// 체크리스트 5영역 반영:
// 1. 가치관과 자존감 / 2. 소비와 소유 / 3. 염려와 신앙 / 4. 관계와 비전 / 5. 투자인가 탐욕인가
const CHOICE_CARDS = [
    {
        id: 1,
        category: "가치관과 자존감",
        icon: "👤",
        title: "SNS 속 비교",
        situation: "SNS에서 친구가 새 맥북, 해외여행 사진을 올렸다. 나는 중고 노트북에 알바비로 겨우 생활 중이다. 자존감이 흔들린다.",
        choices: [
            { text: "나도 무리해서라도 비슷한 수준을 맞춰야겠다", tag: TAGS.SELF_WORTH_MONEY },
            { text: "부럽지만 내 형편에서 감사할 것을 찾아본다", tag: TAGS.CONTENTMENT },
            { text: "솔직히 열등감 느낀다. 돈이 더 있었으면 좋겠다", tag: TAGS.HONEST_ADMIT },
            { text: "SNS를 좀 줄여야겠다. 비교가 나를 갉아먹고 있다", tag: TAGS.DECISION }
        ]
    },
    {
        id: 2,
        category: "소비와 소유",
        icon: "🛒",
        title: "충동구매의 유혹",
        situation: "스트레스받은 날, 좋아하는 브랜드에서 한정판이 나왔다. \"나한테 주는 선물\"이라고 생각하면 살 수 있긴 하다. 이번 달 생활비가 빠듯해진다.",
        choices: [
            { text: "산다. 스트레스 해소도 필요하잖아. 내가 번 돈인데", tag: TAGS.NINETY_PERCENT },
            { text: "산다. 다음 달에 아끼면 되지. 한정판은 지금뿐이니까", tag: TAGS.IMPULSE },
            { text: "안 산다. 없어도 사는 데 지장 없다", tag: TAGS.CONTENTMENT },
            { text: "사고 싶지만 참는다. 근데 왜 이렇게 물건으로 위로받고 싶지?", tag: TAGS.SELF_CHECK }
        ]
    },
    {
        id: 3,
        category: "염려와 신앙",
        icon: "😰",
        title: "통장 잔고와 불안",
        situation: "통장에 20만원밖에 없다. 다음 달 등록금도 걱정이다. 이번 주일 헌금을 드릴지 말지 고민된다.",
        choices: [
            { text: "헌금을 줄인다. 현실적으로 지금은 내가 먼저 살아야 한다", tag: TAGS.SELF_RATIONALIZE },
            { text: "빠듯해도 드린다. 하나님이 채워주실 거라 믿는다", tag: TAGS.TRUST_GOD },
            { text: "안 드린다. 솔직히 통장 잔고가 내 안전지대인데 그게 흔들리니 무섭다", tag: TAGS.HONEST_ADMIT },
            { text: "공동체에 상황을 나누고 기도를 부탁한다", tag: TAGS.COMMUNITY }
        ]
    },
    {
        id: 4,
        category: "염려와 신앙",
        icon: "⏰",
        title: "돈 벌 기회 vs 신앙생활",
        situation: "주말 알바 제안이 왔다. 토요모임·주일예배 시간과 겹친다. 받으면 이번 달이 한결 여유로워진다.",
        choices: [
            { text: "알바 한다. 지금은 돈 모을 때다. 신앙생활은 나중에 여유 생기면", tag: TAGS.POSTPONE },
            { text: "알바 한다. 이 돈으로 헌금 더 하면 되지", tag: TAGS.PACKAGED_GREED },
            { text: "거절한다. 예배와 공동체가 우선이다", tag: TAGS.FAITH_FIRST },
            { text: "고민된다. 둘 다 중요한데 시간이 겹치니 답이 없다", tag: TAGS.HONEST_ADMIT }
        ]
    },
    {
        id: 5,
        category: "투자인가 탐욕인가",
        icon: "📈",
        title: "코인 FOMO",
        situation: "주변에서 주식이나 코인으로 \"대박\" 소식이 들린다. \"나만 뒤처지는 것 같다\"는 불안감이 든다. 친구가 같이 하자고 권유한다.",
        choices: [
            { text: "해본다. 다들 하는데 나만 안 하면 바보 같잖아", tag: TAGS.FOMO },
            { text: "해본다. 소액이니까. 수익 나면 감사헌금 드리지", tag: TAGS.PACKAGED_GREED },
            { text: "안 한다. 쉽게 벌려는 마음이 탐욕인 것 같다", tag: TAGS.SELF_CHECK },
            { text: "안 한다. 지금 내가 집중할 것은 따로 있다", tag: TAGS.FAITH_FIRST }
        ]
    },
    {
        id: 6,
        category: "관계와 비전",
        icon: "🎯",
        title: "취업 목표의 본심",
        situation: "취준 중이다. \"대기업 가서 영향력 발휘하겠다\"고 기도하는데, 문득 스스로에게 물어본다. 진짜 이유가 뭐지?",
        choices: [
            { text: "솔직히 연봉 높고 남들한테 인정받고 싶어서다", tag: TAGS.HONEST_ADMIT },
            { text: "영향력도 있고 헌금도 많이 할 수 있으니까 둘 다 맞는 거지", tag: TAGS.PACKAGED_GREED },
            { text: "하나님이 보내시는 곳이면 중소기업이어도 간다", tag: TAGS.FAITH_FIRST },
            { text: "내 동기가 뭔지 솔직히 모르겠다. 점검이 필요하다", tag: TAGS.SELF_CHECK }
        ]
    },
    {
        id: 7,
        category: "관계와 비전",
        icon: "👥",
        title: "교회 안에서의 비교",
        situation: "같은 또래 교회 친구는 부모님 지원으로 여유롭게 봉사한다. 나는 생활비 벌어야 해서 시간도 돈도 없다. 교회에서 그 친구의 직업, 경제력이 은연중에 의식된다.",
        choices: [
            { text: "억울하다. 환경이 다른데 같은 걸 기대하지 마", tag: TAGS.COMPARISON },
            { text: "나도 빨리 돈 벌어서 저렇게 여유 있게 살고 싶다", tag: TAGS.IDOL_MONEY },
            { text: "각자 형편에서 최선을 다하면 된다. 비교를 내려놓는다", tag: TAGS.CONTENTMENT },
            { text: "솔직히 하나님이 불공평하다고 느낀다", tag: TAGS.HONEST_ADMIT }
        ]
    },
    {
        id: 8,
        category: "소비와 소유",
        icon: "💸",
        title: "헌금할 때의 마음",
        situation: "십일조를 드리려고 계산기를 두드리는데, '아깝다'는 생각이 올라온다. 이 돈이면 사고 싶은 게 있는데...",
        choices: [
            { text: "정확히 10%만 드린다. 이건 의무니까. 나머지는 내 자유", tag: TAGS.NINETY_PERCENT },
            { text: "감사함으로 드린다. 100% 다 하나님 것인데 10%만 드리는 게 오히려 감사", tag: TAGS.STEWARD_CONFESS },
            { text: "솔직히 아깝다. 이번 달은 좀 줄여야겠다", tag: TAGS.HONEST_ADMIT },
            { text: "형식적으로 드리고 있었구나. 내 마음을 점검해야겠다", tag: TAGS.SELF_CHECK }
        ]
    }
];

// ===== 이벤트 칸 카드 (2개 + 추가 랜덤풀) =====
const EVENT_CARDS = [
    {
        id: 1,
        icon: "📱",
        title: "갑작스런 지출",
        situation: "핸드폰이 고장났다. 수리비 15만원. 친구가 \"그냥 새 거 사. 할부 되잖아\"라고 한다.",
        choices: [
            { text: "새 폰 할부로 산다. 어차피 바꿀 때 됐으니까", tag: TAGS.IMPULSE },
            { text: "수리해서 쓴다. 당장 필요한 기능에 문제 없으니까", tag: TAGS.CONTENTMENT },
            { text: "새 거 사고 싶다... 다들 최신폰 쓰는데 나만 구형이잖아", tag: TAGS.PEER_PRESSURE },
            { text: "기도하고 결정한다. 조급하게 움직이지 않는다", tag: TAGS.PRAYER_DECIDE }
        ]
    },
    {
        id: 2,
        icon: "🎁",
        title: "예상치 못한 수입",
        situation: "갑자기 할머니가 용돈 50만원을 주셨다. 예상 못한 돈이 생겼다.",
        choices: [
            { text: "바로 사고 싶은 거 산다. 공짜로 생긴 돈이니까 부담 없이!", tag: TAGS.IMPULSE },
            { text: "일단 저축한다. 나중에 필요할 때 쓰자", tag: TAGS.SELF_CHECK },
            { text: "감사헌금을 드린다. 예상 못한 은혜에 감사하며", tag: TAGS.STEWARD_CONFESS },
            { text: "어려운 친구에게 밥 사주고 나머지는 저축한다", tag: TAGS.COMMUNITY }
        ]
    }
];

// ===== 나눔 칸 질문 =====
const SHARING_CARDS = [
    {
        id: 1,
        icon: "💬",
        title: "서로에게 질문",
        questions: [
            "최근에 돈 때문에 가장 스트레스받은 적이 언제였나요?",
            "\"이건 좀 충동구매였다\" 싶은 경험이 있나요?",
            "나의 한 달 소비에서 가장 큰 비중은 뭔가요?",
            "돈이 충분하면 가장 먼저 하고 싶은 것은?"
        ],
        instruction: "주사위를 굴려 나온 숫자에 해당하는 질문을 오른쪽 사람에게 물어보세요. (1~4 중 하나)"
    },
    {
        id: 2,
        icon: "💬",
        title: "솔직한 나눔",
        questions: [
            "헌금/십일조 드릴 때 솔직한 내 마음은 어떤가요?",
            "\"나중에 여유 생기면 더 잘 섬기겠다\"고 생각한 적 있나요?",
            "돈을 벌고 싶은 진짜 이유, 솔직히 말해볼 수 있나요?",
            "지금 내 삶에서 하나님보다 더 의지하고 있는 것이 있다면?"
        ],
        instruction: "주사위를 굴려 나온 숫자에 해당하는 질문에 전체가 돌아가며 대답해보세요. (1~4 중 하나)"
    }
];

// ===== 태그별 결과 메시지 & 연결 말씀 =====
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
        verse: "\"안식일에 만나를 거두러 나간 자들의 만나는 썩었다\" (출애굽기 16:20)",
        question: "\"여유 생기면 그때\"라고 했는데... 그 \"그때\"는 언제 올까요?"
    },
    [TAGS.IDOL_MONEY]: {
        description: "물질이 하나님보다 높은 자리를 차지하고 있을 수 있습니다.",
        verse: "\"속히 부하고자 하는 자는 형벌을 면하지 못하리라\" (잠언 28:20)",
        question: "돈 생각이 기도보다 먼저 떠오른다면, 내 마음의 왕좌에는 누가 앉아 있나요?"
    },
    [TAGS.NINETY_PERCENT]: {
        description: "십일조 후 나머지는 \"내 것\"이라는 생각이 강했습니다.",
        verse: "\"오늘 밤 네 영혼을 도로 찾으리니 네 준비한 것이 누구의 것이 되겠느냐\" (누가복음 12:20)",
        question: "10%를 드리는 것은 나머지 90%도 하나님의 것이라는 고백인데... 정말 그렇게 살고 있나요?"
    },
    [TAGS.SELF_RATIONALIZE]: {
        description: "그럴듯한 이유를 붙여 내 선택을 정당화하는 경향이 있습니다.",
        verse: "\"마음이 만물보다 거짓되고 심히 부패한지라 누가 능히 이를 알리요\" (예레미야 17:9)",
        question: "내가 만든 \"괜찮은 이유\"가 혹시 내 마음이 만들어낸 거짓은 아닐까요?"
    },
    [TAGS.HONEST_ADMIT]: {
        description: "자신의 욕심과 한계를 솔직하게 인정했습니다. 이것은 회개의 시작입니다.",
        verse: "\"진리를 알지니 진리가 너희를 자유롭게 하리라\" (요한복음 8:32)",
        question: "솔직함은 변화의 첫 걸음입니다. 이 고백을 하나님 앞에 내어놓을 수 있나요?"
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
        question: "아무도 안 본다고 해도, 하나님은 보고 계십니다."
    },
    [TAGS.HONESTY]: {
        description: "손해를 감수하더라도 정직을 선택했습니다.",
        verse: "\"여호와여 주의 장막에 머무를 자 누구오니이까... 손해를 볼지라도 변하지 아니하는 자\" (시편 15:1,4)",
        question: "정직으로 인해 손해를 봤을 때, 하나님이 기억하심을 믿나요?"
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
        verse: "\"그러므로 내일 일을 위하여 염려하지 말라\" (마태복음 6:34)",
        question: "불안이 나를 움직이게 할 때, 그 방향이 하나님을 향한 것인가요?"
    },
    [TAGS.IMPULSE]: {
        description: "순간적인 욕심에 따라 결정하는 경향이 있습니다.",
        verse: "\"망령되이 얻은 재물은 줄어가고 손으로 모은 것은 늘어가느니라\" (잠언 13:11)",
        question: "\"지금 아니면 안 돼\"라는 조급함, 세상이 만들어낸 거짓 긴급함은 아닌가요?"
    },
    [TAGS.COMMUNITY]: {
        description: "혼자 감당하지 않고 공동체의 도움을 구했습니다.",
        verse: "\"두 사람이 한 사람보다 나음은 그들이 수고함으로 좋은 상을 얻을 것임이라\" (전도서 4:9)",
        question: "나의 약함을 나눌 수 있는 공동체가 있다는 것, 이것도 은혜입니다."
    },
    [TAGS.DECISION]: {
        description: "물질의 유혹 앞에서 과감한 결단을 내렸습니다.",
        verse: "\"네 오른손이 너로 실족하게 하거든 찍어 내버리라\" (마태복음 5:30)",
        question: "이 결단을 지속할 수 있는 힘, 어디서 오나요?"
    },
    [TAGS.FOMO]: {
        description: "\"나만 뒤처지는 것 같다\"는 두려움에 흔들렸습니다.",
        verse: "\"사람이 수고하여 먹고 마시는 것이 하나님의 선물이라\" (전도서 3:13)",
        question: "남들의 속도가 아닌, 하나님이 정하신 내 삶의 때를 신뢰할 수 있나요?"
    },
    [TAGS.SELF_WORTH_MONEY]: {
        description: "돈이나 소비 수준이 내 가치를 결정한다고 느꼈습니다.",
        verse: "\"사람의 생명이 그 소유의 넉넉한 데 있지 아니하니라\" (누가복음 12:15)",
        question: "내 존재의 가치는 통장 잔고가 아닌 하나님의 형상에 있습니다. 이것을 믿나요?"
    }
};
