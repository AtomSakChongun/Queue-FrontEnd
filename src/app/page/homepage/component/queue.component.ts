import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { SocketService } from '../../../../service/socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ticket-queue',
  standalone: true,
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.scss']
})
export class QueueComponent implements OnInit, OnDestroy {
  @Input() queueNumber: string = '';
  @Output() onDone = new EventEmitter<void>();

  private queueSub!: Subscription;

  constructor(
    private socketService: SocketService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.queueSub = this.socketService.getQueueUpdates().subscribe(queue => {
      this.queueNumber = queue;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    this.queueSub?.unsubscribe();
  }

  resetAllQueues() {
    if (confirm('ยืนยันการล้างคิวทั้งหมด?')) {
      this.socketService.sendAction('reset');
    }
  }

  takeNext() {
    this.socketService.sendAction('take');
  }

  done() {
    this.onDone.emit();
  }
}
