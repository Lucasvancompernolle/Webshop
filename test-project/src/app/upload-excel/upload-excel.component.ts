
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

  Download: boolean = false;
  myFiles: string[] = [];

  constructor(private httpService: HttpClient, private ProductService: ProductService) { }

  ngOnInit() {

  }


  getFileDetails(event) {
    for (var i = 0; i < event.target.files.length; i++) {
      var name = event.target.files[i].name;
      var type = event.target.files[i].type;
      var size = event.target.files[i].size;
      var modifiedDate = event.target.files[i].lastModifiedDate;

      let workBook: XLSX.WorkBook = null;
      let jsonData = null;

      const reader = new FileReader();
      const file = event.target.files[i];

      reader.onload = (event) => {
        const data = reader.result;
        workBook = XLSX.read(data, { type: 'binary', cellNF: true });


        jsonData = workBook.SheetNames.reduce((initial, name) => {

          let products: Product[] = [];
          const sheet: XLSX.WorkSheet = workBook.Sheets[name];

          var range = XLSX.utils.decode_range(sheet['!ref']);

          for (let index = 4; index < range.e.r; index++) {
            let product: Product = new Product();

            product.id = sheet["A" + index].v;
            product.name = sheet["B" + index].v;
            product.brand = sheet["C" + index].v;
            product.price = sheet["D" + index].v;
            product.salesUnit = sheet["E" + index].v;
            product.ratingScore = sheet["F" + index].v;
            product.qtyOnHand = sheet["G" + index].v;
            product.productGroup = sheet["H" + index].v;
            product.sku = sheet["I" + index].v;
            product.description = sheet["J" + index].v;
            product.picturePath = sheet["K" + index].v;

            products.push(product);
          }

          this.Download = true;
          console.log(JSON.stringify(products))

          this.dataStore.products = products;
          this._products.next(Object.assign({}, this.dataStore).products);

          initial[name] = XLSX.utils.sheet_to_json(sheet);
          return initial;


        }, {});
        const dataString = JSON.stringify(jsonData);
        console.log(dataString)
        document.getElementById('output').innerHTML = dataString.slice(0, 300).concat("...");
        this.setDownload(dataString);
      }
      reader.readAsBinaryString(file);



      console.log('Name: ' + name + "\n" +
        'Type: ' + type + "\n" +
        'Last-Modified-Date: ' + modifiedDate + "\n" +
        'Size: ' + Math.round(size / 1024) + " KB");
    }
  }

  setDownload(data) {
    this.Download = true;
    setTimeout(() => {
      const el = document.querySelector("#download");
      el.setAttribute("href", `data:text/json;charset=utf-8,${encodeURIComponent(data)}`);
      el.setAttribute("download", 'xlsxtojson.json');
    }, 1000)
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
