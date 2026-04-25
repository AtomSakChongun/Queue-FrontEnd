import { Component, OnInit, OnDestroy, Input, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QueueComponent } from './component/queue.component';
import { SocketService } from '../../../service/socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ticket-kiosk',
  standalone: true,
  imports: [CommonModule, FormsModule, QueueComponent],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit, OnDestroy {
  @Input() machineId: string = '01';

  isSettingsOpen: boolean = false;
  tempMachineId: string = '';
  showQueue: boolean = false;
  ticketNumber: string = '';
  isWaiting: boolean = false;

  currentTime: Date = new Date();
  private timer: any;
  private ticketSub?: Subscription;

  constructor(
    private socketService: SocketService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.timer = setInterval(() => {
      this.currentTime = new Date();
      this.cdr.markForCheck();
    }, 1000);

    this.ticketSub = this.socketService.getQueueUpdates().subscribe(queue => {
      console.log('Component received queue:', queue);
      this.ticketNumber = queue;
      this.showQueue = true;
      this.isWaiting = false;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
    this.ticketSub?.unsubscribe();
  }

  openSettings() {
    this.tempMachineId = this.machineId;
    this.isSettingsOpen = true;
  }

  closeSettings() {
    this.isSettingsOpen = false;
  }

  saveSettings() {
    this.machineId = this.tempMachineId;
    this.closeSettings();
  }

  switchToHome() {
    this.showQueue = false;
    this.ticketNumber = '';
    this.isWaiting = false;
  }

  handleGetTicket() {
    if (this.isWaiting) return;
    this.isWaiting = true;
    this.socketService.sendAction('take');
  }
}
