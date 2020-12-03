import { rendererTypeName } from '@angular/compiler';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IBrand } from '../shared/models/brand';
import { IProduct } from '../shared/models/product';
import { IType } from '../shared/models/productType';
import { ShopParams } from '../shared/models/shopParams';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  @ViewChild('search', {static: false}) searchTerm!: ElementRef
  products!: IProduct[];
  brands!: IBrand[];
  types!: IType[];
  shopParams = new ShopParams();
  totalCount!: number;
  sortOptions = [
    {name: 'Alphabatical', value: 'name'},
    {name: 'Price: Descending', value: 'priceDesc'},
    {name: 'Price: Ascending', value: 'priceAsc'}
  ];

  constructor(private shopService: ShopService) { }

  ngOnInit(): void {
    this.getProducts();
    this.getProductBrands();
    this.getProductTypes();
  }

  getProducts(){
    this.shopService.getProducts(this.shopParams).subscribe(response => {
      if(response){
        this.products = response.data;
        this.shopParams.pageNumber = response.pageIndex;
        this.shopParams.pageSize = response.pageSize;
        this.totalCount = response.count;
      }
    }, error => {
      console.log(error);
    });
  }

  getProductBrands(){
    this.shopService.getProductBrands().subscribe(response => {
      this.brands = [{id: 0, name: 'All'}, ...response];
    }, error => {
      console.log(error);
    });
  }

  getProductTypes(){
    this.shopService.getProductTypes().subscribe(response => {
      this.types = [{id: 0, name: 'All'}, ...response];
    }, error => {
      console.log(error);
    });
  }

  onBrandSelected(brandId: number){
    this.shopParams.pageNumber = 1;
    this.shopParams.brandId = brandId;
    this.getProducts();
  }

  onTypeSelected(typeId: number){
    this.shopParams.pageNumber = 1;
    this.shopParams.typeId = typeId;
    this.getProducts();
  }

  onSortSelected(sort: Event){
    this.shopParams.pageNumber = 1;
    this.shopParams.sort = (sort.target as HTMLTextAreaElement).value;
    this.getProducts();
  }

  onPageChanged(event: any){
    if(this.shopParams.pageNumber !== event.page){
      this.shopParams.pageNumber = event.page;
      this.getProducts();
    }
  }

  onSearch(){
    this.shopParams.pageNumber = 1;
    this.shopParams.search = this.searchTerm.nativeElement.value;
    this.getProducts();
  }

  onReset(){
    this.shopParams = new ShopParams();
    this.searchTerm.nativeElement.value = '';
    this.getProducts();
  }
}
