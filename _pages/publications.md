---
layout: academic
title: "Publications"
description: "Peer-reviewed journal articles, an editorial, and international and national conference papers by Hüseyin Uğur Yıldız. Metrics from OpenAlex, refreshed monthly."
permalink: /publications/
---

<div class="shell">
  <header class="pagehead">
    <h1 id="pubs-h1">Publications</h1>
    <p class="lede">Peer-reviewed journal articles, an editorial, and international and national
      conference papers. Metrics are sourced from
      <a href="https://openalex.org/A5085505896" target="_blank" rel="noopener">OpenAlex</a> and refreshed monthly.</p>
  </header>

  <div class="statgrid" role="group" aria-label="Publication metrics">
    <div id="statTiles" style="display:contents"></div>
    <div class="stat wide">
      <div class="yearchart" id="yearChart"></div>
    </div>
  </div>
  <p class="statnote" id="pubBreakdown"></p>
</div>

<div class="filters">
  <div class="shell rows">
    <fieldset class="seg" aria-label="Filter by publication type" id="typeSeg">
      <button type="button" data-type="all" aria-pressed="true">All</button>
      <button type="button" data-type="journal" aria-pressed="false">Journal</button>
      <button type="button" data-type="editorial" aria-pressed="false">Editorial</button>
      <button type="button" data-type="confint" aria-pressed="false">Conf. (Intl.)</button>
      <button type="button" data-type="confnat" aria-pressed="false">Conf. (Natl.)</button>
    </fieldset>
    <div class="selects">
      <label class="selectwrap">Year
        <select id="yearSel"><option value="all">All</option></select>
      </label>
      <label class="selectwrap">Quartile
        <select id="qSel">
          <option value="all">All</option>
          <option value="Q1">Q1</option><option value="Q2">Q2</option><option value="Q3">Q3</option>
        </select>
      </label>
    </div>
    <div class="meta">
      <span id="pubCount" aria-live="polite"></span>
      <button class="btn btn-quiet" id="resetBtn" type="button" disabled>Reset</button>
    </div>
  </div>
</div>

<div class="shell">
  <div id="pubGroups"></div>
  <div class="emptystate" id="pubEmpty" hidden>
    <p><strong>No publications match these filters.</strong><br>
      For example, there are no national conference papers ranked Q1 — quartiles apply to journals only.</p>
    <button class="btn btn-quiet" type="button" onclick="resetFilters()">Clear all filters</button>
  </div>
</div>

