/**
 * @description 标题
 * @author wangfupeng
 */

import BtnMenu from '../menu-constructors/BtnMenu'
import $, { DomElement } from '../../utils/dom-core'
import Editor from '../../editor/index'
import { MenuActive } from '../menu-constructors/Menu'
import { getRandomCode } from '../../utils/util'
import { TCatalog } from '../../config/events'
import { EMPTY_P } from '../../utils/const'
import bindEvent from './bind-event/index'

interface headItem {
    id: number
    level: number
    serial: number
    pid: number
    currentTitle: string
}

declare global {
    interface Window {
        oldCatalogs: any
        headsData: Array<any>
    }
}

class Head extends BtnMenu implements MenuActive {
    oldCatalogs: TCatalog[] | undefined

    headHtml: string
    headData: headItem

    constructor(editor: Editor) {
        const $elem = $('<div class="w-e-menu" data-title="一级标题" ><span class="h1">H1</span></div>')
        super($elem, editor)
        // 绑定事件
        bindEvent(editor)
        // this.command('<h1>')
        const onCatalogChange = editor.config.onCatalogChange
        // 未配置目录change监听回调时不运行下面操作
        if (onCatalogChange) {
            this.oldCatalogs = []
            this.addListenerCatalog() // 监听文本框编辑时的大纲信息
            this.getCatalogs() // 初始有值的情况获取一遍大纲信息
        }
        this.headHtml = ''
        this.headData = { id: 1, level: 1, serial: 1, pid: 0, currentTitle: '1' }
        window.headsData = []
    }

    public clickHandler(): void {
        const editor = this.editor
        const isSelectEmpty = editor.selection.isSelectionEmpty()

        // if (isSelectEmpty) {
        //     // 选区范围是空的，插入并选中一个“空白”
        //     editor.selection.createEmptyRange()
        // }

        // 执行 bold 命令
        this.command('<h1>')

        if (isSelectEmpty) {
            // 需要将选区范围折叠起来
            editor.selection.collapseRange()
            editor.selection.restoreSelection()
        }
    }

    /**
     * 执行命令
     * @param value value
     */
    public command(value: string): void {
        const editor = this.editor
        const tagName = editor.selection?.getSelectionContainerElem()?.elems[0].tagName
        const innerHtml = editor.selection?.getSelectionContainerElem()?.elems[0]?.innerHTML as string
        const cursorPrevElem = editor.selection?.getSelectionContainerElem()?.elems[0].previousSibling as Element
        const levelHead_1 = this.getAssignLevelElem(cursorPrevElem, 1) as Element
        let html = ''
        if (tagName !== 'H1') {
            if (!isNaN(Number(innerHtml.slice(0, 1)))) {
                html = innerHtml.slice(innerHtml.indexOf(' ') + 1)
            } else {
                // 不是标题
                html = innerHtml
            }
            if (levelHead_1) {
                let head_1_serial = levelHead_1.getAttribute('serial')
                this.headData = {
                    id: Number(window.headsData[window.headsData.length - 1].id) + 1,
                    level: 1,
                    serial: Number(head_1_serial) + 1,
                    pid: 0,
                    currentTitle: `${Number(head_1_serial) + 1}`,
                }
                this.headHtml = `<h1 level="${this.headData.level}" uniqueid="${this.headData.id}" serial="${this.headData.serial}" pid="${this.headData.pid}" currentTitle="${this.headData.currentTitle}">${this.headData.currentTitle} ${html}</h1>`
            } else {
                if (window.headsData.length > 0) {
                    let head_1_data = window.headsData.filter(item => item.level === 1)
                    if (head_1_data.length > 0) {
                        let lasthead_1 = head_1_data[head_1_data.length - 1]
                        console.log(lasthead_1)
                        this.headData = {
                            id: Number(window.headsData[window.headsData.length - 1].id) + 1,
                            level: 1,
                            serial: lasthead_1.serial + 1,
                            pid: 0,
                            currentTitle: `${lasthead_1.serial + 1}`,
                        }
                    } else {
                        this.headData = {
                            id: 1,
                            level: 1,
                            serial: 1,
                            pid: 0,
                            currentTitle: `1`,
                        }
                    }
                } else {
                    this.headData = {
                        id: 1,
                        level: 1,
                        serial: 1,
                        pid: 0,
                        currentTitle: `1`,
                    }
                }

                this.headHtml = `<h1 level="${this.headData.level}" uniqueid="${this.headData.id}" serial="${this.headData.serial}" pid="${this.headData.pid}" currentTitle="${this.headData.currentTitle}">${this.headData.currentTitle} ${html}</h1>`
            }
            $(editor.selection?.getSelectionContainerElem()?.elems[0]).clearHtml()
            editor.cmd.do('insertHTML', this.headHtml)
            window.headsData.push(this.headData)
        }
        window.oldCatalogs = this.oldCatalogs || []

        // 标题设置成功且不是<p>正文标签就配置大纲id
        value !== '<p>' && this.addUidForSelectionElem()
    }

    /**
     * 递归获取指定等级的元素
     */
    public getAssignLevelElem(elem: Element, level: Number): any {
        if (elem === null) {
            return null
        }
        if (elem === undefined) {
            return false
        }
        if (Number(elem.getAttribute('level')) === level) {
            return elem
        } else {
            return this.getAssignLevelElem(elem.previousSibling as Element, level)
        }
    }

