import { Component, OnInit } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Commonservice } from 'src/app/services/commonservice.service';
import { ToastrService } from 'ngx-toastr';
import { DockdoormainComponent } from '../dockdoormain/dockdoormain.component';
import { DockdoorService } from 'src/app/services/dockdoor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dockdoorview',
  templateUrl: './dockdoorview.component.html',
  styleUrls: ['./dockdoorview.component.scss']
})
export class DockdoorviewComponent implements OnInit {


  showLookupLoader: boolean = true;
  serviceData: any[];
  lookupfor: string;
  showLoader: boolean = false;
  constructor(private translate: TranslateService,private commonservice: Commonservice, private toastr: ToastrService,
    private ddmainComponent: DockdoormainComponent, private ddService: DockdoorService, private router: Router) { 
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
    });
  }

  ngOnInit() {
    this.onDDLookupClick();
  }


  onDDLookupClick() {
    this.showLoader = true;
    this.ddService.getDockDoorList().subscribe(
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
          this.lookupfor = "DDList";
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
    localStorage.setItem("CTR_ROW", JSON.stringify(event));
    this.ddmainComponent.ddComponent = 2;
  }

  OnCancelClick() {
    this.router.navigate(['home/dashboard']);
  }

  OnAddClick(){
    localStorage.setItem("CTR_ROW", "");
    this.ddmainComponent.ddComponent = 2;
  }

  onEditClick(){
    this.ddmainComponent.ddComponent = 2;
  }

  onDeleteRowClick(){
    this.ddmainComponent.ddComponent= 2;
  }

}
