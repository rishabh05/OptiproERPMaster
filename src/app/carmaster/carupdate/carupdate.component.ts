
import { Component, OnInit } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Commonservice } from '../../services/commonservice.service';
import { Router } from '../../../../node_modules/@angular/router';
import { CARMainComponent } from '../carmain/carmain.component';
import { AutoRuleModel } from '../../models/Inbound/autoRuleModel';
import { CARMasterService } from '../../services/carmaster.service';

@Component({
  selector: 'app-carupdate',
  templateUrl: './carupdate.component.html',
  styleUrls: ['./carupdate.component.scss']
})
export class CARUpdateComponent implements OnInit {
  CAR_CPackRule: string;
  CAR_ContainerType: string;
  CAR_ItemCode: string;
  CAR_PartsPerContainer: Number;
  CAR_MinFillPercent: Number;
  CAR_PackType = "Single Item";
  
  lookupfor: string;
  BtnTitle: string;

  CTR_ROW: any;
  serviceData: any[];
  public autoRuleArray: AutoRuleModel[] = [];
  PackTypeList: any[] = ["Single Item", "Multiple Items"];

  CAR_AddPartsToContainer: boolean = false;
  showLoader: boolean = false;
  isUpdate: boolean = false;
  hideLookup: boolean = true;

  constructor(private commonservice: Commonservice, private toastr: ToastrService,
    private translate: TranslateService, private carmainComponent: CARMainComponent,
    private carmasterService: CARMasterService, private router: Router
  ) {
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
    });
  }

  ngOnInit() {
    let Carow = localStorage.getItem("CAR_ROW")
    if (Carow != undefined && Carow != "") {
      this.CTR_ROW = JSON.parse(localStorage.getItem("CAR_ROW"));
      this.CAR_CPackRule = this.CTR_ROW[0];
      this.CAR_ContainerType = this.CTR_ROW[0];
      this.CAR_PackType = this.CTR_ROW[0];
      this.CAR_ItemCode = this.CTR_ROW[0];
      this.CAR_PartsPerContainer = this.CTR_ROW[0];
      this.CAR_MinFillPercent = this.CTR_ROW[0];
      this.isUpdate = true;
      this.BtnTitle = this.translate.instant("CT_Update");
    } else {
      this.BtnTitle = this.translate.instant("CT_Add");
      this.isUpdate = false;
    }
  }

  onCancelClick() {
    this.carmainComponent.carComponent = 1;
  }

  validateFields(): boolean {
    if (this.CAR_ContainerType == '' || this.CAR_ContainerType == undefined) {
      this.toastr.error('', this.translate.instant("CT_ContainerType_Blank_Msg"));
      return false;
    }
    else if (this.CAR_CPackRule == undefined) {
      this.toastr.error('', this.translate.instant("CAR_ContainerPackRule_Blank_Msg"));
      return false;
    }
    else if (this.CAR_PackType == undefined) {
      this.toastr.error('', this.translate.instant("CAR_Pack_Type_Blank_Msg"));
      return false;
    }
    else if (this.CAR_ItemCode == '' || this.CAR_ItemCode == undefined) {
      this.toastr.error('', this.translate.instant("CAR_ItemCode_Blank_Msg"));
      return false;
    }
    return true;
  }

  OnContainerTypeChange(){
    this.showLoader = true;
    this.commonservice.IsValidContainerType(this.CAR_ContainerType).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.CAR_ContainerType = data;
        } else {
          this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
        }
      },
      error => {
        this.showLoader = false;
        if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
          this.commonservice.unauthorizedToken(error, this.translate.instant("token_expired"));
        }
        else {
          this.toastr.error('', error);
        }
      }
    );
  }

  OnAddUpdateClick() {
    if (!this.validateFields()) {
      return;
    }
    if (this.BtnTitle == this.translate.instant("CT_Update")) {
       this.updateContainerAutoRule();
    } else {
       this.addContainerAutoRule();
    }
  }

  updateContainerAutoRule() {
    var AutoRuleData: any = {};
    AutoRuleData.Header = [];
    AutoRuleData.Details = [];
    var AutoRuleData = this.prepareContainerAutoRule(AutoRuleData); // current data only.
    this.UpdateContainerAutoRule(AutoRuleData);
  }

  addContainerAutoRule() {
    var AutoRuleData: any = {};
    AutoRuleData.Header = [];
    AutoRuleData.Details = [];
    var AutoRuleData = this.prepareContainerAutoRule(AutoRuleData); // current data only.
    this.InsertIntoContainerAutoRule(AutoRuleData);
  }

  prepareContainerAutoRule(oSubmitPOLotsObj: any): any {
    // oSubmitPOLotsObj = this.manageRecords(oSubmitPOLotsObj);
    // if (localStorage.getItem("Line") == null || localStorage.getItem("Line") == undefined ||
    //   localStorage.getItem("Line") == "") {
    //   localStorage.setItem("Line", "0");
    // }

    let packtype = 1;
    if(this.CAR_PackType == "Single Item"){
      packtype = 1;
    }else{
      packtype = 2;
    }
    oSubmitPOLotsObj.Header.push({
      DiServerToken: localStorage.getItem("Token"),
      OPTM_RULEID: this.CAR_CPackRule,
      OPTM_CONTTYPE: this.CAR_ContainerType,
      CompanyDBId: localStorage.getItem("CompID"),
      OPTM_PACKTYPE: packtype,
      OPTM_CREATEDBY: localStorage.getItem("UserId")
    });

    for (var iBtchIndex = 0; iBtchIndex < this.autoRuleArray.length; iBtchIndex++) {
      oSubmitPOLotsObj.Details.push({
        OPTM_ITEMCODE: this.autoRuleArray[iBtchIndex].itemcode,
        OPTM_RULEID: this.autoRuleArray[0].ruleId,
        OPTM_PARTS_PERCONT: this.autoRuleArray[iBtchIndex].partperCont,
        OPTM_MIN_FILLPRCNT: this.autoRuleArray[iBtchIndex].minfill,
        OPTM_CREATEDBY: localStorage.getItem("UserId")
      });
    }
    return oSubmitPOLotsObj;
  }


  InsertIntoContainerAutoRule(AutoRuleData: any) {
    this.showLoader = true;
    this.carmasterService.InsertIntoContainerAutoRule(AutoRuleData).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
        } else {
          this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
        }
      },
      error => {
        this.showLoader = false;
        if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
          this.commonservice.unauthorizedToken(error, this.translate.instant("token_expired"));
        }
        else {
          this.toastr.error('', error);
        }
      }
    );
  }

  UpdateContainerAutoRule(AutoRuleData: any) {
    this.showLoader = true;
    this.carmasterService.UpdateContainerAutoRule(AutoRuleData).subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
        } else {
          this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
        }
      },
      error => {
        this.showLoader = false;
        if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
          this.commonservice.unauthorizedToken(error, this.translate.instant("token_expired"));
        }
        else {
          this.toastr.error('', error);
        }
      }
    );
  }

  getLookupValue($event) {
    if ($event != null && $event == "close") {
      this.hideLookup = false;
      return;
    }
    else if (this.lookupfor == "CTList") {
      this.CAR_ContainerType = $event[0];
    }
  }


  GetDataForContainerType() {
    this.showLoader = true;
    this.hideLookup = false;
    this.commonservice.GetDataForContainerType().subscribe(
      (data: any) => {
        this.showLoader = false;
        if (data != undefined) {
          if (data.LICDATA != undefined && data.LICDATA[0].ErrorMsg == "7001") {
            this.commonservice.RemoveLicenseAndSignout(this.toastr, this.router,
              this.translate.instant("CommonSessionExpireMsg"));
            return;
          }
          this.serviceData = data;
          this.lookupfor = "CTList";
        } else {
          this.toastr.error('', this.translate.instant("CommonNoDataAvailableMsg"));
        }
      },
      error => {
        this.showLoader = false;
        if (error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined) {
          this.commonservice.unauthorizedToken(error, this.translate.instant("token_expired"));
        }
        else {
          this.toastr.error('', error);
        }
      }
    );
  }


  AddRow(){
    this.autoRuleArray.push(new AutoRuleModel("", 0, 0, 0));
  }

  updateRuleId(lotTemplateVar, value, rowindex, gridData: any) {
    for (let i = 0; i < this.autoRuleArray.length; ++i) {
      if (i === rowindex) {
        this.autoRuleArray[i].ruleId = value;
      }
    }
  }

  updateItemCode(lotTemplateVar, value, rowindex, gridData: any) {
    for (let i = 0; i < this.autoRuleArray.length; ++i) {
      if (i === rowindex) {
        this.autoRuleArray[i].itemcode = value;
      }
    }
  }

  updatePartperCont(lotTemplateVar, value, rowindex, gridData: any) {
    for (let i = 0; i < this.autoRuleArray.length; ++i) {
      if (i === rowindex) {
        this.autoRuleArray[i].partperCont = value;
      }
    }
  }

  updateMinfill(lotTemplateVar, value, rowindex, gridData: any) {
    for (let i = 0; i < this.autoRuleArray.length; ++i) {
      if (i === rowindex) {
        this.autoRuleArray[i].minfill = value;
      }
    }
  }

}

