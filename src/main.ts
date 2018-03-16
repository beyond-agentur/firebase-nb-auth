import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from './environments/environment';
import { FirebaseNbAuthModule } from './firebase-nb-auth';

if ( environment.production ) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule( FirebaseNbAuthModule )
.catch( err => console.log( err ) );
