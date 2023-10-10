import { SettingsComponent } from './layouts/settings/settings.component'
import { NgModule } from '@angular/core'
import { RouterModule, Routes, UrlMatchResult, UrlSegment } from '@angular/router'
import { DefaultComponent } from './layouts/default/default.component'
import { DefaultGuard } from './shared/guards/default/default.guard'

function collectionPageMatcher(segments: UrlSegment[]): UrlMatchResult {
    if (segments.length > 0 && segments[0].path === 'collection') {
        if (segments.length === 1) {
            return {
                consumed: segments,
                posParams: {}
            }
        }
        if (segments.length === 2) {
            return {
                consumed: segments,
                posParams: { id: segments[1] }
            }
        }

        return <UrlMatchResult>(null as any)
    }

    return <UrlMatchResult>(null as any)
}

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./layouts/auth/auth.module').then((m) => m.AuthModule)
    },
    {
        path: '',
        component: DefaultComponent,
        canActivate: [DefaultGuard],
        children: [
            {
                matcher: collectionPageMatcher,
                loadChildren: () =>
                    import('./modules/collection/collection.module').then((m) => m.CollectionModule)
            },
            {
                path: 'collection/:collectionId/:elementId',
                loadChildren: () =>
                    import('./modules/element-card/element-card.module').then(
                        (m) => m.ElementCardModule
                    )
            },
            {
                path: 'tasks',
                loadChildren: () =>
                    import('./modules/tasks/tasks.module').then((m) => m.TasksModule)
            },
            {
                path: 'files',
                loadChildren: () =>
                    import('./modules/files/files.module').then((m) => m.FilesModule)
            },
            {
                path: 'chats',
                loadChildren: () =>
                    import('./modules/chats/chats.module').then((m) => m.ChatsModule)
            },
            {
                path: 'deliveries',
                loadChildren: () =>
                    import('./modules/deliveries/deliveries.module').then((m) => m.DeliveriesModule)
            },
            {
                path: 'calls',
                loadChildren: () =>
                    import('./modules/calls/calls.module').then((m) => m.CallsModule)
            },
            {
                path: 'mail',
                loadChildren: () => import('./modules/mail/mail.module').then((m) => m.MailModule)
            },
            {
                path: 'analytics',
                loadChildren: () =>
                    import('./modules/analytics/analytics.module').then((m) => m.AnalyticsModule)
            }
        ]
    },
    {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [DefaultGuard],
        children: [
            {
                path: 'profile',
                loadChildren: () =>
                    import('./shared/components/settings/profile/profile.module').then(
                        (m) => m.ProfileModule
                    )
            },
            {
                path: 'users',
                loadChildren: () =>
                    import('./shared/components/settings/users/users.module').then(
                        (m) => m.UsersModule
                    )
            },
            {
                path: 'integrations',
                loadChildren: () =>
                    import('./shared/components/settings/integrations/integrations.module').then(
                        (m) => m.IntegrationsModule
                    )
            },
            {
                path: 'sites',
                loadChildren: () =>
                    import('./shared/components/settings/sites/sites.module').then(
                        (m) => m.SitesModule
                    )
            }
        ]
    }
]

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            onSameUrlNavigation: 'reload'
        })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
