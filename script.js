const brokers = {
  sbi: {
    name: "SBI証券",
    score: 0,
    tags: ["三井住友カード", "Vポイント", "NISA", "日本株", "S株"],
    strengths: ["三井住友カード／Oliveとのクレカ積立を重視する人に強い", "国内株・NISAを幅広く使いたい人向け", "S株で1株から取引できる"],
    cautions: ["カードの種類や年間利用額などでクレカ積立還元率が変わる"],
    url: "https://www.sbisec.co.jp/"
  },
  rakuten: {
    name: "楽天証券",
    score: 0,
    tags: ["楽天カード", "楽天ポイント", "楽天経済圏", "NISA", "かぶミニ"],
    strengths: ["楽天カード・楽天ポイントを普段から使う人と相性がよい", "NISAの国内株式・投資信託などの取引手数料が無料", "楽天経済圏との連携を重視する人に向く"],
    cautions: ["クレカ積立の還元率はカード種類や投信の条件で変わる"],
    url: "https://www.rakuten-sec.co.jp/"
  },
  monex: {
    name: "マネックス証券",
    score: 0,
    tags: ["dカード", "dポイント", "NISA", "ワン株", "投信保有ポイント"],
    strengths: ["dカード・dポイントを使う人に強い", "NISAの国内株・投資信託などの売買手数料が無料", "NISAのワン株も買付・売却手数料が無料"],
    cautions: ["dカード積立の還元率はカード種類・入会年数・積立額等で変わる"],
    url: "https://www.monex.co.jp/"
  },
  au: {
    name: "三菱UFJ eスマート証券",
    score: 0,
    tags: ["三菱UFJカード", "au PAYカード", "Ponta", "NISA", "プチ株"],
    strengths: ["三菱UFJカードやau PAYカードとの連携を重視する人に向く", "投信保有でPontaポイントが貯まる仕組みがある", "Pontaポイントを投資に利用できる"],
    cautions: ["カードや条件によってクレカ積立還元率が大きく変わる"],
    url: "https://kabu.com/"
  },
  matsui: {
    name: "松井証券",
    score: 0,
    tags: ["JCB", "J-POINT", "NISA", "投信残高ポイント", "初心者向け"],
    strengths: ["JCBオリジナルシリーズとのクレカ積立に対応", "NISAでもクレカ積立が対象", "投資信託の残高ポイントやシンプルなアプリを重視する人に向く"],
    cautions: ["クレカ積立の対象カードはJCBオリジナルシリーズが中心"],
    url: "https://www.matsui.co.jp/"
  }
};

const questions = [
  {
    category:"カード・ポイント",
    text:"普段の生活で楽天カード・楽天ポイントをよく使っていますか？",
    yes:{rakuten:5}, no:{}
  },
  {
    category:"カード・ポイント",
    text:"三井住友カード／OliveやVポイントを活用したいですか？",
    yes:{sbi:5}, no:{}
  },
  {
    category:"カード・ポイント",
    text:"dカード・dポイントを資産形成にも活用したいですか？",
    yes:{monex:5}, no:{}
  },
  {
    category:"カード・ポイント",
    text:"JCBカードやJ-POINTを普段から使っていますか？",
    yes:{matsui:4}, no:{}
  },
  {
    category:"カード・ポイント",
    text:"三菱UFJカード、au PAYカード、Pontaとの連携を重視しますか？",
    yes:{au:5}, no:{}
  },
  {
    category:"投資スタイル",
    text:"投資信託の積立を中心に、NISAを長期運用したいですか？",
    yes:{sbi:3,rakuten:3,monex:3,matsui:3,au:3}, no:{}
  },
  {
    category:"日本株",
    text:"日本株を1株単位から少額で買ってみたいですか？",
    yes:{sbi:3,rakuten:3,monex:3,au:3}, no:{}
  },
  {
    category:"重視すること",
    text:"証券会社選びでは「ポイントより、サービスの総合力」を重視しますか？",
    yes:{sbi:3,rakuten:2,monex:2,matsui:2,au:2}, no:{}
  }
];

let current = 0;
let scores = {};

const $ = id => document.getElementById(id);

function resetScores(){
  scores = {};
  Object.keys(brokers).forEach(k => scores[k] = 0);
}

function applyPoints(points){
  Object.entries(points).forEach(([key, value]) => scores[key] += value);
}

function renderQuestion(){
  const q = questions[current];
  $("questionNo").textContent = current + 1;
  $("questionTotal").textContent = questions.length;
  $("category").textContent = q.category;
  $("question").textContent = q.text;
  $("progressBar").style.width = `${((current + 1) / questions.length) * 100}%`;

  $("answers").innerHTML = `
    <button class="answer" data-choice="yes">
      <strong>はい</strong>
      <small>自分に近いと思う</small>
    </button>
    <button class="answer" data-choice="no">
      <strong>いいえ</strong>
      <small>あまり当てはまらない</small>
    </button>
  `;
  document.querySelectorAll(".answer").forEach(btn => {
    btn.addEventListener("click", () => {
      applyPoints(btn.dataset.choice === "yes" ? q.yes : q.no);
      current++;
      if(current < questions.length) renderQuestion();
      else showResult();
    });
  });
}

function showResult(){
  const ranking = Object.entries(scores)
    .sort((a,b) => b[1] - a[1])
    .map(([key, score]) => ({key, score, broker: brokers[key]}));

  const max = Math.max(...ranking.map(x => x.score), 1);
  const top = ranking[0];
  $("resultSummary").textContent =
    `今回の回答では「${top.broker.name}」との相性が最も高くなりました。上位だけでなく、各社の違いも確認してください。`;

  $("ranking").innerHTML = ranking.map((item, i) => {
    const width = Math.max(8, Math.round((item.score / max) * 100));
    return `
      <article class="rank-card">
        <div class="rank-top">
          <div><span class="rank-name">${i+1}位　${item.broker.name}</span></div>
          <div class="score">${item.score} pt</div>
        </div>
        <div class="bar-bg"><div class="bar" style="width:${width}%"></div></div>
        <div class="tags">${item.broker.tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>
        <h4>向いている理由</h4>
        <ul>${item.broker.strengths.map(s => `<li class="reason">${s}</li>`).join("")}</ul>
        <h4>注意点</h4>
        <ul>${item.broker.cautions.map(s => `<li class="reason">${s}</li>`).join("")}</ul>
        <p><a href="${item.broker.url}" target="_blank" rel="noopener noreferrer">公式サイトを確認する →</a></p>
      </article>
    `;
  }).join("");

  $("quiz").classList.add("hidden");
  $("result").classList.remove("hidden");
  window.scrollTo({top:0, behavior:"smooth"});
}

$("startBtn").addEventListener("click", () => {
  resetScores();
  current = 0;
  $("start").classList.add("hidden");
  $("result").classList.add("hidden");
  $("quiz").classList.remove("hidden");
  renderQuestion();
});

$("retryBtn").addEventListener("click", () => {
  resetScores();
  current = 0;
  $("result").classList.add("hidden");
  $("quiz").classList.remove("hidden");
  renderQuestion();
  window.scrollTo({top:0, behavior:"smooth"});
});
