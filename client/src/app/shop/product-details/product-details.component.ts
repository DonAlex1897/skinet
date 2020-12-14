import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from 'src/app/shared/models/product';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ShopService } from '../shop.service';
import {BasketService} from '../../basket/basket.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product!: IProduct;
  quantity = 1;
  _activateRoute: string | null;

  constructor(private shopService: ShopService, private activateRoute: ActivatedRoute, private bcService: BreadcrumbService,
              private basketService: BasketService) {
    this._activateRoute = this.activateRoute.snapshot.paramMap.get('id');
    this.bcService.set('@productName', ' ');
  }

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct(){
    this.shopService.getProduct(+(this._activateRoute ? this._activateRoute : '0')).subscribe(response => {
      this.product = response;
      this.quantity = this.basketService.getCurrentBasketValue().items.filter(x => x.id = response.id)[0].quantity;
      this.bcService.set('@productName', this.product.name);
    }, error => {
      console.log(error);
    })
  }

  addItemToBasket(){
    this.basketService.addItemToBasket(this.product, this.quantity);
    this.loadProduct();
  }

  incrementItemQuantity(){
    this.quantity++;
  }

  decrementItemQuantity(){
    if(this.quantity > 1)
      this.quantity--;
  }
}