    /**
     * 为标题设置大纲
     */
    private addUidForSelectionElem() {
        const editor = this.editor
        const tag = editor.selection.getSelectionContainerElem()
        const id = getRandomCode() // 默认五位数id
        $(tag).attr('id', id)
    }

    /**
     * 监听change事件来返回大纲信息
     */
    private addListenerCatalog() {
        const editor = this.editor
        editor.txt.eventHooks.changeEvents.push(() => {
            this.getCatalogs()
        })
    }

    /**
     * 获取大纲数组
     */
    private getCatalogs() {
        const editor = this.editor
        const $textElem = this.editor.$textElem
        const onCatalogChange = editor.config.onCatalogChange
        const elems = $textElem.find('h1,h2,h3,h4,h5')
        const catalogs: TCatalog[] = []
        elems.forEach((elem, index) => {
            const $elem = $(elem)
            let id = $elem.attr('id')
            let level = $elem.attr('level')
            let serial = $elem.attr('serial')
            const pId = 1
            const tag = $elem.getNodeName()
            const text = $elem.text()
            if (!id) {
                id = getRandomCode()
                $elem.attr('id', id)
            }
            // 标题为空的情况不生成目录
            if (!text) return
            catalogs.push({
                tag,
                id,
                text,
                level,
                serial,
                pId,
            })
        })
        // 旧目录和新目录对比是否相等，不相等则运行回调并保存新目录到旧目录变量，以方便下一次对比
        if (JSON.stringify(this.oldCatalogs) !== JSON.stringify(catalogs)) {
            this.oldCatalogs = catalogs
            onCatalogChange && onCatalogChange(catalogs)
        }
    }
    /**
     * 设置选中的多行标题
     * @param value  需要执行的命令值
     */
    private setMultilineHead(value: string) {
        const editor = this.editor
        const $selection = editor.selection
        // 初始选区的父节点
        const containerElem = $selection.getSelectionContainerElem()?.elems[0]!
        // 白名单：用户选区里如果有该元素则不进行转换
        const _WHITE_LIST = ['IMG', 'VIDEO', 'TABLE', 'TH', 'TR', 'UL', 'OL', 'PRE', 'HR', 'BLOCKQUOTE']
        // 获取选中的首、尾元素
        const startElem = $($selection.getSelectionStartElem())
        let endElem = $($selection.getSelectionEndElem())
        // 判断用户选中元素是否为最后一个空元素，如果是将endElem指向上一个元素
        if (endElem.elems[0].outerHTML === $(EMPTY_P).elems[0].outerHTML && !endElem.elems[0].nextSibling) {
            endElem = endElem.prev()!
        }
        // 存放选中的所有元素
        const cacheDomList: DomElement[] = []
        cacheDomList.push(startElem.getNodeTop(editor))
        // 选中首尾元素在父级下的坐标
        const indexList: number[] = []
        // 选区共同祖先元素的所有子节点
        const childList = $selection.getRange()?.commonAncestorContainer.childNodes
        // 找到选区的首尾元素的下标，方便最后恢复选区
        childList?.forEach((item, index) => {
            if (item === cacheDomList[0].getNode()) {
                indexList.push(index)
            }
            if (item === endElem.getNodeTop(editor).getNode()) {
                indexList.push(index)
            }
        })
        // 找到首尾元素中间所包含的所有dom
        let i = 0
        // 数组中的当前元素不等于选区最后一个节点时循环寻找中间节点
        while (cacheDomList[i].getNode() !== endElem.getNodeTop(editor).getNode()) {
            // 严谨性判断，是否元素为空
            if (!cacheDomList[i].elems[0]) return
            let d = $(cacheDomList[i].next().getNode())
            cacheDomList.push(d)
            i++
        }
        // 将选区内的所有子节点进行遍历生成对应的标签
        cacheDomList?.forEach((_node, index) => {
            // 判断元素是否含有白名单内的标签元素
            if (!this.hasTag(_node, _WHITE_LIST)) {
                const $h = $(value)
                const $parentNode = _node.parent().getNode()
                // 设置标签内容
                $h.html(`${_node.html()}`)
                // 插入生成的新标签
                $parentNode.insertBefore($h.getNode(), _node.getNode())
                // 移除原有的标签
                _node.remove()
            }
        })
        // 重新设置选区起始位置，保留拖蓝区域
        $selection.createRangeByElems(containerElem.children[indexList[0]], containerElem.children[indexList[1]])
    }
    /**
     * 是否含有某元素
     * @param elem 需要检查的元素
     * @param whiteList 白名单
     */
    private hasTag(elem: DomElement, whiteList: string[]): boolean {
        if (!elem) return false
        if (whiteList.includes(elem?.getNodeName())) return true
        let _flag = false
        elem.children()?.forEach(child => {
            _flag = this.hasTag($(child), whiteList)
        })
        return _flag
    }
    /**
     * 尝试改变菜单激活（高亮）状态
     */
    public tryChangeActive() {
        const editor = this.editor
        const reg = /^h/i
        const cmdValue = editor.cmd.queryCommandValue('formatBlock')
        if (reg.test(cmdValue)) {
            this.active()
        } else {
            this.unActive()
        }
    }
}

export default Head
