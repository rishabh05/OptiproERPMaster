import { Component, OnInit } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Commonservice } from '../../services/commonservice.service';
import { CTRMainComponent } from '../ctrmain/ctrmain.component';

@Component({
  selector: 'app-ctrupdate',
  templateUrl: './ctrupdate.component.html',
  styleUrls: ['./ctrupdate.component.scss']
})
export class CTRUpdateComponent implements OnInit {
  CTR_ParentContainerType: string;
  CTR_ConainerPerParent: string;
  CTR_ConatainerPartofParent: string;
  CTR_ContainerType: string;
  CTR_ROW: any;
  BtnTitle: string;
  
  constructor(private commonservice: Commonservice, private toastr: ToastrService, private translate: TranslateService, private ctrmainComponent: CTRMainComponent
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
      this.CTR_ContainerType = this.CTR_ROW[0];
      this.CTR_ParentContainerType = this.CTR_ROW[0];
      this.CTR_ConainerPerParent = this.CTR_ROW[0];
      this.CTR_ConatainerPartofParent = this.CTR_ROW[0];
      this.BtnTitle = this.translate.instant("CT_Update");
    }else{
      this.BtnTitle = this.translate.instant("CT_Add");
    }
  }

  onCancelClick(){
    this.ctrmainComponent.ctrComponent = 1;
  }


  OnAddUpdateClick(){
    this.ctrmainComponent.ctrComponent = 1;
  }
}
