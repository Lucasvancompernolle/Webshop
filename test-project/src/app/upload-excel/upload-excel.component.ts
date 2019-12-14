
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { ProductService } from '../product-service/product.service';
import { Product } from '../product-service/product';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-upload-excel',
  templateUrl: './upload-excel.component.html',
  styleUrls: ['./upload-excel.component.css']
})
export class UploadExcelComponent implements OnInit {

  @ViewChild('fileInput', { static: false }) fileInput;
  message: string;

  private _products = new BehaviorSubject<Product[]>([]);
  dataStore: { products: Product[] } = { products: [] };
  readonly products = this._products.asObservable();

  Upload: boolean = false;
  myFiles: string[] = [];
  displayedColumns: string[] = 
  ['id', 'name', 'brand', 'price', 'salesUnit', 'ratingScore', 'qtyOnHand', 'productGroup', 'sku', 'description', 'picturePath' ];

  constructor(private httpService: HttpClient, private ProductService: ProductService) { }

  ngOnInit() {

  }


  getFileDetails(event) {
    if (event.target.files.length > 1) {
    alert("Upload max 1 file!")
    }

      var name = event.target.files[0].name;
      var type = event.target.files[0].type;
      var size = event.target.files[0].size;
      var modifiedDate = event.target.files[0].lastModifiedDate;

      let workBook: XLSX.WorkBook = null;
      let jsonData = null;

      const reader = new FileReader();
      const file = event.target.files[0];

      reader.onload = (event) => {
        const data = reader.result;
        workBook = XLSX.read(data, { type: 'binary', cellNF: true });


        workBook.SheetNames.reduce((initial, name) => {

          let products: Product[] = [];
          const sheet: XLSX.WorkSheet = workBook.Sheets[name];

          var range = XLSX.utils.decode_range(sheet['!ref']);
          //Read all cells that are filled in
          for (let index = 4; index < range.e.r; index++) {
            let product: Product = new Product();

            try {
              product.id = (sheet["A" + index].v);

            } catch (error) {
              console.log("empty cell");
            }
            try {
              product.name = sheet["B" + index].v;

            } catch (error) {
              console.log("empty cell");
            }
            try {
              product.brand = sheet["C" + index].v;

            } catch (error) {
              console.log("empty cell");
            }
            try {
              product.price = sheet["D" + index].v;

            } catch (error) {
              console.log("empty cell");
            }
            try {
              product.salesUnit = sheet["E" + index].v;

            } catch (error) {
              console.log("empty cell");
            }
            try {
              product.ratingScore = sheet["F" + index].v;

            } catch (error) {
              console.log("empty cell");
            }
            try {
              product.qtyOnHand = sheet["G" + index].v;
            } catch (error) {
              console.log("empty cell");
            } try {
              product.productGroup = sheet["H" + index].v;

            } catch (error) {
              console.log("empty cell");
            } try {
              product.sku = sheet["I" + index].v;

            } catch (error) {
              console.log("empty cell");
            } try {
              product.description = sheet["J" + index].v;

            } catch (error) {
              console.log("empty cell");
            } try {
              product.picturePath = sheet["K" + index].v;

            } catch (error) {
              console.log("empty cell");
            }

            products.push(product);

          }

          this.Upload = true;
          console.log(JSON.stringify(products))

          this.dataStore.products = products;
          this._products.next(Object.assign({}, this.dataStore).products);

          initial[name] = XLSX.utils.sheet_to_json(sheet);
          return initial;


        }, {});
        
      }
      reader.readAsBinaryString(file);
      console.log('Name: ' + name + "\n" +
        'Type: ' + type + "\n" +
        'Last-Modified-Date: ' + modifiedDate + "\n" +
        'Size: ' + Math.round(size / 1024) + " KB");
    
  }

  UploadProductsExcel() {
    this.Upload = false;
    this.ProductService.UploadExcel(this.dataStore.products).subscribe(
      () => alert("Products uploaded from excel!")
    )
  }



  uploadFiles() {
    const frmData = new FormData();

    for (var i = 0; i < this.myFiles.length; i++) {
      frmData.append("fileUpload", this.myFiles[i]);
    }

    this.httpService.post('https://localhost:5001/api/products/UploadExcel', frmData).subscribe(
      data => {
        // SHOW A MESSAGE RECEIVED FROM THE WEB API.
        console.log(data as string);
      },
      (err: HttpErrorResponse) => {
        console.log(err.message);    // Show error, if any.
      }
    );
  }


}
