import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/Frontstage/HomeView.vue'
import AlbumViewVue from '@/views/Frontstage/AlbumView.vue'
import AdminManageViewVue from '@/views/Backstage/AdminManageView.vue'
import FavSongListViewVue from '@/views/Frontstage/FavSongListView.vue'
import MakeAlbumViewVue from '@/views/Frontstage/MakeAlbumView.vue'
import MemberManageViewVue from '@/views/Backstage/MemberManageView.vue'
import { useUserStore } from '@/stores/user'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      requireScreen: true
    }
  },
  {
    path: '/album/:gener/:albumSinger',
    name: 'album',
    component: AlbumViewVue
  },
  {
    path: '/favSongList',
    name: 'favSongList',
    component: FavSongListViewVue
  },
  {
    path: '/makeAlbum',
    name: 'makeAlbum',
    component: MakeAlbumViewVue
  },
  {
    name: "admin-backStage",
    path: '/admin',
    component: AdminManageViewVue,
    children: [
    ]
  },
  {
    name: "member-backStage",
    path: '/member/:uid',
    component: MemberManageViewVue,
    children: [
    ]
  },
  {
    path: '/:catchAll(.*)*',
    redirect: { path: '/' }
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: routes
})

router.beforeEach((to, form, next) => {
  const store = useUserStore()
  if (form.path !== '/' && !store.userLoggedIn) {
    to.meta.requireScreen = false
  }

  next()
})

export default router
