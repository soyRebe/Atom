import { Pipe, PipeTransform } from '@angular/core';
import {types} from "../config";

@Pipe({
  name: 'labelType',
  standalone: true
})
export class LabelTypePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    const type = types.find( ( type: { value: string, label: string } ) => {
      return value === type.value;
    });

    if ( type ) {
      return type.label
    }

    return null;
  }

}
