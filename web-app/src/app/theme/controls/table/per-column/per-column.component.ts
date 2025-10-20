import { Component, ContentChild, Input, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'dp-per-column',
  templateUrl: './per-column.component.html',
  styleUrls: ['./per-column.component.scss']
})
export class PerColumnComponent implements OnInit {
  @Input() name = '';
  @ContentChild(TemplateRef) template?: TemplateRef<any>;

  constructor() { }

  ngOnInit(): void {
  }

}
