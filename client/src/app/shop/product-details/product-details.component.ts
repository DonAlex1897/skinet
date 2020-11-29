import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from 'src/app/shared/models/product';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ShopService } from '../shop.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product!: IProduct;
  _activateRoute: string | null;

  constructor(private shopService: ShopService, private activateRoute: ActivatedRoute, private bcService: BreadcrumbService) {
    this._activateRoute = this.activateRoute.snapshot.paramMap.get('id');
    this.bcService.set('@productName', ' ');
  }

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct(){
    this.shopService.getProduct(+(this._activateRoute ? this._activateRoute : '0')).subscribe(response => {
      this.product = response;
      this.bcService.set('@productName', this.product.name);
    }, error => {
      console.log(error);
    })
  }

}
