import { Component, OnInit } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Commonservice } from '../../services/commonservice.service';
import { CTRMainComponent } from '../ctrmain/ctrmain.component';
import { CTRMasterService } from '../../services/ctrmaster.service';
import { Router } from '../../../../node_modules/@angular/router';

@Component({
  selector: 'app-ctrupdate',
  templateUrl: './ctrupdate.component.html',
  styleUrls: ['./ctrupdate.component.scss']
})
export class CTRUpdateComponent implements OnInit {
  CAR_ItemCode: string;
  CAR_PartsPerContainer: Number;
  CAR_PackType: Number;
  CAR_ContainerType: string;
  CAR_MinFillPercent: Number;
  CTR_ROW: any;
  BtnTitle: string;
  CAR_AddPartsToContainer: boolean = false;
  showLoader: boolean = false;
  isUpdate: boolean = false;
  
  constructor(private commonservice: Commonservice, private toastr: ToastrService, 
    private translate: TranslateService, private ctrmainComponent: CTRMainComponent,
    private ctrmasterService: CTRMasterService, private router: Router
    ) {
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
    });
  }

  ngOnInit() {
    this.CTR_ROW = JSON.parse(localStorage.getItem("CTR_ROW"));
    if(this.CTR_ROW != undefined && this.CTR_ROW != ""){
      this.CAR_ContainerType = this.CTR_ROW[0];
      this.CAR_ItemCode = this.CTR_ROW[0];
      this.CAR_PartsPerContainer = this.CTR_ROW[0];
      this.CAR_PackType = this.CTR_ROW[0];
      this.CAR_MinFillPercent = this.CTR_ROW[0];
      this.BtnTitle = this.translate.instant("CT_Update");
    }else{
      this.BtnTitle = this.translate.instant("CT_Add");
    }
  }

  onCancelClick(){
    this.ctrmainComponent.ctrComponent = 1;
  }

  validateFields(): boolean{
    if(this.CAR_ContainerType == '' || this.CAR_ContainerType == undefined){
      this.toastr.error('', this.translate.instant("CT_ContainerType_Blank_Msg"));
      return false;
    }
    // else if(this.CTR_ParentContainerType == '' || this.CTR_ParentContainerType == undefined){
    //   this.toastr.error('', this.translate.instant("CTR_ParentContainerType_Blank_Msg"));
    //   return false;
    // }
    return true;
  }

  OnAddUpdateClick() {
    if(!this.validateFields()){
      return;
    }
    if(this.BtnTitle == this.translate.instant("CT_Update")){
    //  this.updateaddContainerRelationship();
    }else{
    //  this.addContainerRelationship();
    }
  }
  
  // addContainerRelationship() {
  //   this.showLoader = true;
  //   this.ctrmasterService.InsertIntoContainerRelationship(this.CTR_ContainerType, this.CTR_ParentContainerType, 
  //     this.CTR_ConainerPerParent, this.CTR_ConatainerPartofParent).subscribe(
  //     (data: any) => {
  //       this.showLoader = false;
  //       if (data != undefined) {
  //         if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
  //           this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
  //             this.translate.instant("CommonSessionExpireMsg"));
  //           return;
  //         }
  //         this.ctrmainComponent.ctrComponent = 1;
  //       } else {
  //         this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
  //       }
  //     },
  //     error => {
  //       this.showLoader = false;
  //       if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
  //         this.commonservice.unauthorizedToken(error, this.translate.instant("token_expired"));
  //       }
  //       else {
  //         this.toastr.error('', error);
  //       }
  //     }
  //   );
  // }

  // updateaddContainerRelationship() {
  //   this.showLoader = true;
  //   this.ctrmasterService.UpdateContainerRelationship(this.CTR_ContainerType, this.CTR_ParentContainerType, 
  //     this.CTR_ConainerPerParent, this.CTR_ConatainerPartofParent).subscribe(
  //     (data: any) => {
  //       this.showLoader = false;
  //       if (data != undefined) {
  //         if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
  //           this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
  //             this.translate.instant("CommonSessionExpireMsg"));
  //           return;
  //         }
  //         this.ctrmainComponent.ctrComponent = 1;
  //       } else {
  //         this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
  //       }
  //     },
  //     error => {
  //       this.showLoader = false;
  //       if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
  //         this.commonservice.unauthorizedToken(error, this.translate.instant("token_expired"));
  //       }
  //       else {
  //         this.toastr.error('', error);
  //       }
  //     }
  //   );
  // }



}
