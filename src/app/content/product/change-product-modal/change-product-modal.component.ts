import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-change-product-modal',
  templateUrl: './change-product-modal.component.html',
  styleUrls: ['./change-product-modal.component.css']
})
export class ChangeProductModalComponent implements OnInit {

  public title: string;
  constructor(
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
    this.title = 'Mover stock';
  }

}
