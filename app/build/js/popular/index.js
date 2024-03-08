"use strict";(()=>{var ne=Object.defineProperty,oe=Object.defineProperties;var ae=Object.getOwnPropertyDescriptors;var O=Object.getOwnPropertySymbols;var Z=Object.prototype.hasOwnProperty,ee=Object.prototype.propertyIsEnumerable;var X=(u,e,t)=>e in u?ne(u,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):u[e]=t,S=(u,e)=>{for(var t in e||(e={}))Z.call(e,t)&&X(u,t,e[t]);if(O)for(var t of O(e))ee.call(e,t)&&X(u,t,e[t]);return u},te=(u,e)=>oe(u,ae(e));var ie=(u,e)=>{var t={};for(var i in u)Z.call(u,i)&&e.indexOf(i)<0&&(t[i]=u[i]);if(u!=null&&O)for(var i of O(u))e.indexOf(i)<0&&ee.call(u,i)&&(t[i]=u[i]);return t};var H=(u,e,t)=>new Promise((i,n)=>{var c=d=>{try{p(t.next(d))}catch(v){n(v)}},a=d=>{try{p(t.throw(d))}catch(v){n(v)}},p=d=>d.done?i(d.value):Promise.resolve(d.value).then(c,a);p((t=t.apply(u,e)).next())});var I=class extends HTMLElement{constructor(t,i){super();this.image=null;this.render(t,i)}render(t,i){let n=document.createElement("img");n.className="thumb",n.src=t,n.alt=i,n.onerror=this.onError.bind(this),this.image=n,this.appendChild(n)}onError(){var t;this.dataset.fail="true",console.error("Failed to load image"),(t=this.image)==null||t.remove()}};var $="BookWorld";var y=class{constructor(){this.subscribers=[]}subscribe(e){this.subscribers.push(e)}unsubscribe(e){this.subscribers=this.subscribers.filter(t=>t!==e)}notify(e){this.subscribers.forEach(t=>t(e))}};var D=class{constructor(e,t){this.categoriesUpdatePublisher=new y;this.bookUpdatePublisher=new y;this._favorites=e||{},this._sortedKeys=t||[]}get favorites(){return S({},this._favorites)}set favorites(e){this._favorites=e}get sortedKeys(){return[...this._sortedKeys]}set sortedKeys(e){this._sortedKeys=e}add(e){this._favorites[e]=[],this.categoriesUpdatePublisher.notify({type:"add",payload:{name:e}})}addSortedKeys(e){this._sortedKeys.push(e)}rename(e,t){e in this._favorites&&(this._favorites[t]=this._favorites[e],delete this._favorites[e],this.categoriesUpdatePublisher.notify({type:"rename",payload:{prevName:e,newName:t}}))}renameSortedKeys(e,t){let i=this._sortedKeys.indexOf(e);i!==-1&&(this._sortedKeys[i]=t)}change(e,t){let i=this._sortedKeys.indexOf(e),n=this._sortedKeys.indexOf(t);this._sortedKeys[n]=e,this._sortedKeys[i]=t,this.categoriesUpdatePublisher.notify({type:"change",payload:{targetIndex:n,draggedIndex:i}})}delete(e){delete this._favorites[e],this.categoriesUpdatePublisher.notify({type:"delete",payload:{name:e}})}deleteSortedKeys(e){let t=this._sortedKeys.indexOf(e);return this._sortedKeys.splice(t,1),t}has(e){return e in this._favorites}addBook(e,t){e in this._favorites&&this._favorites[e].unshift(t),this.bookUpdatePublisher.notify()}hasBook(e,t){return e in this._favorites&&this._favorites[e].includes(t)}removeBook(e,t){if(e in this._favorites){let i=this._favorites[e].indexOf(t);i!=-1&&this._favorites[e].splice(i,1)}this.bookUpdatePublisher.notify()}subscribeCategoriesUpdate(e){this.categoriesUpdatePublisher.subscribe(e)}unsubscribeCategoriesUpdate(e){this.categoriesUpdatePublisher.unsubscribe(e)}subscribeBookUpdate(e){this.bookUpdatePublisher.subscribe(e)}unsubscribeBookUpdate(e){this.bookUpdatePublisher.unsubscribe(e)}};var x=class{constructor(e){this.publisher=new y;this._libraries=e}get libraries(){return S({},this._libraries)}set libraries(e){this._libraries=e}add(e,t){this._libraries[e]=t,this.publisher.notify({type:"add",payload:{code:e,name:t}})}remove(e){delete this._libraries[e],this.publisher.notify({type:"delete",payload:{code:e}})}has(e){return e in this._libraries}subscribeUpdate(e){this.publisher.subscribe(e)}unsubscribeUpdate(e){this.publisher.subscribe(e)}};var R=class{constructor(e){this.updatePublisher=new y;this.detailUpdatePublisher=new y;this._regions=e}get regions(){return S({},this._regions)}set regions(e){this._regions=e}add(e){this._regions[e]={},this.updatePublisher.notify()}remove(e){delete this._regions[e],this.updatePublisher.notify()}addDetail(e,t,i){e in this._regions&&(this._regions[e][t]=i),this.detailUpdatePublisher.notify()}removeDetail(e,t){e in this._regions&&t in this._regions[e]&&delete this._regions[e][t],this.detailUpdatePublisher.notify()}subscribeUpdatePublisher(e){this.updatePublisher.subscribe(e)}unsubscribeUpdatePublisher(e){this.updatePublisher.unsubscribe(e)}subscribeDetailUpdatePublisher(e){this.detailUpdatePublisher.subscribe(e)}unsubscribeDetailUpdatePublisher(e){this.detailUpdatePublisher.unsubscribe(e)}};var le=u=>JSON.parse(JSON.stringify(u)),re={favorites:{},sortedFavoriteKeys:[],libraries:{},regions:{}},z=class{constructor(){this.bookStateUpdatePublisher=new y;let e=this.loadStorage()||le(re),{favorites:t,sortedFavoriteKeys:i,libraries:n,regions:c}=e;this.favoriteModel=new D(t,i),this.libraryModel=new x(n),this.regionModel=new R(c)}loadStorage(){let e=localStorage.getItem($);return e?JSON.parse(e):null}setStorage(e){try{localStorage.setItem($,JSON.stringify(e))}catch(t){console.error(t)}}get state(){return this.loadStorage()}set state(e){this.setStorage(e);let{favorites:t,sortedFavoriteKeys:i,libraries:n,regions:c}=e;this.favoriteModel.favorites=t,this.favoriteModel.sortedKeys=i,this.libraryModel.libraries=n,this.regionModel.regions=c,this.bookStateUpdatePublisher.notify(),console.log("set state")}get favorites(){return this.favoriteModel.favorites}get sortedFavoriteKeys(){return this.favoriteModel.sortedKeys}get libraries(){return this.libraryModel.libraries}get regions(){return this.regionModel.regions}resetState(){this.state=re}setFavorites(){let e=this.state;e.favorites=this.favorites,e.sortedFavoriteKeys=this.sortedFavoriteKeys,this.setStorage(e)}addfavorite(e){this.favoriteModel.add(e),this.favoriteModel.addSortedKeys(e),this.setFavorites()}renameFavorite(e,t){this.favoriteModel.rename(e,t),this.setFavorites()}renameSortedFavoriteKey(e,t){this.favoriteModel.renameSortedKeys(e,t),this.setFavorites()}deleteFavorite(e){this.favoriteModel.delete(e),this.setFavorites()}deleteSortedFavoriteKey(e){let t=this.favoriteModel.deleteSortedKeys(e);return this.setFavorites(),t}hasFavorite(e){return this.favoriteModel.has(e)}changeFavorite(e,t){this.favoriteModel.change(e,t),this.setFavorites()}addFavoriteBook(e,t){this.favoriteModel.addBook(e,t),this.setFavorites()}hasFavoriteBook(e,t){return this.favoriteModel.hasBook(e,t)}removeFavoriteBook(e,t){this.favoriteModel.removeBook(e,t),this.setFavorites()}setLibraries(){let e=this.state;e.libraries=this.libraries,this.setStorage(e)}addLibraries(e,t){this.libraryModel.add(e,t),this.setLibraries()}removeLibraries(e){this.libraryModel.remove(e),this.setLibraries()}hasLibrary(e){return this.libraryModel.has(e)}setRegions(){let e=this.state;e.regions=this.regions,this.setStorage(e)}addRegion(e){this.regionModel.add(e),this.setRegions()}removeRegion(e){this.regionModel.remove(e),this.setRegions()}addDetailRegion(e,t,i){this.regionModel.addDetail(e,t,i),this.setRegions()}removeDetailRegion(e,t){this.regionModel.removeDetail(e,t),this.setRegions()}subscribeToBookStateUpdate(e){this.bookStateUpdatePublisher.subscribe(e)}unsubscribeToBookStateUpdate(e){this.bookStateUpdatePublisher.unsubscribe(e)}subscribeFavoriteCategoriesUpdate(e){this.favoriteModel.subscribeCategoriesUpdate(e)}unsubscribeFavoriteCategoriesUpdate(e){this.favoriteModel.unsubscribeCategoriesUpdate(e)}subscribeFavoriteBookUpdate(e){this.favoriteModel.subscribeBookUpdate(e)}unsubscribeFavoriteBookUpdate(e){this.favoriteModel.unsubscribeBookUpdate(e)}subscribeLibraryUpdate(e){this.libraryModel.subscribeUpdate(e)}unsubscribeLibraryUpdate(e){this.libraryModel.unsubscribeUpdate(e)}subscribeRegionUpdate(e){this.regionModel.subscribeUpdatePublisher(e)}unsubscribeRegionUpdate(e){this.regionModel.unsubscribeUpdatePublisher(e)}subscribeDetailRegionUpdate(e){this.regionModel.subscribeDetailUpdatePublisher(e)}unsubscribeDetailRegionUpdate(e){this.regionModel.unsubscribeDetailUpdatePublisher(e)}},ue=new z,f=ue;var _=class extends HTMLElement{constructor(){super();this.createCategoryItem=t=>{if(!this.container)return;let i=document.createElement("label"),n=this.createCheckbox(t),c=document.createElement("span");return c.textContent=t,i.appendChild(n),i.appendChild(c),i};this.isbn=this.getISBN(),this.button=null,this.container=null,this.onClickCategory=this.onClickCategory.bind(this),this.handleCategoryUpdate=this.handleCategoryUpdate.bind(this)}connectedCallback(){var t;this.button=this.createButton(),this.container=this.createContainer(),this.render(),(t=this.button)==null||t.addEventListener("click",this.onClickCategory),f.subscribeFavoriteCategoriesUpdate(this.handleCategoryUpdate)}render(){!this.container||!this.button||(f.sortedFavoriteKeys.map(t=>this.createCategoryItem(t)).forEach(t=>{var i;return(i=this.container)==null?void 0:i.appendChild(t)}),this.appendChild(this.container),this.appendChild(this.button))}createButton(){let t=document.createElement("button");return t.className="category-button",t.textContent="Category",t}createContainer(){let t=document.createElement("div");return t.className="category",t.hidden=!0,t}onClickCategory(){let t=this.querySelector(".category");t.hidden=!t.hidden}getISBN(){let t=this.closest("[data-isbn]");return t&&t.dataset.isbn?t.dataset.isbn:null}createCheckbox(t){let i=this.isbn||"",n=document.createElement("input");return n.type="checkbox",f.hasFavoriteBook(t,i)&&(n.checked=!0),n.addEventListener("change",()=>this.onChange(n,t)),n}onChange(t,i){let n=this.isbn||"",c=f.hasFavoriteBook(i,n);c?f.removeFavoriteBook(i,n):f.addFavoriteBook(i,n),t.checked=!c}handleCategoryUpdate({type:t,payload:i}){let n={add:()=>this.handleAdd(i.name),rename:()=>this.reanmeCategory(i.newName),change:()=>this.changeCategory(i.targetIndex,i.draggedIndex),delete:()=>this.handleDelete(i.name)};n[t]?n[t]():console.error("no type")}handleAdd(t){var i;(i=this.container)==null||i.appendChild(this.createCategoryItem(t))}handleDelete(t){this.querySelectorAll("label span").forEach((i,n)=>{i.textContent===t&&this.querySelectorAll("label")[n].remove()})}changeCategory(t,i){var p,d;let n=this.querySelectorAll("label"),c=this.createCategoryItem((p=n[i].querySelector("span"))==null?void 0:p.textContent),a=this.createCategoryItem((d=n[t].querySelector("span"))==null?void 0:d.textContent);n[t].replaceWith(c),n[i].replaceWith(a)}reanmeCategory(t){let i=this.querySelectorAll("label")[f.sortedFavoriteKeys.indexOf(t)],n=this.createCategoryItem(t);i.replaceWith(n)}};var j=class{constructor(){this._bus=document.createElement("div")}add(e,t){this._bus.addEventListener(e,t)}remove(e,t){this._bus.removeEventListener(e,t)}dispatch(e,t={}){this._bus.dispatchEvent(new CustomEvent(e,{detail:t}))}},T=new j;var V=class{constructor(e={}){this.defaultOptions=S({method:"GET",headers:{"Content-Type":"application/json"}},e)}fetch(e,t){return H(this,null,function*(){let i=te(S(S({},this.defaultOptions),t),{timeout:5e3});try{let n=yield fetch(e,i);if(!n.ok)throw new Error(`Http error! status: ${n.status}, message: ${n.statusText}`);return yield n.json()}catch(n){throw console.error(`Error fetching data: ${n}`),new Error(`Error fetching data: ${n}`)}})}},N=new V;(function(){"use strict";if(typeof window!="object")return;if("IntersectionObserver"in window&&"IntersectionObserverEntry"in window&&"intersectionRatio"in window.IntersectionObserverEntry.prototype){"isIntersecting"in window.IntersectionObserverEntry.prototype||Object.defineProperty(window.IntersectionObserverEntry.prototype,"isIntersecting",{get:function(){return this.intersectionRatio>0}});return}function u(r){try{return r.defaultView&&r.defaultView.frameElement||null}catch(s){return null}}var e=function(r){for(var s=r,o=u(s);o;)s=o.ownerDocument,o=u(s);return s}(window.document),t=[],i=null,n=null;function c(r){this.time=r.time,this.target=r.target,this.rootBounds=K(r.rootBounds),this.boundingClientRect=K(r.boundingClientRect),this.intersectionRect=K(r.intersectionRect||L()),this.isIntersecting=!!r.intersectionRect;var s=this.boundingClientRect,o=s.width*s.height,l=this.intersectionRect,h=l.width*l.height;o?this.intersectionRatio=Number((h/o).toFixed(4)):this.intersectionRatio=this.isIntersecting?1:0}function a(r,s){var o=s||{};if(typeof r!="function")throw new Error("callback must be a function");if(o.root&&o.root.nodeType!=1&&o.root.nodeType!=9)throw new Error("root must be a Document or Element");this._checkForIntersections=d(this._checkForIntersections.bind(this),this.THROTTLE_TIMEOUT),this._callback=r,this._observationTargets=[],this._queuedEntries=[],this._rootMarginValues=this._parseRootMargin(o.rootMargin),this.thresholds=this._initThresholds(o.threshold),this.root=o.root||null,this.rootMargin=this._rootMarginValues.map(function(l){return l.value+l.unit}).join(" "),this._monitoringDocuments=[],this._monitoringUnsubscribes=[]}a.prototype.THROTTLE_TIMEOUT=100,a.prototype.POLL_INTERVAL=null,a.prototype.USE_MUTATION_OBSERVER=!0,a._setupCrossOriginUpdater=function(){return i||(i=function(r,s){!r||!s?n=L():n=W(r,s),t.forEach(function(o){o._checkForIntersections()})}),i},a._resetCrossOriginUpdater=function(){i=null,n=null},a.prototype.observe=function(r){var s=this._observationTargets.some(function(o){return o.element==r});if(!s){if(!(r&&r.nodeType==1))throw new Error("target must be an Element");this._registerInstance(),this._observationTargets.push({element:r,entry:null}),this._monitorIntersections(r.ownerDocument),this._checkForIntersections()}},a.prototype.unobserve=function(r){this._observationTargets=this._observationTargets.filter(function(s){return s.element!=r}),this._unmonitorIntersections(r.ownerDocument),this._observationTargets.length==0&&this._unregisterInstance()},a.prototype.disconnect=function(){this._observationTargets=[],this._unmonitorAllIntersections(),this._unregisterInstance()},a.prototype.takeRecords=function(){var r=this._queuedEntries.slice();return this._queuedEntries=[],r},a.prototype._initThresholds=function(r){var s=r||[0];return Array.isArray(s)||(s=[s]),s.sort().filter(function(o,l,h){if(typeof o!="number"||isNaN(o)||o<0||o>1)throw new Error("threshold must be a number between 0 and 1 inclusively");return o!==h[l-1]})},a.prototype._parseRootMargin=function(r){var s=r||"0px",o=s.split(/\s+/).map(function(l){var h=/^(-?\d*\.?\d+)(px|%)$/.exec(l);if(!h)throw new Error("rootMargin must be specified in pixels or percent");return{value:parseFloat(h[1]),unit:h[2]}});return o[1]=o[1]||o[0],o[2]=o[2]||o[0],o[3]=o[3]||o[1],o},a.prototype._monitorIntersections=function(r){var s=r.defaultView;if(s&&this._monitoringDocuments.indexOf(r)==-1){var o=this._checkForIntersections,l=null,h=null;this.POLL_INTERVAL?l=s.setInterval(o,this.POLL_INTERVAL):(v(s,"resize",o,!0),v(r,"scroll",o,!0),this.USE_MUTATION_OBSERVER&&"MutationObserver"in s&&(h=new s.MutationObserver(o),h.observe(r,{attributes:!0,childList:!0,characterData:!0,subtree:!0}))),this._monitoringDocuments.push(r),this._monitoringUnsubscribes.push(function(){var g=r.defaultView;g&&(l&&g.clearInterval(l),C(g,"resize",o,!0)),C(r,"scroll",o,!0),h&&h.disconnect()});var m=this.root&&(this.root.ownerDocument||this.root)||e;if(r!=m){var b=u(r);b&&this._monitorIntersections(b.ownerDocument)}}},a.prototype._unmonitorIntersections=function(r){var s=this._monitoringDocuments.indexOf(r);if(s!=-1){var o=this.root&&(this.root.ownerDocument||this.root)||e,l=this._observationTargets.some(function(b){var g=b.element.ownerDocument;if(g==r)return!0;for(;g&&g!=o;){var E=u(g);if(g=E&&E.ownerDocument,g==r)return!0}return!1});if(!l){var h=this._monitoringUnsubscribes[s];if(this._monitoringDocuments.splice(s,1),this._monitoringUnsubscribes.splice(s,1),h(),r!=o){var m=u(r);m&&this._unmonitorIntersections(m.ownerDocument)}}}},a.prototype._unmonitorAllIntersections=function(){var r=this._monitoringUnsubscribes.slice(0);this._monitoringDocuments.length=0,this._monitoringUnsubscribes.length=0;for(var s=0;s<r.length;s++)r[s]()},a.prototype._checkForIntersections=function(){if(!(!this.root&&i&&!n)){var r=this._rootIsInDom(),s=r?this._getRootRect():L();this._observationTargets.forEach(function(o){var l=o.element,h=k(l),m=this._rootContainsTarget(l),b=o.entry,g=r&&m&&this._computeTargetAndRootIntersection(l,h,s),E=null;this._rootContainsTarget(l)?(!i||this.root)&&(E=s):E=L();var M=o.entry=new c({time:p(),target:l,boundingClientRect:h,rootBounds:E,intersectionRect:g});b?r&&m?this._hasCrossedThreshold(b,M)&&this._queuedEntries.push(M):b&&b.isIntersecting&&this._queuedEntries.push(M):this._queuedEntries.push(M)},this),this._queuedEntries.length&&this._callback(this.takeRecords(),this)}},a.prototype._computeTargetAndRootIntersection=function(r,s,o){if(window.getComputedStyle(r).display!="none"){for(var l=s,h=q(r),m=!1;!m&&h;){var b=null,g=h.nodeType==1?window.getComputedStyle(h):{};if(g.display=="none")return null;if(h==this.root||h.nodeType==9)if(m=!0,h==this.root||h==e)i&&!this.root?!n||n.width==0&&n.height==0?(h=null,b=null,l=null):b=n:b=o;else{var E=q(h),M=E&&k(E),J=E&&this._computeTargetAndRootIntersection(E,M,o);M&&J?(h=E,b=W(M,J)):(h=null,l=null)}else{var Q=h.ownerDocument;h!=Q.body&&h!=Q.documentElement&&g.overflow!="visible"&&(b=k(h))}if(b&&(l=P(b,l)),!l)break;h=h&&q(h)}return l}},a.prototype._getRootRect=function(){var r;if(this.root&&!G(this.root))r=k(this.root);else{var s=G(this.root)?this.root:e,o=s.documentElement,l=s.body;r={top:0,left:0,right:o.clientWidth||l.clientWidth,width:o.clientWidth||l.clientWidth,bottom:o.clientHeight||l.clientHeight,height:o.clientHeight||l.clientHeight}}return this._expandRectByRootMargin(r)},a.prototype._expandRectByRootMargin=function(r){var s=this._rootMarginValues.map(function(l,h){return l.unit=="px"?l.value:l.value*(h%2?r.width:r.height)/100}),o={top:r.top-s[0],right:r.right+s[1],bottom:r.bottom+s[2],left:r.left-s[3]};return o.width=o.right-o.left,o.height=o.bottom-o.top,o},a.prototype._hasCrossedThreshold=function(r,s){var o=r&&r.isIntersecting?r.intersectionRatio||0:-1,l=s.isIntersecting?s.intersectionRatio||0:-1;if(o!==l)for(var h=0;h<this.thresholds.length;h++){var m=this.thresholds[h];if(m==o||m==l||m<o!=m<l)return!0}},a.prototype._rootIsInDom=function(){return!this.root||Y(e,this.root)},a.prototype._rootContainsTarget=function(r){var s=this.root&&(this.root.ownerDocument||this.root)||e;return Y(s,r)&&(!this.root||s==r.ownerDocument)},a.prototype._registerInstance=function(){t.indexOf(this)<0&&t.push(this)},a.prototype._unregisterInstance=function(){var r=t.indexOf(this);r!=-1&&t.splice(r,1)};function p(){return window.performance&&performance.now&&performance.now()}function d(r,s){var o=null;return function(){o||(o=setTimeout(function(){r(),o=null},s))}}function v(r,s,o,l){typeof r.addEventListener=="function"?r.addEventListener(s,o,l||!1):typeof r.attachEvent=="function"&&r.attachEvent("on"+s,o)}function C(r,s,o,l){typeof r.removeEventListener=="function"?r.removeEventListener(s,o,l||!1):typeof r.detachEvent=="function"&&r.detachEvent("on"+s,o)}function P(r,s){var o=Math.max(r.top,s.top),l=Math.min(r.bottom,s.bottom),h=Math.max(r.left,s.left),m=Math.min(r.right,s.right),b=m-h,g=l-o;return b>=0&&g>=0&&{top:o,bottom:l,left:h,right:m,width:b,height:g}||null}function k(r){var s;try{s=r.getBoundingClientRect()}catch(o){}return s?(s.width&&s.height||(s={top:s.top,right:s.right,bottom:s.bottom,left:s.left,width:s.right-s.left,height:s.bottom-s.top}),s):L()}function L(){return{top:0,bottom:0,left:0,right:0,width:0,height:0}}function K(r){return!r||"x"in r?r:{top:r.top,y:r.top,bottom:r.bottom,left:r.left,x:r.left,right:r.right,width:r.width,height:r.height}}function W(r,s){var o=s.top-r.top,l=s.left-r.left;return{top:o,left:l,height:s.height,width:s.width,bottom:o+s.height,right:l+s.width}}function Y(r,s){for(var o=s;o;){if(o==r)return!0;o=q(o)}return!1}function q(r){var s=r.parentNode;return r.nodeType==9&&r!=e?u(r):(s&&s.assignedSlot&&(s=s.assignedSlot.parentNode),s&&s.nodeType==11&&s.host?s.host:s)}function G(r){return r&&r.nodeType===9}window.IntersectionObserver=a,window.IntersectionObserverEntry=c})();var w=class extends HTMLElement{constructor(){super();this.sizeElement=null;this.PATHS=["/search","/favorite","/popular","/library","/setting"],this.sizeElement=null,this.renderBookSize=this.renderBookSize.bind(this)}connectedCallback(){this.render(),this.setSelectedMenu(),this.sizeElement=this.querySelector(".size"),f.subscribeFavoriteBookUpdate(this.renderBookSize),f.subscribeToBookStateUpdate(this.renderBookSize)}disconnectedCallback(){f.unsubscribeFavoriteBookUpdate(this.renderBookSize),f.unsubscribeFavoriteBookUpdate(this.renderBookSize)}get bookSize(){return Object.values(f.favorites).reduce((t,i)=>t+i.length,0)}render(){this.innerHTML=`
            <nav class="gnb">
                <a class="gnb-item" href=".${this.PATHS[0]}">\uCC45 \uAC80\uC0C9</a>
                <a class="gnb-item" href=".${this.PATHS[1]}">\uB098\uC758 \uCC45 (<span class="size">${this.bookSize}</span>)</a>
                <a class="gnb-item" href=".${this.PATHS[2]}">\uC778\uAE30\uB300\uCD9C\uB3C4\uC11C</a>
                <a class="gnb-item" href=".${this.PATHS[3]}">\uB3C4\uC11C\uAD00 \uC870\uD68C</a>
                <a class="gnb-item" href=".${this.PATHS[4]}">\uC124\uC815</a>
            </nav>`}setSelectedMenu(){let t=this.PATHS.indexOf(document.location.pathname);t>=0&&(this.querySelectorAll("a")[t].ariaSelected="true")}renderBookSize(){this.sizeElement&&(this.sizeElement.textContent=this.bookSize.toString())}};var F=class extends HTMLElement{constructor(){super()}show(){this.removeAttribute("hidden")}hide(){this.setAttribute("hidden","")}};customElements.define("loading-component",F);function U(){let u=new Date,e=u.getFullYear(),t=String(u.getMonth()+1).padStart(2,"0"),i=String(u.getDate()).padStart(2,"0");return{currentDate:u,currentYear:e,currentMonth:t,currentDay:i}}function se(u){let e=u.content.firstElementChild;if(!e)throw new Error("Template content is empty");return e.cloneNode(!0)}var B=class extends HTMLElement{constructor(){super();this.itemTemplate=document.querySelector("#tp-popular-item"),this.list=this.querySelector(".popular-list"),this.loadingComponent=this.querySelector("loading-component"),this.onRequestPopular=this.onRequestPopular.bind(this),this.onClickPageNav=this.onClickPageNav.bind(this),this.params=null}connectedCallback(){this.params=this.getParams(),this.fetch(this.params),T.add("requestPopular",this.onRequestPopular),T.add("clickPageNav",this.onClickPageNav)}disconnectedCallback(){T.remove("requestPopular",this.onRequestPopular),T.remove("clickPageNav",this.onClickPageNav)}getParams(){let{currentYear:t,currentMonth:i,currentDay:n}=U();return{startDt:"2023-01-01",endDt:`${t}-${i}-${n}`,gender:"",age:"",region:"",addCode:"",kdc:"",pageNo:"1",pageSize:"100"}}fetch(t){return H(this,null,function*(){var n,c;(n=this.loadingComponent)==null||n.show(),this.list.innerHTML="";let i=new URLSearchParams(Object.entries(t).filter(([,a])=>a!==void 0).map(([a,p])=>[a,String(p)]));try{let a=yield N.fetch(`/popular-book?${i}`);this.render(a),t.pageNo==="1"&&T.dispatch("renderPageNav",{pageSize:t.pageSize})}catch(a){throw console.error(a),new Error("Fail to get library search by book.")}(c=this.loadingComponent)==null||c.hide()})}render({data:t,resultNum:i}){if(!this.list)return;console.log(i);let n=new DocumentFragment;t.map(c=>this.createItem(c)).forEach(c=>c&&n.appendChild(c)),this.list.appendChild(n)}createItem(t){let C=t,{bookImageURL:i,bookDtlUrl:n}=C,c=ie(C,["bookImageURL","bookDtlUrl"]);if(!this.itemTemplate)return;let a=se(this.itemTemplate);a.dataset.isbn=t.isbn13;let p=a.querySelector(".link");p.insertBefore(new I(i,t.bookname),p.querySelector(".ranking"));let d=a.querySelector(".bookDtlUrl");d&&(d.href=n),Object.entries(c).forEach(([P,k])=>{let L=a.querySelector(`.${P}`);L&&(L.textContent=k)});let v=a.querySelector("a");return v&&(v.href=`/book?isbn=${t.isbn13}`),a}onRequestPopular(t){this.params=t.detail.params,this.fetch(this.params)}onClickPageNav(t){this.params&&(this.params.pageNo=t.detail.pageIndex.toString(),this.fetch(this.params))}};var A=class extends HTMLElement{constructor(){super();this.closeForm=()=>{this.form.hidden=!0};this.onRenderPageNav=t=>{this.pageSize=t.detail.pageSize,this.pageNav.innerHTML="";let i=new DocumentFragment,n=3;for(let c=0;c<n;c++){let a=this.createNavItem(c);i.appendChild(a)}this.pageNav.appendChild(i),this.pageNav.hidden=!1,this.insertBefore(this.pageNav,this.filterButton)};this.onClickPageNav=t=>{let i=t.target;if(!i||!this.pageNav)return;let n=this.pageNav.querySelector("[aria-selected=true]");if(n&&(n.ariaSelected="false"),i.ariaSelected="true",this.pageNav.lastChild===i){let c=this.createNavItem(Number(i.value)+1);this.pageNav.appendChild(c)}T.dispatch("clickPageNav",{pageIndex:Number(i.value)+1})};this.onClickFilterButton=()=>{this.form.hidden=!this.form.hidden};this.onChangeForm=t=>{let i=t.target,n={addCode:()=>this.handleAddCode(i),age:()=>this.handleAge(i),dataSource:()=>this.handleDataSource(i),detailKdc:()=>this.handleDetailSubject(i),detailRegion:()=>this.handleDetailRegion(i),gender:()=>this.handleGender(i),loanDuration:()=>this.handleLoanDuration(t),kdc:()=>this.handleSubject(i),region:()=>this.handleRegion(i)};i.name&&n[i.name]()};this.onReset=()=>{setTimeout(()=>{this.initialLoanDuration()},100)};this.onSumbit=t=>{t.preventDefault();let i=new FormData(this.form),n={},c=["dataSource","loanDuration","subKdc","subRegion"];n.pageNo="1";for(let[a,p]of i.entries()){if(c.includes(a)||typeof p!="string")continue;let d=a;p==="A"?n[d]="":n[d]?n[d]+=`;${p}`:n[d]=p}T.dispatch("requestPopular",{params:n}),this.closeForm()};this.form=this.querySelector("form"),this.filterButton=this.querySelector(".filterButton"),this.closeButton=this.querySelector(".closeButton"),this.startDateInput=this.querySelector("input[name='startDt']"),this.endDateInput=this.querySelector("input[name='endDt']"),this.detailRegion=this.querySelector("[name='detailRegion']"),this.subRegion=this.querySelector(".subRegion"),this.detailSubject=this.querySelector("[name='detailKdc']"),this.subSubject=this.querySelector(".subSubject"),this.pageNav=this.querySelector(".page-nav"),this.pageSize=null,this.onRenderPageNav=this.onRenderPageNav.bind(this),this.onClickPageNav=this.onClickPageNav.bind(this)}connectedCallback(){this.initialLoanDuration(),this.filterButton.addEventListener("click",this.onClickFilterButton),this.closeButton.addEventListener("click",this.closeForm),this.form.addEventListener("change",this.onChangeForm),this.form.addEventListener("reset",this.onReset),this.form.addEventListener("submit",this.onSumbit),T.add("renderPageNav",this.onRenderPageNav)}disconnectedCallback(){this.form&&(this.filterButton.removeEventListener("click",this.onClickFilterButton),this.form.removeEventListener("change",this.onChangeForm),this.form.removeEventListener("reset",this.onReset),this.form.removeEventListener("submit",this.onSumbit),T.remove("renderPageNav",this.onRenderPageNav))}createNavItem(t){if(!this.pageSize)return;let i=document.createElement("button");return i.type="button",i.value=t.toString(),i.textContent=`${this.pageSize*t+1} ~ ${this.pageSize*(t+1)}`,t===0&&(i.ariaSelected="true"),i.addEventListener("click",this.onClickPageNav),i}handleDataSource(t){console.log(t.value)}handleGender(t){if(t.value!=="A"){let i=this.querySelector("input[name='gender'][value='A']");i.checked=!1}t.value==="A"&&this.querySelectorAll("input[type='checkbox'][name='gender']").forEach(n=>n.checked=!1)}handleAge(t){if(t.value!=="A"){let i=this.querySelector("input[name='age'][value='A']");i.checked=!1}t.value==="A"&&this.querySelectorAll("input[type='checkbox'][name='age']").forEach(n=>n.checked=!1)}handleRegion(t){let i=this.querySelector("input[name='region'][value='A']"),n=this.querySelectorAll("input[type='checkbox'][name='region']");t.value!=="A"&&(i.checked=!1),t.value==="A"&&n.forEach(a=>a.checked=!1);let c=Array.from(this.querySelectorAll('[name="region"]:checked')).filter(a=>a.value!=="A");if(this.detailRegion&&this.subRegion){let a=c.length===1;this.detailRegion.disabled=!a,this.detailRegion.checked&&(this.subRegion.hidden=!a)}}handleDetailRegion(t){this.subRegion.hidden=!t.checked}handleAddCode(t){if(t.value!=="A"){let i=this.querySelector("input[name='addCode'][value='A']");i.checked=!1}t.value==="A"&&this.querySelectorAll("input[type='checkbox'][name='addCode']").forEach(n=>n.checked=!1)}handleSubject(t){let i=this.querySelector("input[name='kdc'][value='A']"),n=this.querySelectorAll("input[type='checkbox'][name='kdc']");t.value!=="A"&&(i.checked=!1),t.value==="A"&&n.forEach(a=>a.checked=!1);let c=Array.from(this.querySelectorAll('[name="kdc"]:checked')).filter(a=>a.value!=="A");if(this.detailSubject&&this.subSubject){let a=c.length===1;this.detailSubject.disabled=!a,this.detailSubject.checked&&(this.subSubject.hidden=!a)}}handleDetailSubject(t){this.subSubject&&(this.subSubject.hidden=!t.checked)}handleLoanDuration(t){var d;let{currentDate:i,currentYear:n,currentMonth:c,currentDay:a}=U(),p=t==null?void 0:t.target;switch(p==null?void 0:p.value){case"year":this.initialLoanDuration();break;case"month":{this.startDateInput.value=`${n}-${c}-01`,this.endDateInput.value=`${n}-${c}-${a}`;break}case"week":{let v=new Date(i);v.setDate(i.getDate()-i.getDay());let C=v.getFullYear(),P=String(v.getMonth()+1).padStart(2,"0"),k=String(v.getDate()).padStart(2,"0");this.startDateInput.value=`${C}-${P}-${k}`,this.endDateInput.value=`${n}-${c}-${a}`;break}case"custom":break}(d=this.querySelector(".dateRange"))==null||d.addEventListener("click",()=>{let v=this.querySelector("input[name='loanDuration'][value='custom']");v.checked=!0})}initialLoanDuration(){let{currentDate:t,currentMonth:i,currentDay:n}=U();this.startDateInput.value=`${t.getFullYear()}-01-01`,this.endDateInput.value=`${t.getFullYear()}-${i}-${n}`}};customElements.define("book-image",I);customElements.define("nav-gnb",w);customElements.define("app-popular",B);customElements.define("popular-search",A);customElements.define("category-selector",_);})();
