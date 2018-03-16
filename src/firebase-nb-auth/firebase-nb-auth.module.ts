import { Injector, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {
    defaultSettings, NB_AUTH_INTERCEPTOR_HEADER, NB_AUTH_OPTIONS, NB_AUTH_PROVIDERS,
    NB_AUTH_TOKEN_CLASS, NB_AUTH_USER_OPTIONS, NbAuthBlockComponent, NbAuthComponent,
    NbAuthOptions, NbAuthService, NbAuthSimpleToken, NbLogoutComponent, NbRegisterComponent,
    NbRequestPasswordComponent, NbResetPasswordComponent, NbTokenLocalStorage,
    NbTokenService, NbTokenStorage
} from '@nebular/auth';
import { deepExtend } from '@nebular/auth/helpers';

import { NbLayoutModule, NbCardModule, NbCheckboxModule } from '@nebular/theme';
import { FirebaseLoginComponent } from './components/firebase-login/firebase-login.component';


import { routes } from './firebase-nb-auth.routes';
import { FirebaseLoginProvider } from './providers/firebase-login.provider';

export function nbAuthServiceFactory( config: any, tokenService: NbTokenService, injector: Injector )
{
    const providers = config.providers || {};

    for ( const key in providers ) {
        if ( providers.hasOwnProperty( key ) ) {
            const provider = providers[ key ];
            const object = injector.get( provider.service );
            object.setConfig( provider.config || {} );
        }
    }

    return new NbAuthService( tokenService, injector, providers );
}

export function nbOptionsFactory( options )
{
    return deepExtend( defaultSettings, options );
}

@NgModule( {
    imports:      [
        CommonModule,
        NbLayoutModule,
        NbCardModule,
        NbCheckboxModule,
        RouterModule.forChild( routes ),
        FormsModule,
        HttpClientModule,
    ],
    declarations: [
        NbAuthComponent,
        NbAuthBlockComponent,
        FirebaseLoginComponent,
        NbRegisterComponent,
        NbRequestPasswordComponent,
        NbResetPasswordComponent,
        NbLogoutComponent,
    ],
    exports:      [
        NbAuthComponent,
        NbAuthBlockComponent,
        FirebaseLoginComponent,
        NbRegisterComponent,
        NbRequestPasswordComponent,
        NbResetPasswordComponent,
        NbLogoutComponent,
    ],
} )
export class FirebaseNbAuthModule
{
    static forRoot( nbAuthOptions?: NbAuthOptions ): ModuleWithProviders
    {
        return <ModuleWithProviders> {
            ngModule:  FirebaseNbAuthModule,
            providers: [
                { provide: NB_AUTH_USER_OPTIONS, useValue: nbAuthOptions },
                { provide: NB_AUTH_OPTIONS, useFactory: nbOptionsFactory, deps: [ NB_AUTH_USER_OPTIONS ] },
                { provide: NB_AUTH_PROVIDERS, useValue: {} },
                { provide: NB_AUTH_TOKEN_CLASS, useValue: NbAuthSimpleToken },
                { provide: NB_AUTH_INTERCEPTOR_HEADER, useValue: 'Authorization' },
                {
                    provide:    NbAuthService,
                    useFactory: nbAuthServiceFactory,
                    deps:       [ NB_AUTH_OPTIONS, NbTokenService, Injector ],
                },
                { provide: NbTokenStorage, useClass: NbTokenLocalStorage },
                NbTokenService,
                FirebaseLoginProvider,
            ],
        };
    }
}
