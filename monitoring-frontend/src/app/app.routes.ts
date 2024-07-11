import { Routes } from '@angular/router';
import { authloggeduserGuard } from '../guards/authloggeduser.guard';

export const routes: Routes = [
    {
        path: "login", 
        loadComponent: () => import("./login/login.component").then(x => x.LoginComponent)
    },
    {
        path: "register", 
        loadComponent: () => import("./register/register.component").then( x => x.RegisterComponent)
    },
    {
        path: "home", 
        canActivate: [authloggeduserGuard],
        loadComponent: () => import("./home/home.component").then( x => x.HomeComponent)
    },
    {
        path: "**",
        redirectTo: "login"
    }
];
