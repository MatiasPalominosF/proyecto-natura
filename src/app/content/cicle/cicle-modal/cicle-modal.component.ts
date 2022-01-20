import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CicleService } from 'src/app/_services/cicle/cicle.service';

@Component({
  selector: 'app-cicle-modal',
  templateUrl: './cicle-modal.component.html',
  styleUrls: ['./cicle-modal.component.css']
})
export class CicleModalComponent implements OnInit {
  @Input() public opc: boolean;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  public cicleInfo: FormGroup;
  public submitted: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private cicleService: CicleService,
  ) { }

  ngOnInit(): void {
    this.cicleInfo = this.formBuilder.group({
      name: ['', Validators.required],
      dateinit: ['', Validators.required],
      dateend: ['', Validators.required],
    });
  }

  get f() { return this.cicleInfo.controls; }

  get fValue() { return this.cicleInfo.value; }

  onCicleInfoSubmit() {
    this.submitted = true;

    if (this.cicleInfo.invalid) {
      return;
    }

    if (this.opc) {
      let dateinit = new Date(this.f['dateinit'].value.year, this.f['dateinit'].value.month - 1, this.f['dateinit'].value.day);
      let dateend = new Date(this.f['dateend'].value.year, this.f['dateend'].value.month - 1, this.f['dateend'].value.day);
      this.f['dateinit'].setValue(dateinit);
      this.f['dateend'].setValue(dateend);

      this.cicleService.addCicle(this.fValue);

      this.passEntry.emit(true);
      this.activeModal.close(true);
    }

  }

}
