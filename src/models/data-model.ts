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

/*
export class SchedulerListItem {
  id = '';
  preview = '';
}*/
