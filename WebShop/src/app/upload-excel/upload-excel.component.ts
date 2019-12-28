
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
    ['id', 'name', 'brand', 'price', 'salesUnit', 'ratingScore', 'qtyOnHand', 'productGroup', 'sku', 'description', 'picturePath'];

  constructor(private httpService: HttpClient, private ProductService: ProductService) { }

  ngOnInit() {
    this.Upload = false;
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

        if(range.e.r > 100)
        {
          alert("Only up to 100 records are allowed to upload!")
          return;
        }
        //Read all cells that are filled in
        for (let index = 4; index <= (range.e.r + 1) ; index++) {
          let product: Product = new Product();
          let emptyProducts: Product = new Product();

          /* Find desired cell */
          var desired_cell = sheet["A" + index];
          product.id = (desired_cell ? desired_cell.v : undefined);

          var desired_cell = sheet["B" + index];
          product.name = (desired_cell ? desired_cell.v : undefined);

          var desired_cell = sheet["C" + index];
          product.brand = (desired_cell ? desired_cell.v : undefined);

          var desired_cell = sheet["D" + index];
          product.price = (desired_cell ? desired_cell.v : undefined);

          var desired_cell = sheet["E" + index];
          product.salesUnit = (desired_cell ? desired_cell.v : undefined);

          var desired_cell = sheet["F" + index];
          product.ratingScore = (desired_cell ? desired_cell.v : undefined);

          var desired_cell = sheet["G" + index];
          product.qtyOnHand = (desired_cell ? desired_cell.v : undefined);

          var desired_cell = sheet["H" + index];
          product.productGroup = (desired_cell ? desired_cell.v : undefined);

          var desired_cell = sheet["I" + index];
          product.sku = (desired_cell ? desired_cell.v : undefined);

          var desired_cell = sheet["J" + index];
          product.description = (desired_cell ? desired_cell.v : undefined);

          var desired_cell = sheet["K" + index];
          product.picturePath = (desired_cell ? desired_cell.v : undefined);

          var desired_cell = sheet["L" + index];
          product.countryOfOrigin = (desired_cell ? desired_cell.v : undefined);

          if (JSON.stringify(products) !== JSON.stringify(emptyProducts))
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
    
    this.ProductService.UploadExcel(this.dataStore.products).subscribe(
      () => {
        alert("Products uploaded from excel!");
        this.ngOnInit();
      }
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
