// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  const queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    const tab = tabs[0];

    const url = tab.url;

    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });
}

// 获取当前tab
function getCurrentTab() {
	// Query filter to be passed to chrome.tabs.query - see
	// https://developer.chrome.com/extensions/tabs#method-query
  return new Promise((resolve, reject) => {
    var queryInfo = {
      active: true,
      currentWindow: true
    };
  
    chrome.tabs.query( queryInfo, function( tabs ) {
      var tab = tabs[0];
      resolve( tab );
    });
  })
}

// 渲染标题
function renderTitle(text) {
  const el = document.querySelector('#title')
  el.innerHTML = text
}

// 复制到剪贴板
function unsafeSetClipboard(content) {
  return new Promise((resolve, reject) => {
    const input = document.createElement('textarea')
    input.setAttribute('readonly', 'readonly')
    input.value = content
    input.setAttribute('value', content)
    document.body.appendChild(input)
    input.select()
    if (document.execCommand) {
      document.execCommand('copy')
      resolve()
    } else {
      reject(new Error('复制失败'))
    }
    document.body.removeChild(input)
  })
}


// 发送消息
function sendMessage(tabId, message, cb) {
  chrome.tabs.sendMessage(tabId, message, cb)
}

// 格式化代码
function lintCode(html) {
  const lintHTML =  prettier.format(html, {
    parser: "html",
    plugins: prettierPlugins,
  })

  return lintHTML
}

// 复制
function handleCopy(content, tab) {
  const lintHTML = `<exclude-tag>\r\n<!-- 原文链接: ${tab.url} -->\r\n${lintCode(content)}</exclude-tag>\r\n`
  console.log('handleCopy:', lintHTML)
  unsafeSetClipboard(lintHTML).then(() => {
    renderTitle('🦌 哒哒哒，抓取完毕。<br />去编辑器粘贴吧～')
  }) 
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTab().then(tab => {
    const url = tab.url

    if (url.includes('mp.weixin.qq.com')) {
      renderTitle('抓取中...<br /> 稍等片刻')
      document.querySelector('#btn').style.display = 'none'
      sendMessage(tab.id, 'check', copiedContent => {
        handleCopy(copiedContent, tab)
      })
    } else {
      renderTitle('当前页面不是微信公众号文章页面，请检查后重试！')
      document.querySelector('#btn').style.display = 'none'
    }
  })

});
