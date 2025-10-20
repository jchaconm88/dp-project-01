import { Component } from '@angular/core';
import { NbLayoutModule, NbSidebarModule } from '@nebular/theme';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
    selector: 'default-layout',
    imports: [
        NbLayoutModule,
        NbSidebarModule,
        HeaderComponent
    ],
    templateUrl: './default.layout.html',
    styleUrl: './default.layout.scss'
})
export class DefaultLayoutComponent { }