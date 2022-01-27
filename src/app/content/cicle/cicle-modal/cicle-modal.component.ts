import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CicleInterface } from 'src/app/_models/cicle';
import { CicleService } from 'src/app/_services/cicle/cicle.service';
import { NotificationService } from 'src/app/_services/notification/notification.service';

@Component({
  selector: 'app-cicle-modal',
  templateUrl: './cicle-modal.component.html',
  styleUrls: ['./cicle-modal.component.css']
})
export class CicleModalComponent implements OnInit {
  @Input() public opc: boolean;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  @BlockUI('cicles') blockUICicle: NgBlockUI;

  public cicleInfo: FormGroup;
  public submitted: boolean = false;
  private cicles: CicleInterface[] = [];
  private datei: NgbDate;
  private datee: NgbDate;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private cicleService: CicleService,
    private notifyService: NotificationService,
  ) {
    this.cicleInfo = this.formBuilder.group({
      name: ['', Validators.required],
      dateinit: [null, Validators.required],
      dateend: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.getCicles();

    if (!this.opc) {
      this.setValuesInForm(this.cicleService.selectedCicle.name, this.cicleService.selectedCicle.dateinit,
        this.cicleService.selectedCicle.dateend);
    }
  }

  getCicles() {
    this.blockUICicle.start("Cargando...")
    this.cicleService.getFullInfoCicle().subscribe((cicles) => {
      this.cicles = cicles;
      this.blockUICicle.stop();
    });
  }


  setValuesInForm(name: string, dateinit: any, dateend: any) {
    this.f['name'].setValue(name);
    //Date init in ngDate
    let monthinit = dateinit.toDate().getUTCMonth() + 1;
    let dayinit = dateinit.toDate().getUTCDate();
    let yearinit = dateinit.toDate().getUTCFullYear();
    this.datei = new NgbDate(yearinit, monthinit, dayinit);
    this.f['dateinit'].setValue(this.datei);
    //Date end in ngDate
    let monthend = dateend.toDate().getUTCMonth() + 1;
    let dayend = dateend.toDate().getUTCDate();
    let yearend = dateend.toDate().getUTCFullYear();
    this.datee = new NgbDate(yearinit, monthinit, dayinit);
    this.f['dateend'].setValue(this.datee);
  }

  get f() { return this.cicleInfo.controls; }

  get fValue() { return this.cicleInfo.value; }


  onCicleInfoSubmit() {
    this.submitted = true;

    if (this.cicleInfo.invalid) {
      return;
    }

    let dateinit = new Date(this.f['dateinit'].value.year, this.f['dateinit'].value.month - 1, this.f['dateinit'].value.day);
    let dateend = new Date(this.f['dateend'].value.year, this.f['dateend'].value.month - 1, this.f['dateend'].value.day);

    if (Object.keys(this.cicleService.selectedCicle).length !== 0) {
      if (this.cicles.some(a => a.name.replace(/\s/g, "").trim().toLowerCase() === this.fValue.name
        .replace(/\s/g, "").trim().toLowerCase())) {
        this.f['dateinit'].setValue(this.datei);
        this.f['dateend'].setValue(this.datee);
        this.notifyService.showError("Duplicado", "El ciclo ya existe en la base de datos");
        return;
      }
    } else {
      if (this.cicles.some(a => a.name.replace(/\s/g, "").trim().toLowerCase() === this.fValue.name
        .replace(/\s/g, "").trim().toLowerCase())) {
        this.notifyService.showError("Duplicado", "El ciclo ya existe en la base de datos");
        return;
      }
    }

    this.f['dateinit'].setValue(dateinit);
    this.f['dateend'].setValue(dateend);

    this.blockUICicle.start("Guardando...")
    if (this.opc) {
      this.cicleService.addCicle(this.fValue).finally(() => {
        this.blockUICicle.stop();
        this.passEntry.emit(true);
        this.activeModal.close(true);
      });

    } else {
      this.cicleService.selectedCicle.name = this.fValue.name;
      this.cicleService.selectedCicle.dateinit = this.fValue.dateinit;
      this.cicleService.selectedCicle.dateend = this.fValue.dateend;
      this.cicleService.updateCicle(this.cicleService.selectedCicle).finally(() => {
        this.blockUICicle.stop();
        this.passEntry.emit(true);
        this.activeModal.close(true);
      });

    }

  }
}
