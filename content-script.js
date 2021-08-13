// Listen for messages
chrome.runtime.onMessage.addListener( function( type, sender, callback ) {
  // If the received message has the expected format...
   if(type === 'check') {
       const resultDOM = grabPost();
       resultDOM && sendMessage(status, 1)
       callback( resultDOM );
   }
});



function sendMessage(type, message) {
  chrome.runtime.sendMessage({type, message});
}

function grabPost() {
  const contentHTML = document.querySelector('.rich_media_content').outerHTML;
  const newContentNode = document.createElement('section')

  newContentNode.innerHTML = contentHTML

  filterDomNode(newContentNode)

  const copyHTML = `<exclude-tag>${newContentNode.outerHTML}</exclude-tag>`

  return copyHTML
}

function filterDomNode(dom) {
  // 移除图片
  dom.querySelectorAll('img').forEach(imgNode => {
    imgNode.remove()
  })

  // 移除后面的备注信息，以最后一条分割线为基准，后面的都不要
  const lastHr = [...dom.querySelectorAll('hr')].pop()
  const lastHrSiblings = []
  if(lastHr) {
    let nextDom = lastHr.nextElementSibling
    while(nextDom) {
      lastHrSiblings.push(nextDom)
      nextDom = nextDom.nextElementSibling
    }
  }
  lastHrSiblings.forEach(node => node.remove())


  // 移除read more
  dom.querySelector('.rich_media_tool')?.remove()


  // 移除推荐
  dom.querySelector('.rich_media_area_extra')?.remove()
  return dom
}
