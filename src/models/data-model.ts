export class Scheduler {
  id = 0;
  name = '';
  type = '';
  items: Items[];
}

export class Items {
  image = 'assets/imgs/placeholder_pictogram.png';
  text = '';
}

export const schedulers: Scheduler[] = [
  {
  id: 0,
  name : '',
  type : '',
  items: [
    {image: 'assets/imgs/placeholder_pictogram.png', text: ''},
  ]
},
  {
  id: 1,
  name : 'Hello World',
  type : '',
  items: [
    {image: 'assets/imgs/arasaac/abrazar.png', text: 'Hola'},
    {image: 'assets/imgs/arasaac/abierta.png', text: 'Mundo'}
  ]
},
{
id: 2,
name : 'Sched con 3 items',
type : '',
items: [
  {image: 'assets/imgs/arasaac/ábaco.png', text: 'imagen 1'},
  {image: 'assets/imgs/arasaac/ábaco.png', text: 'imagen 2'},
  {image: 'assets/imgs/arasaac/ábaco.png', text: 'imagen 3'}
]
}

];
