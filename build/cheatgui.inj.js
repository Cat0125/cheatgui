const cheatgui=(function(){const config={symbols:{expanded:'▼',collapsed:'◀'},minWindowWidth:150,minWindowHeight:100};function $(selector,parent=document){if(typeof selector!=='string')return selector;return $(parent).querySelector(selector);}
function createElem(name){return document.createElement(name);}
function distance(x1,y1,x2,y2){const a=x1-x2;const b=y1-y2;return Math.sqrt(a*a+b*b);}
function generateId(length,_chars=''){const chars=_chars||'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';let result='';for(let i=0;i<length;i++){result+=chars[Math.floor(Math.random()*chars.length)];}
return result;}
const utils={$,createElem,generateId,distance,appendToBody(widget){document.body.appendChild(widget.getRef());},includeCSS(css){const head=document.head;const style=createElem('style');style.setAttribute('type','text/css');style.innerHTML=css;head.appendChild(style);},includeCSSLink(url){const link=createElem('link');link.rel='stylesheet';link.href=url;document.head.appendChild(link);},includeJS(url){const script=createElem('script');script.src=url;document.body.appendChild(script);},loadTheme(url){const link=$(`link#cgui-theme`,document.head)||createElem('link');link.id='cgui-theme'
link.rel='stylesheet';link.href=url;document.head.appendChild(link);},updateConfig(newConfig){function updateNestedConfig(config,newConfig){for(const[key,value]of Object.entries(newConfig)){if(typeof value==='object'&&typeof config[key]==='object'){updateNestedConfig(config[key],value);}else if(config[key]!==undefined){config[key]=value;}}}
updateNestedConfig(config,newConfig);},getConfig(){return config;}};class GUIElement{constructor(){this.ref=null;}
_init(){this.addClass('cgui');}
addClass(...classes){this.ref.classList.add(...classes);return this;}
setClass(className){this.ref.className='cgui-widget '+className.trim();return this;}
removeClass(...classes){this.ref.classList.remove(...classes);return this;}
getRef(){return this.ref;}}
class View{constructor(){this.ref=null;}
init(){this.ref=createElem('div');return this;}
mount(target){this.ref=$(target);return this;}
setContent(html){this.ref.innerHTML=html;return this;}
append(widget){this.ref.appendChild(widget.getRef());return this;}}
class Window extends GUIElement{constructor(x,y,w,h,name='',expanded=true){super();this.ref=createElem('div');this._init();this.addClass('cgui-window');this.ref.style.position='absolute';this.ref.role='dialog';this.headerRef=createElem('div');this.headerRef.classList.add('cgui-window-header');const titleId=generateId(16);this.titleRef=createElem('span');this.titleRef.innerHTML=name;this.titleRef.id=titleId;this.titleRef.className='cgui-window-title';this.headerRef.appendChild(this.titleRef);this.setTitle(name);this.ref.setAttribute('aria-labeledby',titleId);this.headerRef.innerHTML+='&nbsp;';this.arrowRef=createElem('span');this.arrowRef.className='cgui-window-arrow';this.arrowRef.innerHTML=config.symbols.expanded;this.headerRef.appendChild(this.arrowRef);const contentId=generateId(16);this.contentRef=createElem('div');this.contentRef.id=contentId;this.contentRef.classList.add('cgui-window-content');this.ref.setAttribute('aria-describedby',contentId);this.resizeRef=createElem('span');this.resizeRef.className='cgui-window-resize';this.resizeRef.innerHTML='&#9698;';this.view=new View().mount(this.contentRef);this.ref.appendChild(this.headerRef);this.ref.appendChild(this.contentRef);this.ref.appendChild(this.resizeRef);this.ref.style.left=`${x}px`;this.ref.style.top=`${y}px`;this.resize(w,h);this.collapsed=!expanded;if(this.collapsed)this.collapse();document.body.appendChild(this.ref);this.isDragging=this.isResizing=false;this.initDraggable();this.initResize();this.initToggleOnClick();this.initActivationOnClick();}
setTitle(html){this.titleRef.innerHTML=html;return this;}
setContent(html){this.view.setContent(html);return this;}
append(widget){this.view.append(widget);return this;}
move(x,y){this.ref.style.left=`${x}px`;this.ref.style.top=`${y}px`;return this;}
setWidth(width){width=Math.max(width,config.minWindowWidth);this.width=width;this.ref.style.width=`${width}px`;return this;}
setHeight(height){height=Math.max(height,config.minWindowHeight);this.height=height;this.contentRef.style.height=`${height}px`;return this;}
resize(width,height){this.setWidth(width);this.setHeight(height);return this;}
collapse(){this.collapsed=true;this.ref.classList.add('collapsed');this.arrowRef.innerHTML=config.symbols.collapsed;return this;}
expand(){this.collapsed=false;this.ref.classList.remove('collapsed');this.arrowRef.innerHTML=config.symbols.expanded;return this;}
toggle(){if(this.collapsed){this.expand();}else{this.collapse();}
return this;}
hide(){this.ref.style.display='none';return this;}
show(){this.ref.style.display='block';return this;}
initDraggable(threshold=10){let startX,startY,offsetX,offsetY,isMouseDown=false;const startDragging=(e)=>{this.isDragging=true;this.ref.classList.add('cgui-dragging');}
const onMouseDown=(e)=>{e.preventDefault();e=e.touches?e.touches[0]:e;isMouseDown=true;startX=e.clientX;startY=e.clientY;offsetX=e.clientX-this.ref.offsetLeft;offsetY=e.clientY-this.ref.offsetTop;};const onMouseMove=(e)=>{e=e.touches?e.touches[0]:e;if(!this.isDragging){if(isMouseDown&&distance(startX,startY,e.clientX,e.clientY)>threshold&&!this.isResizing){startDragging();}
else return;}
this.move(e.clientX-offsetX,e.clientY-offsetY);};const onMouseUp=()=>{this.isDragging=isMouseDown=false;if(this.ref.classList.contains('cgui-dragging'))
this.ref.classList.remove('cgui-dragging');};this.headerRef.addEventListener('mousedown',onMouseDown);this.headerRef.addEventListener('touchstart',onMouseDown,{passive:true});document.addEventListener('mousemove',onMouseMove);document.addEventListener('touchmove',onMouseMove);document.addEventListener('mouseup',onMouseUp);document.addEventListener('touchend',onMouseUp);}
initToggleOnClick(threshold=10){let isClick=false,startX,startY;this.headerRef.addEventListener('pointerdown',e=>{isClick=true;startX=e.clientX;startY=e.clientY;});document.addEventListener('pointermove',e=>{if(distance(startX,startY,e.clientX,e.clientY)>threshold)
isClick=false;});this.headerRef.addEventListener('pointerup',()=>{if(isClick)this.toggle();});}
initActivationOnClick(){this.ref.addEventListener('pointerdown',()=>{[...document.getElementsByClassName('cgui-window')].forEach(win=>win.classList.remove('active'));this.ref.classList.add('active');});}
initResize(dist=15){let sx,sy,dx,dy,iw,ih;const onMouseDown=(e)=>{if(this.collapsed)return;e.preventDefault();e.stopPropagation();this.isResizing=true;[sx,sy,iw,ih]=[e.clientX,e.clientY,this.width,this.height];this.addClass('cgui-resizing');};const onMouseMove=(e)=>{if(this.isResizing){dx=e.clientX-sx;dy=e.clientY-sy;const newWidth=iw+dx;const newHeight=ih+dy;this.setWidth(newWidth);this.setHeight(newHeight);}};const onMouseUp=()=>{this.isResizing=false;this.removeClass('cgui-resizing');};this.resizeRef.addEventListener('mousedown',onMouseDown);document.addEventListener('mousemove',onMouseMove);document.addEventListener('mouseup',onMouseUp);}
getRef(){return this.ref;}}
class Element extends GUIElement{constructor(elementName='div'){super();this.ref=createElem(elementName);this._init();this.addClass('cgui-widget');}
setText(text){this.ref.innerHTML=text;return this;}
onClick(f){this.ref.addEventListener('click',f);return this;}}
class Text extends Element{constructor(text=''){super('div');this.addClass('cgui-text');this.setText(text);}}
class Button extends Element{constructor(text=''){super('button');this.addClass('cgui-btn');this.setText(text);}}
class Input extends Element{constructor(name='',text=''){super('div');this.addClass('cgui-input-wrapper');this.inputRef=createElem('input');this.inputRef.classList.add('cgui-input');this.ref.appendChild(this.inputRef);this.nameRef=createElem('div');this.nameRef.classList.add('cgui-input-name');this.ref.appendChild(this.nameRef);this.setText(text);this.setName(name);}
setName(name){this.nameRef.innerHTML=name;return this;}
onInput(f){this.inputRef.addEventListener('input',e=>f(e,this.getText()));return this;}
setText(text){this.inputRef.value=text;return this;}
getText(){return this.inputRef.value;}}
class Switch extends Element{constructor(text=''){super('label');const id=this.id=generateId(16);this.ref.for=id;this.addClass('cgui-switch');this.inputRef=createElem('input');this.inputRef.type='checkbox';this.inputRef.id=id;this.ref.appendChild(this.inputRef);this.sliderRef=createElem('span');this.sliderRef.className='cgui-switch-slider';this.ref.appendChild(this.sliderRef);this.textRef=createElem('span');this.textRef.className='cgui-switch-text';this.textRef.for=id;this.ref.appendChild(this.textRef);this.ref.tabIndex=0;this.setText(text);}
onChange(func){this.inputRef.addEventListener('change',e=>func(e,this.inputRef.checked));return this;}
isChecked(){return this.inputRef.checked;}
setText(text){this.textRef.innerHTML=text;return this;}}
class Tree extends Element{constructor(name='',expanded=false){super('div');this.addClass('cgui-tree');this.headerRef=createElem('div');this.headerRef.classList.add('cgui-tree-header');const titleId=generateId(16);this.titleRef=createElem('span');this.titleRef.innerHTML=name;this.titleRef.id=titleId;this.titleRef.className='cgui-tree-title';this.headerRef.appendChild(this.titleRef);this.headerRef.tabIndex=0;this.setTitle(name);this.headerRef.innerHTML+='&nbsp;';this.arrowRef=createElem('span');this.arrowRef.className='cgui-tree-arrow';this.arrowRef.innerHTML=config.symbols.expanded;this.headerRef.appendChild(this.arrowRef);const contentId=generateId(16);this.contentRef=createElem('div');this.contentRef.id=contentId;this.contentRef.classList.add('cgui-tree-content');this.view=new View().mount(this.contentRef);this.ref.appendChild(this.headerRef);this.ref.appendChild(this.contentRef);if(!expanded)this.collapse();this.initToggleOnClick();}
setTitle(html){this.titleRef.innerHTML=html;return this;}
setContent(html){this.view.setContent(html);return this;}
collapse(){this.ref.classList.add('collapsed');this.arrowRef.innerHTML=config.symbols.collapsed;return this;}
expand(){this.ref.classList.remove('collapsed');this.arrowRef.innerHTML=config.symbols.expanded;return this;}
toggle(){this.ref.classList.toggle('collapsed');if(this.ref.classList.contains('collapsed')){this.arrowRef.innerHTML=config.symbols.collapsed;}else{this.arrowRef.innerHTML=config.symbols.expanded;}
return this;}
append(widget){this.view.append(widget);return this;}
initToggleOnClick(threshold=10){this.headerRef.addEventListener('click',e=>{this.toggle();});}}
function openPopupMenu({title,items,closable=true,closeText='Close'}){return new Promise(resolve=>{let divWrapper=createElem('div');let divPopup=createElem('div');let divTitle=createElem('div');let divMenu=createElem('div');divWrapper.className='cgui-popup-menu-wrapper cgui-fadein';divPopup.className='cgui cgui-popup-menu';divTitle.className='cgui-popup-menu-title';divMenu.className='cgui-popup-menu-content';divPopup.appendChild(divTitle);divPopup.appendChild(divMenu);divWrapper.appendChild(divPopup);divTitle.innerHTML=title;let first=true;for(const item in items){const btn=createElem('button');btn.className='cgui-popup-menu-btn';btn.innerHTML=items[item];divMenu.appendChild(btn);if(first){first=false;setTimeout(()=>btn.focus(),0);}
btn.onclick=()=>{divWrapper.classList.add('cgui-fadeout');setTimeout(()=>{divWrapper.remove();resolve(item);},150);};}
if(closable){const btn=createElem('button');btn.className='cgui-popup-menu-btn';btn.innerHTML=closeText;divMenu.appendChild(btn);btn.onclick=()=>{divWrapper.classList.add('cgui-fadeout');setTimeout(()=>{divWrapper.remove();resolve(-1);},150);};}
document.body.appendChild(divWrapper);});}
return{GUIElement,View,Window,Element,Text,Button,Input,Switch,Tree,openPopupMenu,utils};})();if(typeof module!=='undefined'&&typeof module.exports=='object')module.exports=cheatgui;if(typeof globalThis!=='undefined')globalThis.cheatgui=cheatgui;;cheatgui.utils.includeCSS(`@charset "utf-8";.cgui{-webkit-tap-highlight-color:transparent;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif}.cgui-widget{color-scheme:dark;margin-bottom:8px;box-sizing:border-box}.cgui-window{color-scheme:dark;position:absolute;color:#fff;padding:0;margin:0;border-radius:8px;overflow:hidden;max-width:85vw;backdrop-filter:blur(6px);transition:box-shadow .2s;z-index:99998}.cgui-window-header{background:#000b;padding:10px;margin:0;appearance:button;-ms-appearance:button;-moz-appearance:button;-webkit-appearance:button;user-select:none;display:flex;outline:none;border:0;box-shadow:none;cursor:pointer}.cgui-window-title{padding:0;margin:0}.cgui-window-arrow{margin:0;padding:0;margin-left:auto;margin-top:-3px}.cgui-window-content{margin:0;background:#0009;padding:10px;overflow-y:auto;display:block;height:100%;overflow:auto}.cgui-window-resize{width:15px;height:15px;color:#fff7a;font-size:10px;position:absolute;bottom:0;right:0;text-align:center;cursor:nwse-resize;user-select:none}.cgui-window.collapsed{height:auto !important}.cgui-window.collapsed>.cgui-window-content{display:none}.cgui-window.collapsed>.cgui-window-resize{display:none}.cgui-window.active{z-index:99999}.cgui-window.active>.cgui-window-header{background:#000e;font-weight:bold}.cgui-window.active>.cgui-window-content{background:#000c}.cgui-window.cgui-dragging{box-shadow:0 0 24px 0 #0008}.cgui-window.cgui-dragging>.cgui-window-header{cursor:move !important}.cgui-resizing{cursor:nwse-resize !important}.cgui-window-content::-webkit-scrollbar{width:10px}.cgui-window-content::-webkit-scrollbar-track{background-color:transparent}.cgui-window-content::-webkit-scrollbar-thumb{background-color:#555c;border-radius:15px}.cgui-window-content::-webkit-scrollbar-thumb:hover{background-color:#777c}.cgui-btn{background:#555c;border:0;outline:none;color:#fff;padding:10px;width:100%;border-radius:8px;margin:5px 0 5px 0;display:block;transition:.1s;user-select:none;cursor:pointer}.cgui-btn:hover{background:#777c}.cgui-btn:active{background:#fffc;color:#000;transition:.15s}.cgui-input-wrapper{display:flexbox;flex-direction:row;margin:0;padding:3px}.cgui-input{background:#555c;outline:none;color:#fff;padding:10px;width:50%;border-radius:8px;margin:5px 0 5px 0;display:inline-block;transition:.1s;user-select:none;cursor:text;border:1px solid #777c;max-width:100%}.cgui-input:focus{border-color:#fffc}.cgui-input-name{display:inline-block;margin:0;padding:5px;margin-left:10px}.cgui-switch{position:relative;display:inline-flex;width:34px;height:24px;vertical-align:middle;margin-right:8px;cursor:pointer}.cgui-switch input{display:none}.cgui-switch-slider{position:absolute;top:0;left:0;right:0;bottom:0;background-color:#555c;border-radius:16px;transition:background-color .2s}.cgui-switch-slider::before{position:absolute;content:"";height:20px;width:20px;left:2px;top:2px;background-color:#fffc;border-radius:50%;transition:transform .2s}.cgui-switch:hover>.cgui-switch-slider::before{background-color:#fff}.cgui-switch>input:checked+.cgui-switch-slider{background-color:#fffc}.cgui-switch>input:checked+.cgui-switch-slider::before{background-color:#555e;transform:translateX(10px)}.cgui-switch:hover>input:checked+.cgui-switch-slider::before{background-color:#777}.cgui-switch-text{margin-left:40px;margin-top:2px}.cgui-tree{color-scheme:dark;color:#fff;padding:0;overflow:hidden;width:100%;margin:5px 0 8px 0}.cgui-tree>.cgui-tree-header{background:transparent;padding:4px;margin:0;appearance:button;-ms-appearance:button;-moz-appearance:button;-webkit-appearance:button;user-select:none;display:flex;outline:none;border:0;box-shadow:none;cursor:pointer;transition:background-color .3s;border-radius:8px}.cgui-tree>.cgui-tree-header>.cgui-tree-title{padding:0;margin:0;font-weight:bold}.cgui-tree>.cgui-tree-header>.cgui-tree-arrow{padding:0;margin:0;margin-left:auto;margin-top:-3px}.cgui-tree>.cgui-tree-content{margin:0;padding:10px;margin-left:5px;border-left:1px solid #555}.cgui-tree.collapsed>.cgui-tree-content{display:none}.cgui-tree>.cgui-tree-header:hover{background-color:#fff2;transition:background-color .15s}.cgui-popup-menu-wrapper{color-scheme:dark;background-color:#0008;position:fixed;top:0;right:0;left:0;bottom:0;z-index:1000001;display:flex}.cgui-popup-menu{background-color:#000c;color:#fff;width:90vw;max-width:900px;max-height:100vh;border-radius:30px;margin:auto;padding:0;overflow:hidden}.cgui-popup-menu-title{padding:16px 24px;margin:0;font-weight:bold;font-size:1.2em;background:#333c;text-align:center}.cgui-popup-menu-content{padding:0;margin:0;height:80vh;min-height:600px;overflow:auto;padding-top:15px}.cgui-popup-menu-btn{padding:16px;display:block;background:transparent;border:0;outline:none;width:100%;font-size:1.1em;user-select:none;transition:background-color .1s;cursor:pointer}.cgui-popup-menu-btn:hover{background-color:#333a}.cgui-popup-menu-btn:active{background-color:#666a}.cgui-popup-menu-content::-webkit-scrollbar{width:10px}.cgui-popup-menu-content::-webkit-scrollbar-track{background-color:transparent}.cgui-popup-menu-content::-webkit-scrollbar-thumb{background-color:#555c;border-radius:15px}.cgui-popup-menu-content::-webkit-scrollbar-thumb:hover{background-color:#777c}.cgui-fadeout{transition:opacity .15s;opacity:0}@keyframes cgui-fadein{0%{opacity:0}100%{opacity:1}}.cgui-fadein{animation:cgui-fadein .15s}`)