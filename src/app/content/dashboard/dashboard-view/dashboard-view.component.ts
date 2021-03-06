import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BreadcrumbInterface } from 'src/app/_models/breadcrumb';
import { CicleInterface } from 'src/app/_models/cicle';
import { ProductCartInterface } from 'src/app/_models/productCart';
import { SaleService } from 'src/app/_services/sale/sale.service';
import * as chartsData from './data';

@Component({
  selector: 'app-dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.css']
})
export class DashboardViewComponent implements OnInit {

  @BlockUI('card') blockUICards: NgBlockUI;

  /** Data for PieChart */
  public pieChartLabel: string[] = []; // Nombre producto
  public pieChartData: number[] = []; // Cantidad de producto
  public pieChartType = chartsData.pieChartType;
  public pieChartColors = chartsData.pieChartColors;
  public pieChartOptions = chartsData.pieChartOptions;
  /** End data for PieChart */

  public totalProduct: number = 0;
  public saleTotal: number = 0;
  public gain: number = 0;
  public margin: number = 0;
  private sales: ProductCartInterface[] = []

  public breadcrumb: BreadcrumbInterface;
  constructor(
    private saleService: SaleService,
  ) { }

  ngOnInit(): void {
    this.breadcrumb = {
      mainlabel: 'Vista principal',
      links: [{
        'name': 'Home',
        'isLink': true,
        'link': '/dashboard/dashboard-view'
      },
      {
        'name': 'Dashboard',
        'isLink': false,
        'link': '#'
      },],
      options: false,
      putselect: true,
    };
  }

  setValuesInDashboard(cicle: CicleInterface): void {
    this.totalProduct = 0;
    this.saleTotal = 0;
    this.gain = 0;
    this.margin = 0;
    this.sales = [];
    this.pieChartData = [];
    this.pieChartLabel = [];
    if (cicle.uid != 'customuid') {
      this.setValuesInCardWithCicle(cicle);
    } else {
      this.setValuesInCardGeneral();
    }
  }

  setValuesInCardGeneral() {
    this.blockUICards.start("Cargando...");

    this.sales = [];
    this.saleService.getAllSales().then(
      (querySnapshot) => {
        if (querySnapshot.empty) {
          this.pieChartLabel.push("Sin datos");
          this.pieChartData.push(0)
          this.blockUICards.stop();
        };
        let i = -1;
        var promise = new Promise<void>((resolve, reject) => {
          querySnapshot.docs.forEach(async (item, index, array) => {
            let sale: ProductCartInterface = item.data();
            this.sales.push(sale);
            i += 1;
            if (i === array.length - 1) {
              resolve();
            }
          });
        });
        promise.then(() => {
          var salenet: number = 0;
          this.sales.forEach(sale => {
            this.totalProduct += sale.quantitycart;
            this.saleTotal += sale.totalcart;
            salenet += sale.nettotalcart;
          });
          this.gain = this.saleTotal - salenet;

          this.margin = this.gain / salenet;

          let grouped = this.groupBy(this.sales, "puid");

          let array = [];
          Object.keys(grouped).forEach(key => { array.push(grouped[key]); });

          for (let i = 0; i < array.length; i++) {
            this.pieChartLabel.push(array[i][0].name);
            this.pieChartData.push(array[i][0].quantitycart);
          }
          this.blockUICards.stop();
        })
      }
    );
  }

  setValuesInCardWithCicle(cicle: CicleInterface) {
    this.sales = [];
    this.blockUICards.start("Cargando...");
    this.saleService.getSalesByCicle(cicle.uid).then((querySnapshot) => {
      if (querySnapshot.empty) {
        this.pieChartLabel.push("Sin datos");
        this.pieChartData.push(0)
        this.blockUICards.stop();
      };
      let i = -1;
      var promise = new Promise<void>((resolve, reject) => {
        querySnapshot.docs.forEach(async (item, index, array) => {
          let sale: ProductCartInterface = item.data();
          this.sales.push(sale);
          i += 1;
          if (i === array.length - 1) {
            resolve();
          }
        });
      });

      promise.then(() => {
        var salenet: number = 0;
        this.sales.forEach(sale => {
          this.saleTotal += sale.totalcart;
          this.totalProduct += sale.quantitycart;
          salenet += sale.nettotalcart
        });
        this.gain = this.saleTotal - salenet;
        this.margin = this.gain / salenet;
        let grouped = this.groupBy(this.sales, "puid");
        let array = [];
        Object.keys(grouped).forEach(key => { array.push(grouped[key]); });

        for (let i = 0; i < array.length; i++) {
          this.pieChartLabel.push(array[i][0].name);
          this.pieChartData.push(array[i][0].quantitycart);
        }
        this.blockUICards.stop();
      })
    });
  }

  groupBy(xs: any[], key: string): any {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

}
