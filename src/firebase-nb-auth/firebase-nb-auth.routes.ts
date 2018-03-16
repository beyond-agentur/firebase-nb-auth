/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Routes } from '@angular/router';
import {
    NbAuthComponent, NbLogoutComponent, NbRegisterComponent, NbRequestPasswordComponent,
    NbResetPasswordComponent
} from '@nebular/auth';

import { FirebaseLoginComponent } from './components/firebase-login/firebase-login.component';

export const routes: Routes = [
    {
        path: 'auth',
        component: NbAuthComponent,
        children: [
            {
                path: '',
                component: FirebaseLoginComponent,
            },
            {
                path: 'login',
                component: FirebaseLoginComponent,
            },
            {
                path: 'register',
                component: NbRegisterComponent,
            },
            {
                path: 'logout',
                component: NbLogoutComponent,
            },
            {
                path: 'request-password',
                component: NbRequestPasswordComponent,
            },
            {
                path: 'validate-email',
                component: NbRequestPasswordComponent,
            },
            {
                path: 'reset-password',
                component: NbResetPasswordComponent,
            },
        ],
    },
];
