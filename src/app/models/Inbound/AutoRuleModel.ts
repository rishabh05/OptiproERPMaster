export class AutoRuleModel{
    
    public itemcode: string;
    public ruleId: number;
    public partperCont: number;
    public minfill: number;

    constructor(itemcode: string, ruleId: number, partperCont:number, minfill: number
        ){
        this.itemcode = itemcode;
        this.ruleId = ruleId;
        this.partperCont = partperCont;
        this.minfill = minfill;
    }
}