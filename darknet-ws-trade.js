/* darknet-ws-trade.js
 * 世界服务器数据碎片交易模块
 * 绑定到暗网市场"sell"标签页
 */

function renderWorldFragments(el) {
    /* 从 investSimState_v13 读取世界服务器数据碎片并显示 */
    if (!el) return;
    el.innerHTML = '';
    var panel = document.getElementById('worldFragPanel');

    var investRaw = localStorage.getItem('investSimState_v13');
    if (!investRaw) {
        if (panel) panel.style.display = 'none';
        return;
    }
    var investState;
    try { investState = JSON.parse(investRaw); } catch(e) {
        if (panel) panel.style.display = 'none';
        return;
    }
    var frags = investState.worldFragments || [];
    if (frags.length === 0) {
        if (panel) panel.style.display = 'none';
        return;
    }

    // Show the panel
    if (panel) panel.style.display = 'block';

    // 标题
    var titleDiv = document.createElement('div');
    titleDiv.style.cssText = 'margin-top:14px;font-size:12px;color:#00e5ff;font-weight:bold;';
    titleDiv.textContent = '🌐 世界服务器数据碎片';
    el.appendChild(titleDiv);

    // 碎片列表
    for (var i = 0; i < frags.length; i++) {
        var frag = frags[i];
        var card = document.createElement('div');
        card.style.cssText = 'background:rgba(0,229,255,0.08);border:1px solid rgba(0,229,255,0.25);border-radius:6px;padding:10px;margin-top:8px;font-size:11px;color:#ccc;';

        var info = document.createElement('div');
        info.innerHTML = '<span style="color:#00e5ff;">' + escapeHtml(frag.name) + '</span>'
            + ' | 来源：' + escapeHtml(frag.fromCluster || '未知') + ' / ' + escapeHtml(frag.fromServer || '未知')
            + ' | 价值 ₿' + parseFloat(frag.btcReward).toFixed(4)
            + ' | 信誉 +' + frag.repReward;
        card.appendChild(info);

        var btn = document.createElement('button');
        btn.textContent = '出售 ₿' + parseFloat(frag.btcReward).toFixed(4);
        btn.style.cssText = 'margin-top:6px;padding:4px 12px;background:linear-gradient(135deg,#00e5ff,#00b8d4);color:#000;border:none;border-radius:4px;cursor:pointer;font-size:11px;font-weight:bold;';
        btn.dataset.fragId = frag.id;
        btn.addEventListener('click', function() {
            sellWorldFragment(this.dataset.fragId);
        });
        card.appendChild(btn);

        el.appendChild(card);
    }
}

function sellWorldFragment(fragId) {
    /* 出售世界服务器数据碎片 */
    var gameState = loadState();
    if (!gameState) { log('存档未找到', 'error'); return; }

    var investRaw = localStorage.getItem('investSimState_v13');
    if (!investRaw) { log('投资模拟器存档未找到', 'error'); return; }
    var investState;
    try { investState = JSON.parse(investRaw); } catch(e) { log('存档解析失败', 'error'); return; }

    var frags = investState.worldFragments || [];
    var idx = -1;
    for (var i = 0; i < frags.length; i++) {
        if (frags[i].id === fragId) { idx = i; break; }
    }
    if (idx < 0) { log('数据碎片不存在或已出售', 'error'); return; }

    var frag = frags[idx];

    // 给 BTC
    var crypto = null;
    if (gameState.assets) {
        for (var j = 0; j < gameState.assets.length; j++) {
            if (gameState.assets[j].id === 'crypto') { crypto = gameState.assets[j]; break; }
        }
    }
    if (crypto) {
        crypto.holding += parseFloat(frag.btcReward);
    } else {
        if (!gameState.assets) gameState.assets = [];
        gameState.assets.push({ id: 'crypto', name: '比特币', holding: parseFloat(frag.btcReward), cost: 0 });
    }

    // 增加信誉
    gameState.darknetReputation = (gameState.darknetReputation || 0) + frag.repReward;

    // 从 investSimState_v13 移除
    frags.splice(idx, 1);
    investState.worldFragments = frags;
    try { localStorage.setItem('investSimState_v13', JSON.stringify(investState)); } catch(e) {}

    // 从 worldServerState 同步移除
    try {
        var wsRaw = localStorage.getItem('worldServerState');
        if (wsRaw) {
            var wsState = JSON.parse(wsRaw);
            if (wsState.player && wsState.player.dataFragments) {
                wsState.player.dataFragments = wsState.player.dataFragments.filter(function(f) { return f.id !== fragId; });
                localStorage.setItem('worldServerState', JSON.stringify(wsState));
            }
        }
    } catch(e) {}

    // FBI 热度
    gameState.fbiHeat = (gameState.fbiHeat || 0) + 5;

    saveState(gameState);
    updateStatus();
    renderDataTrade();

    log('数据碎片出售成功！' + frag.name + ' → ₿' + parseFloat(frag.btcReward).toFixed(4) + ' | 信誉+' + frag.repReward + ' | FBI热度+5', 'success');

    // FBI 突袭检查
    if (gameState.fbiHeat >= 80 && Math.random() < 0.15) {
        triggerFBIRaid();
    }
}

function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
}

// ===== 立即执行：包装 renderDataTrade + 初始渲染 =====
// 此 JS 放在主 script 之后加载，所以 renderDataTrade 已定义
(function() {
    // 1. 包装 renderDataTrade，使其也渲染世界服务器碎片
    if (typeof renderDataTrade === 'function') {
        var _oldRenderDataTrade = renderDataTrade;
        renderDataTrade = function() {
            _oldRenderDataTrade();
            var el = document.getElementById('worldFragments');
            if (el) renderWorldFragments(el);
        };
    }

    // 2. 初始渲染（页面加载后执行）
    // 用 setTimeout 0 确保在当前脚本执行完毕、页面更新后运行
    setTimeout(function() {
        var el = document.getElementById('worldFragments');
        if (el) renderWorldFragments(el);
        // 也重新调用 renderDataTrade 以确保包装生效
        if (typeof renderDataTrade === 'function') renderDataTrade();
    }, 0);
})();
