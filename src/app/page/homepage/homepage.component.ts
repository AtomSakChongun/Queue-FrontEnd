import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // นำเข้าเพื่อใช้จัดการ Input

@Component({
  selector: 'app-ticket-kiosk',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit, OnDestroy {
  @Input() machineId: string = '01';
  @Output() onGetTicket = new EventEmitter<void>();
  @Output() onResetQueue = new EventEmitter<void>();

  // state สำหรับ Modal
  isSettingsOpen: boolean = false;
  tempMachineId: string = '';

  currentTime: Date = new Date();
  private timer: any;

  ngOnInit(): void {
    this.timer = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  // ฟังก์ชันควบคุม Modal
  openSettings() {
    this.tempMachineId = this.machineId; // เก็บค่าเดิมไว้ในตัวแปรชั่วคราว
    this.isSettingsOpen = true;
  }

  closeSettings() {
    this.isSettingsOpen = false;
  }

  saveSettings() {
    this.machineId = this.tempMachineId;
    this.closeSettings();
  }

  handleGetTicket() { this.onGetTicket.emit(); }
  handleReset() { this.onResetQueue.emit(); }
}