if(!self.define){let s,e={};const i=(i,l)=>(i=new URL(i+".js",l).href,e[i]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=i,s.onload=e,document.head.appendChild(s)}else s=i,importScripts(i),e()})).then((()=>{let s=e[i];if(!s)throw new Error(`Module ${i} didn’t register its module`);return s})));self.define=(l,n)=>{const r=s||("document"in self?document.currentScript.src:"")||location.href;if(e[r])return;let o={};const u=s=>i(s,r),t={module:{uri:r},exports:o,require:u};e[r]=Promise.all(l.map((s=>t[s]||u(s)))).then((s=>(n(...s),o)))}}define(["./workbox-f5523f08"],(function(s){"use strict";self.skipWaiting(),s.clientsClaim(),s.precacheAndRoute([{url:"assets/AdminManageView-BC2TlcRo.js",revision:null},{url:"assets/albumInfo-DSd7e2JM.js",revision:null},{url:"assets/AlbumView-BAh--Ocq.css",revision:null},{url:"assets/AlbumView-Bwvi_XNa.js",revision:null},{url:"assets/alertConfirm-DR4yquSD.js",revision:null},{url:"assets/alertDeleteConfirm-QWwaTaNZ.js",revision:null},{url:"assets/CropperImag-B24_1HVn.css",revision:null},{url:"assets/CropperImag-Bxzm8Kin.js",revision:null},{url:"assets/FavSongListView-6FTcf8bR.js",revision:null},{url:"assets/HomeView-BQy2lVqF.css",revision:null},{url:"assets/HomeView-IVpYyJiI.js",revision:null},{url:"assets/images/hero.jpg",revision:null},{url:"assets/images/logo.ico",revision:null},{url:"assets/index-CkPH3_-0.css",revision:null},{url:"assets/index-DWPRnIHM.js",revision:null},{url:"assets/logo-BuyWDoCF.png",revision:null},{url:"assets/logo-BZCngxwS.js",revision:null},{url:"assets/logo-inverted-DTIppobh.png",revision:null},{url:"assets/logo2-BpBPWk9v.png",revision:null},{url:"assets/MakeAlbumView-B6ar38Cx.js",revision:null},{url:"assets/MakeAlbumView-BhUbpZIf.css",revision:null},{url:"assets/MemberManageView-B0tFYREj.js",revision:null},{url:"assets/workbox-window.prod.es5-Ck4lWPv4.js",revision:null},{url:"index.html",revision:"f729164bf826b3796cac1dd55359ed28"},{url:"pwa-192x192.png",revision:"e5490b3edbfe0fdf01757443e7f7c7c3"},{url:"pwa-192x192.png",revision:"e5490b3edbfe0fdf01757443e7f7c7c3"},{url:"manifest.webmanifest",revision:"52c34df593c86c167173c49f6e69ab97"}],{}),s.cleanupOutdatedCaches(),s.registerRoute(new s.NavigationRoute(s.createHandlerBoundToURL("index.html"))),s.registerRoute(/^https:\/\/i\.imgur\.com\/.*$/,new s.CacheFirst({cacheName:"imgur-images",plugins:[new s.ExpirationPlugin({maxEntries:30,maxAgeSeconds:86400}),new s.CacheableResponsePlugin({statuses:[0,200]})]}),"GET")}));