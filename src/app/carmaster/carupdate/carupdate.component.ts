import { Component, OnInit } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Commonservice } from '../../services/commonservice.service';
import { CARMainComponent } from '../carmain/carmain.component';

@Component({
  selector: 'app-carupdate',
  templateUrl: './carupdate.component.html',
  styleUrls: ['./carupdate.component.scss']
})
export class CARUpdateComponent implements OnInit {

  CTR_ParentContainerType: string;
  CTR_ConainerPerParent: string;
  CTR_ConatainerPartofParent: string;
  CTR_ContainerType: string;
  CTR_ROW: any;
  BtnTitle: string;
  
  constructor(private commonservice: Commonservice, private toastr: ToastrService, private translate: TranslateService, private carmainComponent: CARMainComponent
    ) {
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
    });
  }

  ngOnInit() {
    this.CTR_ROW = JSON.parse(localStorage.getItem("CAR_ROW"));
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
    this.carmainComponent.carComponent = 1;
  }


  OnAddUpdateClick(){
    this.carmainComponent.carComponent = 1;
  }
}
