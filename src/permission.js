import router from ".";
import { message } from "ant-design-vue";
import {useUserStore} from "@/store/user"
import { Local } from "@/utils/local";

const whiteList = ['/login','/register']

router.beforeEach((to,from,next)=>{
    var token = useUserStore().user.token;
    if(token !== null && token !== ''){
        if(to.path === '/login'){  //如果即将要进入的界面是login
            next('/home')   //中断
        }
        else{
            next()
        }
    }else{
        if(whiteList.includes(to.path)){ //如果要进入的是登录和注册界面，则放行
            next();
        }else{             //如果想要进入的页面不是登录和注册界面
            let user = Local.get('user');  //取出用户对象
            if(user !== null){    //如果用户名不为空
                useUserStore().setUser(user);  //设置用户名
                next();         //允许跳转
            }
            else{        //否则，阻止跳转
                message.error("您未登录！");  //否则显示错误星系，不允许登录
                next('/login'); //中断
                
            }
        }
    }
})