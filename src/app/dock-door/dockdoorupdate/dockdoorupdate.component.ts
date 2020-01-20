import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Commonservice } from 'src/app/services/commonservice.service';
import { DockdoormainComponent } from '../dockdoormain/dockdoormain.component';
import { DockdoorService } from 'src/app/services/dockdoor.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dockdoorupdate',
  templateUrl: './dockdoorupdate.component.html',
  styleUrls: ['./dockdoorupdate.component.scss']
})
export class DockdoorupdateComponent implements OnInit {

  constructor(private translate: TranslateService,private commonservice: Commonservice, private toastr: ToastrService,
    private ddmainComponent: DockdoormainComponent, private ddService: DockdoorService, private router: Router) { }

  ngOnInit() {
  }

  
  onCancelClick(){
    
    this.ddmainComponent.ddComponent= 1;
  }


  OnAddUpdateClick(){
    
    this.ddmainComponent.ddComponent= 2;
  }
  

}
