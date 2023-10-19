// initial state
import { menuList, subsMenuList } from '@/router/frameRouter'
import { filterDataWithId } from '@/common/dealMenu'
import vue from 'vue'

import api from '@/api/index'

const state = {
    navLists: [],
    addNavLists: [],
    user: {},
    // menuList: [],
    menuList: menuList,
    completeDynamicRoute: false,
    ticketCount: 0,
    activationMenu: [],
    updateCustomMenu: false
}
// 遍历 projects 目录下的所有文件和子目录
// @ts-ignore
const files = require.context('@/projects', true, /\.\/[^/]+\/.*/)
const hasCommonFolder = (fileName) => {
    return files.keys().some(key => key.indexOf(`/${fileName}/`) !== -1)
}

function handleMenuList(userInfo) {
    const handleNeedMenuList = handleActivationMenu(userInfo, 'custom')
    const userMenus = userInfo.menus
    return userInfo.is_super ? handleNeedMenuList : setMenuPurview(handleNeedMenuList, userMenus)
}

function handleActivationMenu(userInfo, type) {
    let customMenu = JSON.parse(JSON.stringify(menuList))
    // 若weops_menu自定义菜单选择是默认，则使用menulist内置菜单
    const weopsMenu = userInfo?.weops_menu
    if (type === 'custom' && weopsMenu && weopsMenu.length) {
        customMenu = weopsMenu
        if (hasCommonFolder('common')) {
            // @ts-ignore
            const commonFiles = require.context('@/projects', true, /\.ts$/)
            const module = commonFiles('./common/common/dynamicMenus.ts')
            console.log('[[[[[[[[[[[[[[', module)
            if (module?.default) {
                module.default.dealDynamicMenus(JSON.parse(JSON.stringify(menuList)), customMenu)
            }
        }
    }
    const inactiveMenuList = filterDataWithId(JSON.parse(JSON.stringify(customMenu)), 'CreditManage')
    const allMenus = JSON.parse(JSON.stringify(window['is_activate'] ? customMenu : inactiveMenuList))
    handleAllMenus(allMenus)
    const handleNeedMenuList = handleBelongModule(userInfo.applications, JSON.parse(JSON.stringify(allMenus)))
    return handleNeedMenuList
}

function handleBelongModule(moduleInfo, menuList) {
    let newMenuList = menuList
    newMenuList.forEach(item => {
        if (item.children) {
            item.children.forEach(nev => {
                if (nev.children) {
                    nev.children = nev.children.filter(tex => !tex.belongModule || (tex.belongModule && moduleInfo.includes(tex.belongModule)))
                    if (nev.children.length === 0) {
                        nev.needDel = true
                    }
                }
            })
            item.children = item.children.filter(tex => (!tex.belongModule && !tex.needDel) || (tex.belongModule && moduleInfo.includes(tex.belongModule)))
        }
    })
    newMenuList = newMenuList.filter(item => !item.belongModule || (item.belongModule && moduleInfo.includes(item.belongModule))).filter(item => !item.children || (item.children && item.children.length))
    if (!moduleInfo.includes('repository')) {
        newMenuList = newMenuList.filter(item => item.id !== 'lore')
    }
    return newMenuList
}

function setMenuPurview(list, purviewList) {
    list.forEach(item => {
        if (item.children) {
            item.children = setMenuPurview(item.children, purviewList)
        }
        item.purview = !item.sonMenuIds.every(tex => !purviewList.find(nev => nev === tex))
    })
    return list.filter(item => item.purview)
}

function handleAllMenus(list) {
    list.forEach(item => {
        item.sonMenuIds = [item.id]
        for (const k in subsMenuList) {
            if (subsMenuList[k].includes(item.id)) {
                item.belongModule = k
            }
        }
        if (item.children) {
            handleAllMenus(item.children)
            getSonMenuId(item.sonMenuIds, item.children)
        }
    })
}

function getSonMenuId(ids, list) {
    list.forEach(item => {
        if (item.children) {
            getSonMenuId(ids, item.children)
        } else {
            ids.push(item.id)
        }
    })
}

// 降序排列
function compare(p) {
    return function(m, n) {
        const a = m[p]
        const b = n[p]
        return a - b
    }
}
// getters
const getters = {
    addNavLists: () => {
        return state.addNavLists
    },
    navLists: () => {
        return state.navLists.sort(compare('sort'))
    },
    getUser: () => {
        return state.user
    }
}

// mutations
const mutations = {
    setNavLists(state, lists) {
        state.addNavLists = lists
        state.navLists = lists
    },
    setUser(state, user) {
        state.user = user
    },
    setMenuList(state, lists) {
        state.menuList = lists
    },
    setDynamicRoute(state, value) {
        state.completeDynamicRoute = value
    },
    setDynamicMenus(state, value) {
        state.dynamicMenus = value
    },
    setTicketCount(state, value) {
        state.ticketCount = value
    },
    setActivationMenu(state, value) {
        state.activationMenu = value
    },
    setCustomMenuStatus(state) {
        state.updateCustomMenu = !state.updateCustomMenu
    }
}

// actions
const actions = {
    async GenerateNavLists1({commit}) {
        // setTimeout(() => {
        //     vue.prototype.$bus.$emit('setAppLoading', true)
        // }, 0)
        // const promise = new Promise((resolve, reject) => {
        //     console.log('api', api)
        //     api.User.homeInfo().then(async res => {
        //         if (res.result) {
        //             const { data } = res
        //             sessionStorage.setItem('loginInfo', JSON.stringify(data))
        //             window['$store'].commit('setLoginInfo', data)
        //             commit('setUser', { ...data })
        //             if (api.ticket) {
        //                 api.ticket.getTickets({
        //                     page: 1,
        //                     page_size: 1,
        //                     view_type: 'my_todo'
        //                 }).then(res => {
        //                     if (!res.result) {
        //                         return false
        //                     }
        //                     commit('setTicketCount', res.data.count)
        //                 })
        //             }
        //             commit('setMenuList', handleMenuList(res.data))
        //             commit('setActivationMenu', handleActivationMenu(res.data, ''))
        //             if (res.data.applications.includes('chat_ops') && hasCommonFolder('common')) {
        //                 // @ts-ignore
        //                 const commonFiles = require.context('@/projects', true, /\.ts$/)
        //                 const module = commonFiles('./common/common/loadBot.ts')
        //                 if (module?.default) {
        //                     await module.default.loadChatBot()
        //                 }
        //             }
        //             resolve(res.data)
        //         } else {
        //             reject(res.message)
        //         }
        //     }).finally(() => {
        //         setTimeout(() => {
        //             vue.prototype.$bus.$emit('setAppLoading', false)
        //         }, 0)
        //     })
        // })
        // return promise
    },
    // async getAllUserList({commit}) {
    //     const promise = new Promise((resolve, reject) => {
    //         api.Server.getBkUsers({
    //             page_size: -1
    //         }).then(res => {
    //             if (res.result) {
    //                 const userData = res.data.items.filter(item => item.bk_username).map(item => {
    //                     return {
    //                         key: item.bk_username,
    //                         display: item.bk_username,
    //                         chname: item.chname,
    //                         displayKey: `${item.chname}(${item.bk_username})`
    //                     }
    //                 })
    //                 sessionStorage.setItem('allUserData', JSON.stringify(userData))
    //                 resolve(res.data)
    //             } else {
    //                 reject(res.message)
    //             }
    //         })
    //     })
    //     return promise
    // },
    updateMenuList({commit}, userInfo) {
        commit('setMenuList', handleMenuList(userInfo))
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
