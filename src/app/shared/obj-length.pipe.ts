import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objLength'
})
export class ObjLengthPipe implements PipeTransform {

  transform(value: any, args: any[] = null): any {
    return Object.keys(value).length//.map(key => value[key]);
  }

}
