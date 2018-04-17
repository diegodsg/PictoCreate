import { Injectable } from '@angular/core';

@Injectable()
export class Scheduler {
  id = '';
  name = '';
  hasImage: boolean;
  hasText: boolean;
  categories: Category[];
  preview = '';
}

@Injectable()
export class Category {
  category: [''];
  color: [''];
  textColor: [''];
  items: Item[];
}

@Injectable()
export class Item {
  itemText: '';
  itemImage: 'assets/imgs/placeholder_pictogram.png';
  itemFav: boolean = false;
  isPersonal: boolean = false;
}

@Injectable()
export class UserImage{
  id = '';
  name = '';
  url = '';
}


//PDF data export structures

@Injectable()
export class pdfImage{
  image: string = '';
  width: 100;
}

@Injectable()
export class pdfText{
  text: string = '';
  alignment: 'centered';
  pageBreak: string = '';

}

@Injectable()
export class pdfImageRow{
  columns: pdfImage[];
}

@Injectable()
export class pdfTextRow{
  columns: pdfText[];
}
