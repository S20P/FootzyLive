// import { Pipe, PipeTransform } from '@angular/core';

// @Pipe({name: 'array_Short'})
// export class  ArrayShort implements PipeTransform {
//   // transform(value: string): string {
//   //   let newStr: string = "";
//   //   for (var i = value.length - 1; i >= 0; i--) {
//   //     newStr += value.charAt(i);
//   //   }
//   //   return newStr;
//   // }

//   transform(array: Array<any>, args: string): Array<any> {
//     if (typeof args[0] === "undefined") {
//         return array;
//     }
//     let direction = args[0][0];
//     let column = args.replace('-','');
//     array.sort((a: any, b: any) => {
//         let left = Number(new Date(a[column]));
//         let right = Number(new Date(b[column]));
//         return (direction === "-") ? right - left : left - right;
//     });
//     return array;
// }

// }

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'groupBy'})
export class GroupByPipe implements PipeTransform {
    transform(collection: Array<any>, property: string): Array<any> {
        // prevents the application from breaking if the array of objects doesn't exist yet
        if(!collection) {
            return null;
        }

        const groupedCollection = collection.reduce((previous, current)=> {
            if(!previous[current[property]]) {
                previous[current[property]] = [current];
            } else {
                previous[current[property]].push(current);
            }

            return previous;
        }, {});

        // this will return an array of objects, each object containing a group of objects
        return Object.keys(groupedCollection).map(key => ({ key, value: groupedCollection[key] }));
    }
}