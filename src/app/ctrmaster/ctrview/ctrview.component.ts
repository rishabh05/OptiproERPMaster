import { Component, OnInit } from '@angular/core';
import { ToastrService } from '../../../../node_modules/ngx-toastr/toastr/toastr.service';

@Component({
  selector: 'app-ctrview',
  templateUrl: './ctrview.component.html',
  styleUrls: ['./ctrview.component.scss']
})
export class CTRViewComponent implements OnInit {

  showLookupLoader: boolean = true;
  serviceData: any[];
  lookupfor: string;
  showLoader: boolean = false;

  constructor(ctrmasterService: CTRMasterService, private translate: TranslateService) { }

  ngOnInit() {
    this.onVendorLookupClick();
  }

  onVendorLookupClick() {
    this.showLoader = true;
    this.ctrmasterService.getVendorList().subscribe(
      (data: any) => {
        this.showLoader = false;
        // console.log(data);
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.showLookupLoader = false;
          this.serviceData = data.Table;
          this.lookupfor = "CTList";
        } else {
          this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
        }
      },
      error => {
        this.showLoader = false;
        // console.log("Error: ", error);
        // this.toastr.error('', error);
        if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
          this.commonservice.unauthorizedToken(error, this.translate.instant("token_expired"));
        }
        else {
          this.toastr.error('', error);
        }
      }
    );
  }


  getLookupValue(event) {
    localStorage.setItem("CT_ROW", JSON.stringify(event));
    this.inboundMasterComponent.inboundComponent = 2;
  }


  OnCancelClick() {
    this.router.navigate(['home/dashboard']);
  }

  OnAddClick(){
    localStorage.setItem("CT_ROW", "");
    this.inboundMasterComponent.inboundComponent = 2;
  }

  onEditClick(){
    this.inboundMasterComponent.inboundComponent = 2;
  }

  onDeleteRowClick(){
    this.inboundMasterComponent.inboundComponent = 2;
  }

}
