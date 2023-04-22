(()=>{"use strict";var t,e=function(t,e,n,i){return new(n||(n=Promise))((function(o,c){function s(t){try{u(i.next(t))}catch(t){c(t)}}function r(t){try{u(i.throw(t))}catch(t){c(t)}}function u(t){var e;t.done?o(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(s,r)}u((i=i.apply(t,e||[])).next())}))};class n{constructor(){this.getStorage=t=>new Promise((e=>{chrome.storage.sync.get([t],(n=>{e(n[t]?JSON.parse(n[t]):null)}))})),this.setStorage=(t,n)=>e(this,void 0,void 0,(function*(){return chrome.storage.sync.set({[t]:JSON.stringify(n)})})),this.getConfig=()=>e(this,void 0,void 0,(function*(){return this.getStorage("inflearn-extra-config")})),this.setConfig=t=>e(this,void 0,void 0,(function*(){yield this.setStorage("inflearn-extra-config",t)}))}}t=n,n.getInstance=()=>(t.instance||(t.instance=new n),t.instance);var i,o=function(t,e,n,i){return new(n||(n=Promise))((function(o,c){function s(t){try{u(i.next(t))}catch(t){c(t)}}function r(t){try{u(i.throw(t))}catch(t){c(t)}}function u(t){var e;t.done?o(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(s,r)}u((i=i.apply(t,e||[])).next())}))};class c{constructor(t){this.configRepo=t,this.config={},this.isInit=!1,this.init=()=>o(this,void 0,void 0,(function*(){if(this.isInit)return;this.disableRestrictedMenu();const t=yield this.configRepo.getConfig(),e=document.querySelectorAll("li");for(const n of e){const e=n.querySelector("span");if(e){const t=e.getAttribute("data-i18n");e.innerText=chrome.i18n.getMessage(t)}const i=n.querySelector("input"),o=i.id;this.config[o]=null===t||t[o],["course-auto_skip","course-video_speed"].includes(o)&&(this.config[o]=!1),i.checked=this.config[o],i.addEventListener("click",(()=>{this.config[o]=!this.config[o],this.updateConfig()}))}this.configRepo.setConfig(this.config)})),this.disableRestrictedMenu=()=>{const t=document.querySelectorAll("section");t&&t.forEach(((t,e)=>{const n=t.querySelectorAll("li");let i=0;n.forEach(((e,n)=>{const o=e.querySelector("input");if(!o)return;const c=o.getAttribute("id");c&&(["course-auto_skip","course-video_speed"].includes(c)&&(e.style.display="none",i++),i===n+1&&(t.style.display="none"))}))}))},this.updateConfig=()=>{const t=document.querySelectorAll("li input");for(const e of t){const t=e.id;this.config[t]=e.checked,["course-auto_skip","course-video_speed"].includes(t)&&(this.config[t]=!1),e.checked=this.config[t]}this.configRepo.setConfig(this.config)}}}i=c,c.getInstance=t=>(i.instance||(i.instance=new c(t)),i.instance),document.addEventListener("DOMContentLoaded",(()=>o(void 0,void 0,void 0,(function*(){(yield chrome.tabs.query({currentWindow:!0,active:!0}))[0],c.getInstance(n.getInstance()).init()}))))})();