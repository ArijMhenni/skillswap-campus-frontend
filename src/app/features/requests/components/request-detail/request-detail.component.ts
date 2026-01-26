import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestService } from '../../services/request.service';
import { Request, RequestStatus } from '../../models/request.model';
import { StatusColorPipe } from '../../pipes/status-color.pipe';

@Component({
  selector: 'app-request-detail',
  standalone: true,
  imports: [CommonModule, StatusColorPipe],
  templateUrl: './request-detail.component.html',
  styleUrl: './request-detail.component.css'
})
export class RequestDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private requestService = inject(RequestService);

  request = signal<Request | null>(null);
  isLoading = signal<boolean>(true);
  
  RequestStatus = RequestStatus;

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.loadRequest(id);
  }

  loadRequest(id: string): void {
    this.requestService.getRequestById(id).subscribe({
      next: (data) => {
        this.request.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.isLoading.set(false);
        alert('Impossible de charger cette demande');
        this.router.navigate(['/requests']);
      }
    });
  }

  updateStatus(status: RequestStatus): void {
    const req = this.request();
    if (!req) return;

    this.requestService.updateStatus(req.id, status).subscribe({
      next: () => {
        this.loadRequest(req.id);
      },
      error: (err) => {
        console.error('Erreur:', err);
        alert('Erreur lors de la mise à jour');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/requests']);
  }
}