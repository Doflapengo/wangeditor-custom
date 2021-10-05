/**
 * @description 所有菜单的构造函数
 * @author wangfupeng
 */

import Bold from './bold/index'
import Head from './head/index'
import Link from './link/index'
import Italic from './italic/index'
import Underline from './underline/index'
import StrikeThrough from './strike-through/index'
import FontStyle from './font-style/index'
import FontSize from './font-size'
import Justify from './justify/index'
import Quote from './quote/index'
import BackColor from './back-color/index'
import FontColor from './font-color/index'
import Video from './video/index'
import Image from './img/index'
import Indent from './indent/index'
import Emoticon from './emoticon/index'
import List from './list/index'
import LineHeight from './lineHeight/index'
import Undo from './undo/index'
import Redo from './redo/index'
import Table from './table/index'
import Code from './code'
import SplitLine from './split-line/index'
import Todo from './todo'
import ImgDepot from './img-depot' // 图库
import Head_1 from './head-1' // 一级标题
import Head_2 from './head-2' // 二级标题
import Head_3 from './head-3' // 三级标题
import Head_4 from './head-4' // 四级标题
import Head_5 from './head-5' // 五级标题

export type MenuListType = {
    [key: string]: any
}

export default {
    bold: Bold,
    head: Head,
    italic: Italic,
    link: Link,
    underline: Underline,
    strikeThrough: StrikeThrough,
    fontName: FontStyle,
    fontSize: FontSize,
    justify: Justify,
    quote: Quote,
    backColor: BackColor,
    foreColor: FontColor,
    video: Video,
    image: Image,
    indent: Indent,
    emoticon: Emoticon,
    list: List,
    lineHeight: LineHeight,
    undo: Undo,
    redo: Redo,
    table: Table,
    code: Code,
    splitLine: SplitLine,
    todo: Todo,
    imgDepot: ImgDepot,
    'head-1': Head_1,
    'head-2': Head_2,
    'head-3': Head_3,
    'head-4': Head_4,
    'head-5': Head_5,
}
