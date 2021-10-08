/**
 * @description 标题
 * @author wangfupeng
 */

import BtnMenu from '../menu-constructors/BtnMenu'
import $ from '../../utils/dom-core'
import Editor from '../../editor/index'
import { MenuActive } from '../menu-constructors/Menu'

class Head extends BtnMenu implements MenuActive {
    constructor(editor: Editor) {
        const $elem = $('<div class="w-e-menu" data-title="封面"><span class="icon iconfont" style="color: #999999;">&#xe7f3;</span></div>')
        super($elem, editor)
    }

    public clickHandler(): void {}

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
