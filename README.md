
# :trophy: mtLOL 英雄聯盟積分戰績輔助工具

下載點1.6.1：https://drive.google.com/file/d/1TJlaPuDbgf2OZGo_rnxHjuj33rK_kXlg/view?usp=sharing

一款英雄聯盟單雙排積分查詢輔助工具，只需開著程式當配對成功進入聊天室即可自動查詢戰績

![image](https://raw.githubusercontent.com/motea927/mtLOL/master/demo/img/demo1.jpg)
![image](https://raw.githubusercontent.com/motea927/mtLOL/master/demo/img/demo2.jpg)

## :page_facing_up: 技術 & 框架

- **Sass(Scss)**：CSS預處理器
- **ES6**：ECMAScript 6 語法
- **axios**：基於Promise的HTTP庫，可以用在瀏覽器和node.js中
- **is-admin**：檢查系統管理員身分
- **league-connect**：英雄聯盟客戶端連線工具
- **cors-anywhere**：進行CORS request
- **vue-electron**：整合Vue的electron開發框架
- **vue-custom-scrollbar**：美化scrollbar
- **vue-router**：Vue官方路由管理器
- **vuetify**：Vue UI庫
- **vuex**：Vue狀態管理

## :pencil2: Reference

- **API-DOC**：http://lcu.vivide.re/
- **check-gameflow**：/lol-gameflow/v1/gameflow-phase
- **getTeamList**：/lol-champ-select/v1/session
- **getRankData**：/lol-ranked/v1/ranked-stats/{puuid}
- **getSummonersInfo**：/lol-summoner/v1/summoners/${el.summonerId}
- **getPlayerHistory**：https://acs-garena.leagueoflegends.com/v1/stats/player_history/TW/{accountId}?begIndex={begIndex}&endIndex={endIndex}