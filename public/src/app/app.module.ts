import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

// Material Design Modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { SearchPageComponent } from './search-page/search-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchResultElementComponent } from './search-page/search-result-element/search-result-element.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SimpleAbComparisonComponent } from './ab-comparison/simple-ab-comparison/simple-ab-comparison.component';

const routes: Routes = [
  { path: 'ab/simple', component: SimpleAbComparisonComponent },
  { path: '', component: SearchPageComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    SearchPageComponent,
    SearchResultElementComponent,
    SimpleAbComparisonComponent,
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    MatToolbarModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