<script>
/* Publication data — transcribed 1:1 from the publication record (43 entries). */
var SITE = "https://huguryildiz.com";
function DRIVE(id){return "https://drive.google.com/file/d/" + id + "/view";}
var PUBS = [
 {type:"journal",year:2025,authors:"Tantur Karagul, C., Akgun, M. B., <b>Yildiz, H. U.</b>, & Tavli, B.",title:"Mitigating energy cost of connection reliability in UWSNs through non-uniform k-connectivity",venue:"IEEE Internet of Things Journal",detail:"12(22), 47817–47826",q:"Q1",scie:true,doi:"https://doi.org/10.1109/JIOT.2025.3603829",pdf:"/files/papers/journal/tantur2025mitigating.pdf"},
 {type:"journal",year:2025,authors:"Asci, M., Akusta Dagdeviren, Z., Akram, V. K., <b>Yildiz, H. U.</b>, Dagdeviren, O., & Tavli, B.",title:"Enhancing drone network resilience: Investigating strategies for k-connectivity restoration",venue:"Computer Standards & Interfaces",detail:"92, 103941",q:"Q1",scie:true,doi:"https://doi.org/10.1016/j.csi.2024.103941",pdf:"/files/papers/journal/asci2025enhancing.pdf"},
 {type:"journal",year:2023,authors:"Gultekin, B., Nurcan-Atceken, D., Altin-Kayhan, A., <b>Yildiz, H. U.</b>, & Tavli, B.",title:"Exploring the tradeoff between energy dissipation, delay, and the number of backbones for broadcasting in wireless sensor networks through goal programming",venue:"Ad Hoc Networks",detail:"149, 103223",q:"Q1",scie:true,doi:"https://doi.org/10.1016/j.adhoc.2023.103223",pdf:"/files/papers/journal/gultekin2023exploring.pdf"},
 {type:"journal",year:2023,authors:"<b>Yildiz, H. U.</b>",title:"Joint effects of void region size and sink architecture on underwater WSNs lifetime",venue:"IEEE Sensors Journal",detail:"23(10), 11046–11056",q:"Q1",scie:true,doi:"https://doi.org/10.1109/JSEN.2023.3264159",pdf:"/files/papers/journal/yildiz2023joint.pdf"},
 {type:"journal",year:2022,authors:"Cobanlar, M., <b>Yildiz, H. U.</b>, Akram, V. K., Dagdeviren, O., & Tavli, B.",title:"On the tradeoff between network lifetime and k-connectivity-based reliability in UWSNs",venue:"IEEE Internet of Things Journal",detail:"9(23), 24444–24452",q:"Q1",scie:true,doi:"https://doi.org/10.1109/JIOT.2022.3188558",pdf:"/files/papers/journal/cobanlar2022onthetradeoff.pdf"},
 {type:"journal",year:2022,authors:"Carsancakli, M. F., Al Imran, M. A., <b>Yildiz, H. U.</b>, Kara, A., & Tavli, B.",title:"Reliability of linear WSNs: A complementary overview and analysis of impact of cascaded failures on network lifetime",venue:"Ad Hoc Networks",detail:"131, 102839",q:"Q1",scie:true,doi:"https://doi.org/10.1016/j.adhoc.2022.102839",pdf:"/files/papers/journal/carsancakli2022reliability.pdf"},
 {type:"journal",year:2021,authors:"Tekin, N., <b>Yildiz, H. U.</b>, & Gungor, V. C.",title:"Node-level error control strategies for prolonging the lifetime of wireless sensor networks",venue:"IEEE Sensors Journal",detail:"21(13), 15386–15397",q:"Q1",scie:true,doi:"https://doi.org/10.1109/JSEN.2021.3073889",pdf:"/files/papers/journal/tekin2021nodelevel.pdf"},
 {type:"journal",year:2019,authors:"<b>Yildiz, H. U.</b>, Kurt, S., & Tavli, B.",title:"Comparative analysis of transmission power level and packet size optimization strategies for WSNs",venue:"IEEE Systems Journal",detail:"13(3), 2264–2274",q:"Q1",scie:true,doi:"https://doi.org/10.1109/JSYST.2018.2864941",pdf:"/files/papers/journal/yildiz2019comparative.pdf"},
 {type:"journal",year:2019,authors:"<b>Yildiz, H. U.</b>",title:"Maximization of underwater sensor networks lifetime via fountain codes",venue:"IEEE Transactions on Industrial Informatics",detail:"15(8), 4602–4613",q:"Q1",scie:true,doi:"https://doi.org/10.1109/TII.2019.2892866",pdf:"/files/papers/journal/yildiz2019maximization.pdf"},
 {type:"journal",year:2019,authors:"Akbas, A., <b>Yildiz, H. U.</b>, Ozbayoglu, A. M., & Tavli, B.",title:"Neural network–based instant parameter prediction for wireless sensor network optimization models",venue:"Wireless Networks",detail:"25(6), 3405–3418",q:"Q2",scie:true,doi:"https://doi.org/10.1007/s11276-018-1808-y",pdf:"/files/papers/journal/akbas2019neural.pdf"},
 {type:"journal",year:2019,authors:"Erdem, H. E., <b>Yildiz, H. U.</b>, & Gungor, V. C.",title:"On the lifetime of compressive sensing based energy harvesting in underwater sensor networks",venue:"IEEE Sensors Journal",detail:"19(12), 4680–4687",q:"Q1",scie:true,doi:"https://doi.org/10.1109/JSEN.2019.2900427",pdf:"/files/papers/journal/erdem2019onthelifetime.pdf"},
 {type:"journal",year:2019,authors:"Sayit, M., Cetinkaya, C., <b>Yildiz, H. U.</b>, & Tavli, B.",title:"DASH–QoS: A scalable network layer service differentiation architecture for DASH over SDN",venue:"Computer Networks",detail:"154, 12–25",q:"Q1",scie:true,doi:"https://doi.org/10.1016/j.comnet.2019.02.015",pdf:"/files/papers/journal/sayit2019dash.pdf"},
 {type:"journal",year:2019,authors:"<b>Yildiz, H. U.</b>",title:"Investigation of maximum lifetime and minimum delay trade-off in underwater sensor networks",venue:"International Journal of Communication Systems",detail:"32(7), e3924",q:"Q2",scie:true,doi:"https://doi.org/10.1002/dac.3924",pdf:"/files/papers/journal/yildiz2019investigation.pdf"},
 {type:"journal",year:2019,authors:"<b>Yildiz, H. U.</b>, Gungor, V. C., & Tavli, B.",title:"Packet size optimization for lifetime maximization in underwater acoustic sensor networks",venue:"IEEE Transactions on Industrial Informatics",detail:"15(2), 719–729",q:"Q1",scie:true,doi:"https://doi.org/10.1109/TII.2018.2841830",pdf:"/files/papers/journal/yildiz2019packet.pdf"},
 {type:"journal",year:2018,authors:"<b>Yildiz, H. U.</b>",title:"The impact of transmission power levels set size on lifetime of wireless sensor networks in smart grids",venue:"Turkish Journal of Electrical Engineering & Computer Sciences",detail:"26(6), 3057–3071",q:"Q3",scie:true,doi:"https://journals.tubitak.gov.tr/elektrik/vol26/iss6/23/",pdf:"/files/papers/journal/yildiz2018theimpactof.pdf"},
 {type:"journal",year:2018,authors:"Yigit, M., <b>Yildiz, H. U.</b>, Kurt, S., Tavli, B., & Gungor, V. C.",title:"A survey on packet size optimization for terrestrial, underwater, underground, and body area sensor networks",venue:"International Journal of Communication Systems",detail:"31(11), e3572",q:"Q2",scie:true,doi:"https://doi.org/10.1002/dac.3572",pdf:"/files/papers/journal/yigit2018asurvey.pdf"},
 {type:"journal",year:2018,authors:"<b>Yildiz, H. U.</b>, Ciftler, B. S., Tavli, B., Bicakci, K., & Incebacak, D.",title:"The impact of incomplete secure connectivity on the lifetime of wireless sensor networks",venue:"IEEE Systems Journal",detail:"12(1), 1042–1046",q:"Q1",scie:true,doi:"https://doi.org/10.1109/JSYST.2016.2527744",pdf:"/files/papers/journal/yildiz2018theimpact.pdf"},
 {type:"journal",year:2017,authors:"<b>Yildiz, H. U.</b>, Tavli, B., Kahjogh, B., & Dogdu, E.",title:"The impact of incapacitation of multiple critical sensor nodes on wireless sensor network lifetime",venue:"IEEE Wireless Communications Letters",detail:"6(3), 306–309",q:"Q1",scie:true,doi:"https://doi.org/10.1109/LWC.2017.2679744",pdf:"/files/papers/journal/yildiz2017theimpact.pdf"},
 {type:"journal",year:2017,authors:"Kurt, S., <b>Yildiz, H. U.</b>, Yigit, M., Tavli, B., & Gungor, V. C.",title:"Packet size optimization in wireless sensor networks for smart grid applications",venue:"IEEE Transactions on Industrial Electronics",detail:"64(3), 2392–2401",q:"Q1",scie:true,doi:"https://doi.org/10.1109/TIE.2016.2619319",pdf:"/files/papers/journal/kurt2017packet.pdf",mostCited:true},
 {type:"journal",year:2016,authors:"Akbas, A., <b>Yildiz, H. U.</b>, Tavli, B., & Uludag, S.",title:"Joint optimization of transmission power level and packet size for WSN lifetime maximization",venue:"IEEE Sensors Journal",detail:"16(12), 5084–5094",q:"Q1",scie:true,doi:"https://doi.org/10.1109/JSEN.2016.2548661",pdf:"/files/papers/journal/akbas2016joint.pdf"},
 {type:"journal",year:2016,authors:"<b>Yildiz, H. U.</b>, Bicakci, K., Tavli, B., Gultekin, H., & Incebacak, D.",title:"Maximizing wireless sensor network lifetime by communication/computation energy optimization of non-repudiation security service: Node level versus network level strategies",venue:"Ad Hoc Networks",detail:"37(2), 301–323",q:"Q1",scie:true,doi:"https://doi.org/10.1016/j.adhoc.2015.08.026",pdf:"/files/papers/journal/yildiz2016maximizing.pdf"},
 {type:"journal",year:2016,authors:"<b>Yildiz, H. U.</b>, Tavli, & Yanikomeroglu, H.",title:"Transmission power control for link–level handshaking in wireless sensor networks",venue:"IEEE Sensors Journal",detail:"16(2), 561–576",q:"Q1",scie:true,doi:"https://doi.org/10.1109/JSEN.2015.2486960",pdf:"/files/papers/journal/yildiz2016transmission.pdf"},
 {type:"journal",year:2015,authors:"<b>Yildiz, H. U.</b>, Temiz, M., & Tavli, B.",title:"Impact of limiting hop count on the lifetime of wireless sensor networks",venue:"IEEE Communications Letters",detail:"19(4), 569–572",q:"Q1",scie:true,doi:"https://doi.org/10.1109/LCOMM.2015.2398411",pdf:"/files/papers/journal/yildiz2015impact.pdf"},
 {type:"journal",year:2014,authors:"Batmaz, A. U., <b>Yildiz, H. U.</b>, & Tavli, B.",title:"Role of unidirectionality and reverse path length on wireless sensor network lifetime",venue:"IEEE Sensors Journal",detail:"14(11), 3971–3982",q:"Q1",scie:true,doi:"https://doi.org/10.1109/JSEN.2014.2359156",pdf:"/files/papers/journal/batmaz2014role.pdf"},
 {type:"editorial",year:2025,authors:"Haytaoglu, E., Arslan, S. S., Dagdeviren, O., <b>Yildiz, H. U.</b>, & Ozturk, Y.",title:"Editorial brief for special issue: Mass connectivity and/or communication paradigms for the internet of things",venue:"Internet of Things",detail:"32, 101625",q:"Q1",scie:true,doi:"https://doi.org/10.1016/j.iot.2025.101625",pdf:"/files/papers/editorial/haytaoglu2025editorial.pdf"},
 {type:"confint",year:2025,authors:"Tantur Karagul, C. T., Akgun, M. B., <b>Yildiz, H. U.</b>, & Tavli, B.",title:"Non-uniform k-connectivity for energy-efficient and reliable underwater wireless sensor networks",venue:"2025 33rd Telecommunications Forum (TELFOR)",detail:"pp. 1–4, IEEE",doi:"https://doi.org/10.1109/TELFOR67910.2025.11314281",pdf:"/files/papers/conference/international/tantur2025nonuniform.pdf",slides:"https://docs.google.com/presentation/d/1K3TCWFDIhZuGReBDxBZDdtoVcevGus7G/"},
 {type:"confint",year:2021,authors:"Un, B. E., <b>Yildiz, H. U.</b>, & Tavli, B.",title:"Impact of critical node failures on lifetime of UWSNs with incomplete secure connectivity",venue:"2021 IEEE International Black Sea Conference on Communications and Networking (BlackSeaCom)",detail:"pp. 1–6, IEEE",doi:"https://doi.org/10.1109/BlackSeaCom52164.2021.9527803",pdf:"/files/papers/conference/international/un2021impact.pdf",slides:DRIVE("16p42o7-s9xBWWV8gUx-3SyKFfAXsvwHR")},
 {type:"confint",year:2020,authors:"Ozmen, A., <b>Yildiz, H. U.</b>, & Tavli, B.",title:"Impact of minimizing the eavesdropping risks on lifetime of underwater acoustic sensor networks",venue:"2020 28th Telecommunications Forum (TELFOR)",detail:"pp. 1–4, IEEE",doi:"https://doi.org/10.1109/TELFOR51502.2020.9306557",pdf:"/files/papers/conference/international/ozmen2020impact.pdf",slides:DRIVE("15alVG_AJGp1eepousobHjpCpnDDz3W47")},
 {type:"confint",year:2019,authors:"<b>Yildiz, H. U.</b>",title:"Utilization of multi-sink architectures for lifetime maximization in underwater sensor networks",venue:"2019 2nd IEEE Middle East and North Africa COMMunications Conference (MENACOMM)",detail:"IEEE",doi:"https://doi.org/10.1109/MENACOMM46666.2019.8988521",pdf:"/files/papers/conference/international/yildiz2019utilization.pdf",slides:DRIVE("16TwAEo1W8lqqKywIF9zQy7G5-Z-S53_T"),award:"Best Paper Award"},
 {type:"confint",year:2019,authors:"<b>Yildiz, H. U.</b>",title:"Prolonging the lifetime of underwater sensor networks under sinkhole attacks",venue:"14th International Conference on Underwater Networks & Systems (WUWNet '19)",detail:"pp. 1–5, ACM",doi:"https://doi.org/10.1145/3366486.3366516",pdf:"/files/papers/conference/international/yildiz2019prolonging.pdf",slides:DRIVE("16U6NPkWhqjBHdUU8XTomkTP_EdsL-GH9")},
 {type:"confint",year:2018,authors:"<b>Yildiz, H. U.</b>, Gungor, V. C., & Tavli, B.",title:"A hybrid energy harvesting framework for energy efficiency in wireless sensor networks based smart grid applications",venue:"2018 17th Annual Mediterranean Ad Hoc Networking Workshop (Med-Hoc-Net)",detail:"pp. 1–6, IEEE",doi:"https://doi.org/10.23919/MedHocNet.2018.8407079",pdf:"/files/papers/conference/international/yildiz2018ahybrid.pdf",slides:DRIVE("15SpGmcGRTPhGcBFtYmh1zJ0bOJWgXrSx")},
 {type:"confint",year:2016,authors:"Dagdeviren, O., Akram, V. K., Tavli, B., <b>Yildiz, H. U.</b>, & Atilgan, C.",title:"Distributed detection of critical nodes in wireless sensor networks using connected dominating set",venue:"2016 IEEE SENSORS",detail:"pp. 1–3, IEEE",doi:"https://doi.org/10.1109/ICSENS.2016.7808815",pdf:"/files/papers/conference/international/dagdeviren2016distributed.pdf",slides:DRIVE("15n6Oy9vLKkgJMUIEfWhdoGB-PG4lCLRl")},
 {type:"confint",year:2016,authors:"Tantur, C., <b>Yildiz, H. U.</b>, Kurt, S., & Tavli, B.",title:"Optimal transmission power level sets for lifetime maximization in wireless sensor networks",venue:"2016 IEEE SENSORS",detail:"pp. 1–3, IEEE",doi:"https://doi.org/10.1109/ICSENS.2016.7808888",pdf:"/files/papers/conference/international/tantur2016optimal.pdf",poster:DRIVE("15V0CTjMZu6wiDMg9AyxNaJQCpaUhOcxD")},
 {type:"confint",year:2015,authors:"<b>Yildiz, H. U.</b>, & Tavli, B.",title:"Prolonging wireless sensor network lifetime by optimal utilization of compressive sensing",venue:"2015 IEEE Globecom Workshops (GC Wkshps)",detail:"pp. 1–6, IEEE",doi:"https://doi.org/10.1109/GLOCOMW.2015.7414049",pdf:"/files/papers/conference/international/yildiz2015prolonging.pdf",slides:DRIVE("16r6UKYnylhsZX8nenBAxjtg5uCnpTa52")},
 {type:"confint",year:2014,authors:"<b>Yildiz, H. U.</b>, & Tavli, B.",title:"The impact of random power assignment in handshaking on wireless sensor network lifetime",venue:"2014 IEEE Globecom Workshops (GC Wkshps)",detail:"pp. 201–206, IEEE",doi:"https://doi.org/10.1109/GLOCOMW.2014.7063431",pdf:"/files/papers/conference/international/yildiz2014theimpactrandom.pdf",slides:DRIVE("16Y3ol-umGpcveJLMhc_pZTuqigtw8fEP")},
 {type:"confint",year:2014,authors:"<b>Yildiz, H. U.</b>, Kurt, S., & Tavli, B.",title:"The impact of near-ground path loss modeling on wireless sensor network lifetime",venue:"2014 IEEE Military Communications Conference (MILCOM)",detail:"pp. 1114–1119, IEEE",doi:"https://doi.org/10.1109/MILCOM.2014.188",pdf:"/files/papers/conference/international/yildiz2014theimpactnear.pdf",slides:DRIVE("15jZn25CaLQMSngx2aH00yvzvtiD3oSy9")},
 {type:"confint",year:2014,authors:"Akbas, A., <b>Yildiz, H. U.</b>, & Tavli, B.",title:"Data packet length optimization for wireless sensor network lifetime maximization",venue:"2014 10th International Conference on Communications (COMM)",detail:"pp. 1–6, IEEE",doi:"https://doi.org/10.1109/ICComm.2014.6866706",pdf:"/files/papers/conference/international/akbas2014data.pdf"},
 {type:"confint",year:2014,authors:"<b>Yildiz, H. U.</b>, Bicakci, K., & Tavli, B.",title:"Communication/computation trade-offs in wireless sensor networks: Comparing network-level and node-level strategies",venue:"2014 IEEE Topical Conference on Wireless Sensors and Sensor Networks (WiSNet)",detail:"pp. 49–51, IEEE",doi:"https://doi.org/10.1109/WiSNet.2014.6825515",pdf:"/files/papers/conference/international/yildiz2014communication.pdf",slides:DRIVE("16xQgqR0IGGUlx-9fmwTTnk1srKBS-9_w")},
 {type:"confnat",year:2019,authors:"<b>Yildiz, H. U.</b>",title:"Improvement of underwater acoustic sensor networks performance with fountain codes",venue:"2019 27th Signal Processing and Communications Applications Conference (SIU)",detail:"pp. 1–4, IEEE",doi:"https://doi.org/10.1109/SIU.2019.8806401",pdf:"/files/papers/conference/national/yildiz2019improvement.pdf",slides:DRIVE("16P_YL9_5u1bCfNzGJOZQnYrHXdjoNtZO")},
 {type:"confnat",year:2018,authors:"<b>Yildiz, H. U.</b>",title:"Minimum delay and maximum lifetime trade-off in underwater sensor networks",venue:"2018 National Conference on Electrical, Electronics and Biomedical Engineering (ELECO)",detail:"pp. 80–83, EMO",pdf:"/files/papers/conference/national/yildiz2018minimum.pdf",slides:DRIVE("16gkg1Tg8ATAHJFZv6DyxnuvCxmDf6R1k")},
 {type:"confnat",year:2018,authors:"Karakurt, Y., <b>Yildiz, H. U.</b>, & Tavli, B.",title:"The impact of mitigation of eavesdropping on wireless sensor networks lifetime",venue:"2018 26th Signal Processing and Communications Applications Conference (SIU)",detail:"pp. 1–4, IEEE",doi:"https://doi.org/10.1109/SIU.2018.8404252",pdf:"/files/papers/conference/national/karakurt2018impact.pdf",slides:DRIVE("16XhbRpe_H93KSsPHMIKzp2IgwA8Nz4b8")},
 {type:"confnat",year:2018,authors:"<b>Yildiz, H. U.</b>",title:"The impact of data fragmentation on network lifetime in underwater acoustic sensor networks",venue:"2018 26th Signal Processing and Communications Applications Conference (SIU)",detail:"pp. 1–4, IEEE",doi:"https://doi.org/10.1109/SIU.2018.8404333",pdf:"/files/papers/conference/national/yildiz2018impact.pdf",slides:DRIVE("16RrXq5rQ0TfTveU8T2c0VZO_YbVGIhDx")},
 {type:"confnat",year:2017,authors:"<b>Yildiz, H. U.</b>, Tavli, B., & Kahjogh, B. O.",title:"Assessment of wireless sensor network lifetime reduction due to elimination of critical node sets",venue:"2017 25th Signal Processing and Communications Applications Conference (SIU)",detail:"pp. 1–4, IEEE",doi:"https://doi.org/10.1109/SIU.2017.7960228",pdf:"/files/papers/conference/national/yildiz2017assessment.pdf",slides:DRIVE("15euPq5RHnGhSFm788StYStlpDJEYPMBA")}
];

