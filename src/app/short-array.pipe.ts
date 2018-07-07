import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'array_Short'})
export class  ArrayShort implements PipeTransform {
  // transform(value: string): string {
  //   let newStr: string = "";
  //   for (var i = value.length - 1; i >= 0; i--) {
  //     newStr += value.charAt(i);
  //   }
  //   return newStr;
  // }

  transform(array: Array<any>, args: string): Array<any> {
    if (typeof args[0] === "undefined") {
        return array;
    }
    let direction = args[0][0];
    let column = args.replace('-','');
    array.sort((a: any, b: any) => {
        let left = Number(new Date(a[column]));
        let right = Number(new Date(b[column]));
        return (direction === "-") ? right - left : left - right;
    });
    return array;
}

}