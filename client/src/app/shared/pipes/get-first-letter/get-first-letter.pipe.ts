import { SystemService } from '@/shared/services/system/system.service';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getFirstLetter'
})
export class GetFirstLetterPipe implements PipeTransform {
    constructor(private readonly systemService: SystemService) {}

  transform(value: string): string {
    return this.systemService.setFirstLetterOfName(value)
  }

}
