import { Injectable } from '@angular/core';

@Injectable()
export class Scheduler {
  id = '';
  name = '';
  type = '';
  items: Items[];
  preview = '';
}

@Injectable()
export class Items {
  image = '';
  text = '';
}

export class SchedulerList {
  schedulers: Scheduler[];
}

/*
export class SchedulerListItem {
  id = '';
  preview = '';
}*/
