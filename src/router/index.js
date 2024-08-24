import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const HomeView = () => import("@/views/Frontstage/HomeView.vue")
const AlbumViewVue = () => import("@/views/Frontstage/AlbumView.vue")
const AdminManageViewVue = () => import("@/views/Backstage/AdminManageView.vue")
const FavSongListViewVue = () => import("@/views/Frontstage/FavSongListView.vue")
const MakeAlbumViewVue = () => import("@/views/Frontstage/MakeAlbumView.vue")
const MemberManageViewVue = () => import("@/views/Backstage/MemberManageView.vue")

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
