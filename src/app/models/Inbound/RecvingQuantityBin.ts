export class RecvingQuantityBin{
    
    public VendorLot: string;
    public LotNumber: string;
    public LotQty: number;
    public Bin: string;
    public expiryDate: string;
    public PalletCode: string;
    public palletSBNo: String;
    public autoLot: string;

    constructor(MfrSerial: string, serial: string, qty:number, bin: string, expiryDate: string, palletCode: string, autoLot: string){
        this.VendorLot = MfrSerial;
        this.LotNumber = serial;
        this.LotQty = qty;
        this.Bin = bin;
        this.expiryDate = expiryDate;
        this.PalletCode = palletCode;
        this.autoLot = autoLot;
        if(serial != ""){
            this.palletSBNo = serial +"-"+palletCode;
        }
    }
}