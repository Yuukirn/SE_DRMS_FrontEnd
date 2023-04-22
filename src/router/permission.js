import router from ".";
import {useJWT} from "@/store/JWT"

const whiteList = ['/login','/register']
router.beforeEach((to,from,next)=>{
    var token = useJWT().token;
    if(token !== null && token !== ''){
        if(to.path === '/login'){
            next('/')
        }
        else{
            next()
        }
    }else{
        if(whiteList.includes(to.path)){
            next();
        }else{
            next('/login');
        }
    }
})