(function(){
  var $ = function(s){return document.querySelector(s);};
  var $$ = function(s){return Array.prototype.slice.call(document.querySelectorAll(s));};

  var GROUPS = [
    ["journal","Journal articles","book"],
    ["editorial","Editorial","pen"],
    ["confint","Conference papers (international)","globe"],
    ["confnat","Conference papers (national, in Turkish)","flag"]
  ];
  var state = {type:"all", year:"all", q:"all"};
  var n = function(t){return PUBS.filter(function(p){return p.type === t;}).length;};
  var nq = function(q){return PUBS.filter(function(p){return p.type === "journal" && p.q === q;}).length;};

  var tiles = [
    ["link", "830", "Citations"],
    ["target", "15", "h-index"],
    ["layers", "44", "Works (OpenAlex)"],
    ["file", PUBS.length, "Publications listed"],
    ["book", n("journal"), "Journal articles"],
    ["pen", n("editorial"), "Editorial"],
    ["globe", n("confint"), "Conf. papers (intl.)"],
    ["flag", n("confnat"), "Conf. papers (natl.)"],
    ["award", nq("Q1"), "Q1 journal articles"]
  ];
  $("#statTiles").innerHTML = tiles.map(function(t){
    return '<div class="stat"><svg class="ic" aria-hidden="true"><use href="#i-' + t[0] +
    '"/></svg><b>' + t[1] + '</b><span>' + t[2] + '</span></div>';}).join("");
  $("#pubBreakdown").innerHTML =
    "Journal quartiles at publication year: <b>" + nq("Q1") + "</b> Q1 · <b>" + nq("Q2") +
    "</b> Q2 · <b>" + nq("Q3") + "</b> Q3. Citations, h-index, and works: OpenAlex, updated Jul 1, 2026 — refreshed monthly.";

  (function(){
    var years = PUBS.map(function(p){return p.year;});
    var y0 = Math.min.apply(null, years), y1 = Math.max.apply(null, years);
    var counts = {}, y;
    for (y = y0; y <= y1; y++) counts[y] = 0;
    years.forEach(function(yy){counts[yy]++;});
    var max = Math.max.apply(null, Object.keys(counts).map(function(k){return counts[k];}));
    var bw = 13, gap = 4, H = 44, W = (y1 - y0 + 1) * (bw + gap);
    var bars = "";
    for (y = y0; y <= y1; y++){
      var h = counts[y] ? Math.max(3, Math.round(counts[y] / max * (H - 12))) : 1.5;
      var x = (y - y0) * (bw + gap);
      bars += '<rect class="bar' + (counts[y] === max ? " hi" : "") + '" x="' + x +
        '" y="' + (H - 12 - h) + '" width="' + bw + '" height="' + h + '"><title>' +
        y + ": " + counts[y] + '</title></rect>';
    }
    $("#yearChart").innerHTML =
      '<svg width="' + W + '" height="' + H + '" role="img" aria-label="Publications per year, ' +
      y0 + " to " + y1 + '. Peak year: highest bar.">' + bars +
      '<text x="0" y="' + (H - 1) + '">' + y0 + '</text>' +
      '<text x="' + W + '" y="' + (H - 1) + '" text-anchor="end">' + y1 + '</text></svg>' +
      '<div class="cap">Publications per year</div>';
  })();

  var yearSel = $("#yearSel"), qSel = $("#qSel");
  var uniqueYears = PUBS.map(function(p){return p.year;}).filter(function(v,i,a){return a.indexOf(v)===i;}).sort(function(a,b){return b - a;});
  uniqueYears.forEach(function(yy){
    var o = document.createElement("option");
    o.value = yy; o.textContent = yy; yearSel.appendChild(o);
  });

  function match(p){
    if (state.type !== "all" && p.type !== state.type) return false;
    if (state.year !== "all" && p.year !== Number(state.year)) return false;
    if (state.q !== "all" && p.q !== state.q) return false;
    return true;
  }
  function linkRow(p){
    var out = "";
    if (p.q) out += '<span class="tag" title="Journal quartile in publication year">' + p.q + '</span>';
    if (p.scie) out += '<span class="tag" title="Indexed in Science Citation Index Expanded">SCIE</span>';
    if (p.award) out += '<span class="tag tag-award">' + p.award + '</span>';
    if (p.mostCited) out += '<span class="tag tag-award">Most cited</span>';
    if (p.doi) out += '<a class="publink ext" href="' + p.doi + '" target="_blank" rel="noopener"><i class="ai ai-doi" aria-hidden="true"></i> DOI<span class="sr-only"> (external)</span></a>';
    if (p.pdf) out += '<a class="publink ext" href="' + SITE + p.pdf + '" target="_blank" rel="noopener"><svg class="licon" aria-hidden="true"><use href="#i-file"/></svg> PDF<span class="sr-only"> (external)</span></a>';
    if (p.slides) out += '<a class="publink ext" href="' + p.slides + '" target="_blank" rel="noopener"><svg class="licon" aria-hidden="true"><use href="#i-slides"/></svg> Slides<span class="sr-only"> (external)</span></a>';
    if (p.poster) out += '<a class="publink ext" href="' + p.poster + '" target="_blank" rel="noopener"><svg class="licon" aria-hidden="true"><use href="#i-image"/></svg> Poster<span class="sr-only"> (external)</span></a>';
    return out;
  }
  function entry(p){
    var href = p.doi || (p.pdf ? SITE + p.pdf : null);
    var title = href
      ? '<a href="' + href + '" target="_blank" rel="noopener">' + p.title + '</a>'
      : p.title;
    return '<li class="pub"><span class="year tnum" aria-hidden="true">' + p.year + '</span>' +
      '<div><p class="t">' + title + '</p>' +
      '<p class="authors">' + p.authors + '</p>' +
      '<p class="venue"><i>' + p.venue + '</i>' + (p.detail ? ", " + p.detail : "") +
      ' <span class="sr-only">(' + p.year + ')</span></p>' +
      '<div class="row">' + linkRow(p) + '</div></div></li>';
  }
  function render(){
    var host = $("#pubGroups");
    var html = "", shown = 0;
    GROUPS.forEach(function(g){
      var items = PUBS.filter(function(p){return p.type === g[0] && match(p);});
      if (!items.length) return;
      shown += items.length;
      html += '<div class="pubgroup"><h2 class="sec"><svg class="hicon" aria-hidden="true"><use href="#i-' + g[2] + '"/></svg>' + g[1] +
        '<span class="count tnum">' + items.length + '</span></h2><ol class="publist">' +
        items.map(entry).join("") + '</ol></div>';
    });
    host.innerHTML = html;
    $("#pubEmpty").hidden = shown !== 0;
    $("#pubCount").textContent = "Showing " + shown + " of " + PUBS.length;
    var isDefault = state.type === "all" && state.year === "all" && state.q === "all";
    $("#resetBtn").disabled = isDefault;
  }
  $$("#typeSeg button").forEach(function(b){b.addEventListener("click", function(){
    state.type = b.dataset.type;
    $$("#typeSeg button").forEach(function(x){x.setAttribute("aria-pressed", String(x === b));});
    render();
  });});
  yearSel.addEventListener("change", function(){ state.year = yearSel.value; render(); });
  qSel.addEventListener("change", function(){ state.q = qSel.value; render(); });
  window.resetFilters = function(){
    state.type = "all"; state.year = "all"; state.q = "all";
    yearSel.value = "all"; qSel.value = "all";
    $$("#typeSeg button").forEach(function(x){x.setAttribute("aria-pressed", String(x.dataset.type === "all"));});
    render();
  };
  $("#resetBtn").addEventListener("click", window.resetFilters);
  render();
})();
</script>
