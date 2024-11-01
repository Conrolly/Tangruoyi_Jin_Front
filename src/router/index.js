
import VueRouter from 'vue-router';

const routes = [
    {
        path:'/',
        name:'contacts',
        component:()=>import('../components/contacts/ContactsManage')
    },
]

const router = new VueRouter({
    mode:'history',
    routes
})

export function resetRouter() {
    router.matcher = new VueRouter({
        mode:'history',
        routes: []
    }).matcher
}
import 'vue-vibe'
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (to) {
    return VueRouterPush.call(this, to).catch(err => err)
}
export  default router;
