import { ToastModule } from 'primeng/toast'
import { CallModule } from './shared/components/widgets/toasts/call/call.module'
import { AuthModule } from '@layouts/auth/auth.module'
import { NgModule, isDevMode } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { CookieService } from 'ngx-cookie-service'
import { DefaultModule } from './layouts/default/default.module'
import { ProgressBarModule } from 'primeng/progressbar'
import { CDK_DRAG_CONFIG } from '@angular/cdk/drag-drop'
import { ServiceWorkerModule } from '@angular/service-worker'
import { SettingsModule } from '@layouts/settings/settings.module'
import {
    MissingTranslationHandler,
    MissingTranslationHandlerParams,
    TranslateLoader,
    TranslateModule
} from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { MessageService } from 'primeng/api'
import {
    GoogleLoginProvider,
    SocialAuthServiceConfig,
    SocialLoginModule
} from '@abacritt/angularx-social-login'
import { GOOGLE_CLIENT_ID } from './shared/constants/system.constants'

const DragConfig = {
    zIndex: 9000
}

export function HttpLoaderFactory(httpClient: HttpClient) {
    return new TranslateHttpLoader(httpClient)
}

export class MissingTranslationService implements MissingTranslationHandler {
    handle(params: MissingTranslationHandlerParams) {
        console.warn(
            `WARN: '${params.key}' is missing in '${params.translateService.currentLang}' locale`
        )
        return params.key
    }
}

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        AuthModule,
        HttpClientModule,
        DefaultModule,
        ProgressBarModule,
        SettingsModule,
        CallModule,
        ToastModule,
        SocialLoginModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
        }),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            },
            missingTranslationHandler: {
                provide: MissingTranslationHandler,
                useClass: MissingTranslationService
            },
            defaultLanguage: 'uk'
        })
    ],
    providers: [
        CookieService,
        MessageService,
        Document,
        { provide: CDK_DRAG_CONFIG, useValue: DragConfig },
        {
            provide: 'SocialAuthServiceConfig',
            useValue: {
                autoLogin: false,
                providers: [
                    {
                        id: GoogleLoginProvider.PROVIDER_ID,
                        provider: new GoogleLoginProvider(GOOGLE_CLIENT_ID)
                    }
                ],
                onError: (error: Error) => {
                    console.error(error)
                }
            } as SocialAuthServiceConfig
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
