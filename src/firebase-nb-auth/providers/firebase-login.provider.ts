import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as firebase from 'firebase/app';
import { NbAbstractAuthProvider, NbAuthResult } from '@nebular/auth';
import { NgEmailPassAuthProviderConfig } from '@nebular/auth/providers/email-pass-auth.options';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import { observable } from 'rxjs/symbol/observable';

@Injectable()
export class FirebaseLoginProvider extends NbAbstractAuthProvider
{

    protected defaultConfig: NgEmailPassAuthProviderConfig = {
        login:       {
            redirect: {
                success: '/',
                failure: null,
            },
        },
        register:    {
            redirect: {
                success: '/verify-email',
                failure: null,
            },
        },
        requestPass: {
            redirect: {
                success: '/auth/login',
                failure: null,
            },
        },
        resetPass:   {
            redirect: {
                success: '/auth/login',
                failure: '/auth/reset-password',
            },
        },
        logout:      {
            redirect: {
                success: '/auth/login',
                failure: null,
            },
        },
    };

    constructor( private _firebaseAuth: AngularFireAuth )
    {
        super();
    }

    authenticate( data?: any ): Observable<NbAuthResult>
    {
        let observable = null;

        if ( data.facebook ) {
            observable = this._firebaseAuth.auth.signInWithPopup( new firebase.auth.FacebookAuthProvider() );
        } else if ( data.google ) {
            observable = this._firebaseAuth.auth.signInWithPopup( new firebase.auth.GoogleAuthProvider() );
        } else {
            const credential = firebase.auth.EmailAuthProvider.credential( data.email, data.password );
            observable = this._firebaseAuth.auth.signInWithCredential( credential )
        }

        return Observable.fromPromise( observable ).map( ( res: any ) => {
            return this.processSuccess( res, this.getConfigValue( 'login.redirect.success' ), [ res.message ] );
        } ).catch( ( res ) => {
            return Observable.of(
                this.processFailure( res, this.getConfigValue( 'login.redirect.failure' ), [ res.message ] ),
            );
        } );
    }

    register( data?: any ): Observable<NbAuthResult>
    {
        return Observable.fromPromise( this._firebaseAuth.auth.createUserWithEmailAndPassword( data.email, data.password ) ).map( res => res ).flatMap( ( res ) => {
            return Observable.fromPromise( this._firebaseAuth.auth.currentUser.sendEmailVerification() ).map( ( mail ) => {
                return res;
            } );
        } ).flatMap( ( res ) => {
            return Observable.fromPromise( this._firebaseAuth.auth.currentUser.updateProfile( {
                displayName: data.fullName,
                photoURL:    '',
            } ) ).map( ( update ) => {
                return this.processSuccess( res, this.getConfigValue( 'register.redirect.success' ) );
            } );
        } ).catch( ( res ) => {
            console.log( 'Error', res );

            return Observable.of(
                this.processFailure( res, this.getConfigValue( 'register.redirect.failure' ), [ res.message ] )
            );
        } );
    }

    requestPassword( data?: any ): Observable<NbAuthResult>
    {
        return Observable.fromPromise( this._firebaseAuth.auth.sendPasswordResetEmail( data.email ) ).map( ( res ) => {
            return this.processSuccess( res, this.getConfigValue( 'requestPass.redirect.success' ), [] );
        } ).catch( ( res ) => {
            return Observable.of( this.processFailure( res, this.getConfigValue( 'requestPass.redirect.failure' ),
                [ res.message ] ) );
        } );
    }

    resetPassword( data?: any ): Observable<NbAuthResult>
    {
        if ( this._firebaseAuth.auth.currentUser ) {
            return Observable.fromPromise( this._firebaseAuth.auth.currentUser.updatePassword( data.password ) ).map( ( res ) => {
                return this.processSuccess( res, this.getConfigValue( 'resetPass.redirect.success' ), [] );
            } ).catch( ( res ) => {
                return Observable.of( this.processFailure( res, this.getConfigValue( 'resetPass.redirect.failure' ),
                    [ res.message ] ) );
            } );
        }

        return Observable.of( this.processFailure( [], this.getConfigValue( 'resetPass.redirect.failure' ),
            [ 'Please, sign in to be able to reset your password' ] ) );
    }

    logout( data?: any ): Observable<NbAuthResult>
    {
        return Observable.fromPromise( this._firebaseAuth.auth.signOut() ).map( ( res ) => {
            return this.processSuccess( res, this.getConfigValue( 'logout.redirect.success' ), [] );
        } )
        .catch( ( res ) => {
            return Observable.of( this.processFailure( res, this.getConfigValue( 'logout.redirect.failure' ),
                [ res.message ] )
            );
        } );
    }

    private processSuccess( response?: any, redirect?: any, messages?: any ): NbAuthResult
    {
        return new NbAuthResult( true, response, redirect, [], messages );
    }

    private processFailure( response?: any, redirect?: any, errors?: any ): NbAuthResult
    {
        return new NbAuthResult( false, response, redirect, errors, [] );
    }
}
