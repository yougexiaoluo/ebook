(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["list"],{"0eb2":function(t,e,i){"use strict";i.r(e);var o=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"book-list-wrapper"},[i("detail-title",{ref:"title",attrs:{title:t.title,showShelf:!0},on:{back:t.back}}),i("scroll",{ref:"scroll",staticClass:"book-list-scroll-wrapper",attrs:{top:42},on:{onScroll:t.onScroll}},t._l(t.list,function(e,o,s){return i("featured",{key:s,attrs:{data:e,titleText:t.titleText?t.titleText:t.getCategoryText(o),btnText:""}})}),1)],1)},s=[],n=(i("456d"),i("ac6a"),i("a481"),i("1432")),r=i("6701"),a=i("cbe5"),c=i("fa7d"),l=i("73f5"),u=i("da6f"),f={components:{DetailTitle:n["a"],Scroll:r["a"],Featured:a["a"]},computed:{title:function(){return this.list?this.total&&this.$t("home.allBook").replace("$1",this.totalNumber):null},totalNumber:function(){var t=this,e=0;return Object.keys(this.list).forEach(function(i){e+=t.list[i].length}),e}},data:function(){return{list:null,total:null}},methods:{getCategoryText:function(t){return"".concat(Object(u["d"])(u["c"][t],this),"(").concat(this.list[t].length,")")},back:function(){this.$router.go(-1)},onScroll:function(t){t>Object(c["b"])(42)?this.$refs.title.showShadow():this.$refs.title.hideShadow()},getList:function(){var t=this;Object(l["e"])().then(function(e){t.list=e.data.data,t.total=e.data.total;var i=t.$route.query.category,o=t.$route.query.keyword;if(i){var s=Object.keys(t.list).filter(function(t){return t===i})[0],n=t.list[s];t.list={},t.list[s]=n}else o&&Object.keys(t.list).filter(function(e){return t.list[e]=t.list[e].filter(function(t){return t.fileName.indexOf(o)>=0}),t.list[e].length>0})})}},created:function(){this.getList(),this.titleText=this.$route.query.categoryText}},h=f,d=(i("e3de"),i("2877")),p=Object(d["a"])(h,o,s,!1,null,"5c9f6038",null);e["default"]=p.exports},1432:function(t,e,i){"use strict";var o=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"detail-title-wrapper",class:{"hide-shadow":t.ifHideShadow}},[i("div",{staticClass:"title-left-wrapper",on:{click:t.back}},[i("span",{staticClass:"icon-back"})]),i("div",{staticClass:"title-right-wrapper"},[t.showShelf?i("span",{staticClass:"icon-shelf icon",on:{click:t.showBookShelf}}):i("span",{staticClass:"icon-share"})]),t.title?i("div",{staticClass:"title-text"},[t._v("\n    "+t._s(t.title)+"\n  ")]):t._e()])},s=[],n={props:{title:String,showShelf:{type:Boolean,default:!0}},data:function(){return{ifHideShadow:!0}},methods:{showBookShelf:function(){this.$router.push("/store/shelf")},showShadow:function(){this.ifHideShadow=!1},hideShadow:function(){this.ifHideShadow=!0},back:function(){this.$emit("back")}}},r=n,a=(i("e7f0"),i("2877")),c=Object(a["a"])(r,o,s,!1,null,"35934eca",null);e["a"]=c.exports},"15ab":function(t,e,i){},"31dc":function(t,e,i){"use strict";var o=i("b0ef"),s=i.n(o);s.a},"3d05":function(t,e,i){"use strict";var o=i("f0ef"),s=i.n(o);s.a},6701:function(t,e,i){"use strict";var o=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{ref:"scrollWrapper",staticClass:"scroll-wrapper",class:{"no-scroll":t.ifNoScroll},on:{"&scroll":function(e){return t.handleScroll(e)}}},[t._t("default")],2)},s=[],n=(i("c5f6"),i("fa7d")),r={props:{top:{type:Number,default:0},bottom:{type:Number,default:0},ifNoScroll:{type:Boolean,default:!1},initPosition:{type:Object,default:function(){return{x:0,y:0}}}},methods:{handleScroll:function(t){var e=t.target.scrollTop||window.pageYOffset||document.body.scrollTop;this.$emit("onScroll",e)},scrollTo:function(t,e){this.$refs.scrollWrapper.scrollTo(t,e)},refresh:function(){this.$refs.scrollWrapper&&(this.$refs.scrollWrapper.style.height=window.innerHeight-Object(n["b"])(this.top)-Object(n["b"])(this.bottom)+"px",this.$refs.scrollWrapper.addEventListener("scroll",this.handleScroll))}},mounted:function(){var t=this;this.$nextTick(function(){t.refresh(),setTimeout(function(){t.scrollTo(Object(n["b"])(t.initPosition.x),Object(n["b"])(t.initPosition.y))},1)})}},a=r,c=(i("31dc"),i("2877")),l=Object(c["a"])(a,o,s,!1,null,"7d272252",null);e["a"]=l.exports},"8c8f":function(t,e,i){"use strict";var o=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"home-title-wrapper"},[i("div",{staticClass:"label"},[t._v(t._s(t.label))]),i("div",{staticClass:"btn",class:{touch:t.ifOnTouch},on:{touchstart:t.onTouchStart,touchend:t.onTouchEnd,mousedown:t.onTouchStart,mouseup:t.onTouchEnd,click:t.click}},[t._v("\n    "+t._s(t.btn)+"\n  ")])])},s=[],n={props:{label:String,btn:String},data:function(){return{ifOnTouch:!1}},methods:{onTouchStart:function(){this.ifOnTouch=!0},onTouchEnd:function(){this.ifOnTouch=!1},click:function(){this.$emit("onClick")}}},r=n,a=(i("3d05"),i("2877")),c=Object(a["a"])(r,o,s,!1,null,"77f8ee5f",null);e["a"]=c.exports},b0ef:function(t,e,i){},c247:function(t,e,i){},c4bf:function(t,e,i){"use strict";var o=i("c247"),s=i.n(o);s.a},c795:function(t,e,i){},cbe5:function(t,e,i){"use strict";var o=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"featured"},[t.titleVisible&&t.data&&t.data.length>0?i("title-view",{attrs:{label:t.titleText,btn:t.btnText},on:{onClick:t.showBookCategory}}):t._e(),i("div",{staticClass:"featured-list"},[i("div",{staticClass:"featured-item-wrapper"},t._l(t.data,function(e,o){return i("div",{key:o,staticClass:"featured-item",on:{click:function(i){return t.showBookDetail(e)}}},[i("div",{staticClass:"img-wrapper"},[i("img",{staticClass:"img",attrs:{src:e.cover}})]),i("div",{staticClass:"content-wrapper"},[i("div",{ref:"title",refInFor:!0,staticClass:"title title-small"},[t._v(t._s(e.title))]),i("div",{ref:"author",refInFor:!0,staticClass:"author sub-title-tiny"},[t._v(t._s(e.author))]),i("div",{ref:"category",refInFor:!0,staticClass:"category third-title-tiny"},[t._v(t._s(t.categoryText(e.category)))])])])}),0)])],1)},s=[],n=(i("ac6a"),i("8c8f")),r=i("fa7d"),a=i("02ae"),c=i("da6f"),l={mixins:[a["b"]],components:{TitleView:n["a"]},props:{data:Array,titleVisible:{type:Boolean,default:!0},titleText:{type:String},btnText:{type:String}},computed:{width:function(){return window.innerWidth-Object(r["b"])(20)-Object(r["b"])(60)+"px"}},methods:{resize:function(){var t=this;this.$nextTick(function(){t.$refs.title.forEach(function(e){e.style.width=t.width}),t.$refs.author.forEach(function(e){e.style.width=t.width}),t.$refs.category.forEach(function(e){e.style.width=t.width})})},showBookCategory:function(){this.$router.push({path:"/store/list",query:{category:Object(c["h"])(this.data.category),categoryText:this.categoryText(this.data.category)}})},categoryText:function(t){return Object(c["d"])(t,this)}}},u=l,f=(i("c4bf"),i("2877")),h=Object(f["a"])(u,o,s,!1,null,"542b9ba6",null);e["a"]=h.exports},e3de:function(t,e,i){"use strict";var o=i("c795"),s=i.n(o);s.a},e7f0:function(t,e,i){"use strict";var o=i("15ab"),s=i.n(o);s.a},f0ef:function(t,e,i){}}]);
//# sourceMappingURL=list.0ecffd34.js.map