// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import('/@vite/client')
  // load latest content script
  import('./contentScriptHMR')
}

// remove or turn this off if you don't use side panel
const USE_SIDE_PANEL = true

// to toggle the sidepanel with the action button in chromium:
if (USE_SIDE_PANEL) {
  // @ts-expect-error missing types
  browser.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error: unknown) => console.error(error))
}

browser.runtime.onInstalled.addListener((): void => {
  // eslint-disable-next-line no-console
  console.log('Extension installed')
})
/*
let previousTabId = 0

// communication example: send previous tab title from background page
// see shim.d.ts for type declaration
browser.tabs.onActivated.addListener(async ({ tabId }) => {
  if (!previousTabId) {
    previousTabId = tabId
    return
  }

  let tab: Tabs.Tab

  try {
    tab = await browser.tabs.get(previousTabId)
    previousTabId = tabId
  }
  catch {
    return
  }

  // eslint-disable-next-line no-console
  console.log('previous tab', tab)
  sendMessage('tab-prev', { title: tab.title }, { context: 'content-script', tabId })
})

onMessage('get-current-tab', async () => {
  try {
    const tab = await browser.tabs.get(previousTabId)
    return {
      title: tab?.title,
    }
  }
  catch {
    return {
      title: undefined,
    }
  }
})
*/
// background script to handle interaction with tasks API

// @ts-expect-error missing type for chrome
chrome.runtime.onMessage.addListener(
  (request: any, sender: any, sendResponse: any) => {
    (async () => {
      const token = await getAuthToken(true)

      if (request.type === 'getTaskLists') {
        const taskListResponse = await fetch('https://www.googleapis.com/tasks/v1/users/@me/lists', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        const taskListJson = await taskListResponse.json()
        sendResponse({
          taskLists: taskListJson.items,
        })
      }
      else if (request.type === 'addTask') {
        // add to task list
        const {
          taskListId,
          ...apiRequest
        } = request
        const taskResponse = await fetch(`https://www.googleapis.com/tasks/v1/lists/${taskListId}/tasks`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(apiRequest),
        })

        const response = {
          success: taskResponse.ok,
          status: taskResponse.status,
          statusText: taskResponse.statusText,
        }

        sendResponse(response)
      }
    })()
    return true
  },
)

function getAuthToken(interactive: any) {
  return new Promise((resolve, reject) => {
    // @ts-expect-error missing type for chrome
    chrome.identity.getAuthToken({ interactive }, (token) => {
      // @ts-expect-error missing type for chrome
      if (chrome.runtime.lastError || !token) {
        // @ts-expect-error missing type for chrome
        reject(chrome.runtime.lastError.message)
      }
      else {
        resolve(token)
      }
    })
  })
}
