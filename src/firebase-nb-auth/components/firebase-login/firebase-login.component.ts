/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { faFacebookF, faGoogle } from '@fortawesome/fontawesome-free-brands';
import { NB_AUTH_OPTIONS, NbAuthResult, NbAuthService } from '@nebular/auth';
import { getDeepFromObject } from '@nebular/auth/helpers';

@Component( {
    selector:    'app-login',
    templateUrl: './firebase-login.component.html',
} )
export class FirebaseLoginComponent
{

    redirectDelay: number = 0;
    showMessages: any = {};
    provider: string = '';

    errors: string[] = [];
    messages: string[] = [];
    user: any = {};
    submitted: boolean = false;

    faFacebook = faFacebookF;
    faGoogle = faGoogle;

    constructor( protected service: NbAuthService,
                 @Inject( NB_AUTH_OPTIONS ) protected config = {},
                 protected router: Router )
    {
        this.redirectDelay = this.getConfigValue( 'forms.login.redirectDelay' );
        this.showMessages = this.getConfigValue( 'forms.login.showMessages' );
        this.provider = this.getConfigValue( 'forms.login.provider' );
    }

    login(): void
    {
        this.errors = this.messages = [];
        this.submitted = true;

        this.service.authenticate( this.provider, this.user ).subscribe( ( result: NbAuthResult ) => {
            this.submitted = false;

            if ( result.isSuccess() ) {
                this.messages = result.getMessages();
            } else {
                this.errors = result.getErrors();
            }

            const redirect = result.getRedirect();
            if ( redirect ) {
                setTimeout( () => {
                    return this.router.navigateByUrl( redirect );
                }, this.redirectDelay );
            }
        } );
    }


    loginWithFacebook(): void
    {
        this.errors = this.messages = [];
        this.submitted = true;

        this.service.authenticate( this.provider, { facebook: true } ).subscribe( ( result: NbAuthResult ) => {
            this.submitted = false;

            if ( result.isSuccess() ) {
                this.messages = result.getMessages();
            } else {
                this.errors = result.getErrors();
            }

            const redirect = result.getRedirect();
            if ( redirect ) {
                setTimeout( () => {
                    return this.router.navigateByUrl( redirect );
                }, this.redirectDelay );
            }
        } );
    }

    loginWithGoogle(): void
    {
        this.errors = this.messages = [];
        this.submitted = true;

        this.service.authenticate( this.provider, { google: true } ).subscribe( ( result: NbAuthResult ) => {
            this.submitted = false;

            if ( result.isSuccess() ) {
                this.messages = result.getMessages();
            } else {
                this.errors = result.getErrors();
            }

            const redirect = result.getRedirect();
            if ( redirect ) {
                setTimeout( () => {
                    return this.router.navigateByUrl( redirect );
                }, this.redirectDelay );
            }
        } );
    }

    loginWithTwitter(): void
    {
        this.errors = this.messages = [];
        this.submitted = true;

        this.service.authenticate( this.provider, { twitter: true } ).subscribe( ( result: NbAuthResult ) => {
            this.submitted = false;

            if ( result.isSuccess() ) {
                this.messages = result.getMessages();
            } else {
                this.errors = result.getErrors();
            }

            const redirect = result.getRedirect();
            if ( redirect ) {
                setTimeout( () => {
                    return this.router.navigateByUrl( redirect );
                }, this.redirectDelay );
            }
        } );
    }

    getConfigValue( key: string ): any
    {
        return getDeepFromObject( this.config, key, null );
    }
}
