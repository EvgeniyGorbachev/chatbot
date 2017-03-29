import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule }   from '@angular/router';

import { AppComponent } from './app.component';
import { OrderComponent } from './order/order.component';
import { MainComponent } from './main/main.component';
import { ShippingComponent } from './shipping/shipping.component';
import { PaymentComponent } from './payment/payment.component';
import { ReviewComponent } from './review/review.component';

@NgModule({
  declarations: [
    AppComponent,
    OrderComponent,
    MainComponent,
    ShippingComponent,
    PaymentComponent,
    ReviewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot([
      {
        path: '',
        redirectTo: 'main',
        pathMatch: 'full'
      },
      {
        path: 'main',
        component: MainComponent
      },
      {
        path: 'order',
        component: OrderComponent
      },
      {
        path: 'shipping',
        component: ShippingComponent
      },
      {
        path: 'payment',
        component: PaymentComponent
      },
      {
        path: 'review',
        component: ReviewComponent
      }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
