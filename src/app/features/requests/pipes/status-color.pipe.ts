import { Pipe, PipeTransform } from '@angular/core';
import { RequestStatus } from '../models/request.model';

@Pipe({
  name: 'statusColor',
  standalone: true
})
export class StatusColorPipe implements PipeTransform {
  transform(status: RequestStatus): string {
    const colors: Record<RequestStatus, string> = {
      [RequestStatus.PENDING]: 'text-orange-600 bg-orange-100',
      [RequestStatus.ACCEPTED]: 'text-green-600 bg-green-100',
      [RequestStatus.REJECTED]: 'text-red-600 bg-red-100',
      [RequestStatus.COMPLETED]: 'text-blue-600 bg-blue-100',
      [RequestStatus.CANCELLED]: 'text-gray-600 bg-gray-100'
    };
    
    return colors[status] || 'text-gray-600 bg-gray-100';
  }
}